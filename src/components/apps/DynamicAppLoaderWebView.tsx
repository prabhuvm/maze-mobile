import React, { useState, useEffect, FC, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import * as RNFS from 'react-native-fs';
import * as ZipArchive from 'react-native-zip-archive';
import { apiClient } from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fromByteArray } from 'base64-js';
import { useGlobalContext } from '../../GlobalContext';

interface DynamicAppLoaderProps {
  appId: string;
}

interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  type?: string;
}

const DynamicAppLoader: FC<DynamicAppLoaderProps> = ({ appId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const webViewRef = useRef(null);
  const { username } = useGlobalContext();

  useEffect(() => {
    const loadApp = async () => {
      try {
        // Step 1: Download the zip file
        const zipFilePath = `${RNFS.CachesDirectoryPath}/${appId}.zip`;
        await downloadZipFile(appId, zipFilePath);
        console.log("Zip file downloaded");

        // Step 2: Unzip the file
        const extractPath = `${RNFS.CachesDirectoryPath}/${appId}`;
        await ZipArchive.unzip(zipFilePath, extractPath);
        console.log("Zip extract complete:", extractPath);

        // Step 3: List all files in the extracted directory
        const files = await listFiles(extractPath);
        console.log("Files found:", files.map(f => f.name));

        // Step 4: Read the index.html file
        const indexFile = files.find(f => f.name === 'index.html');
        if (!indexFile) {
          throw new Error('index.html not found in the extracted files');
        }
        let indexContent = await RNFS.readFile(indexFile.path, 'utf8');
        console.log("Index.html content loaded");

        // Step 5: Process files and inline or convert to data URIs
        indexContent = await processFiles(files, indexContent);

        // Inject the message handling script
        const injectedScript = `
          <script>
          (function() {
            const originalFetch = window.fetch;
            window.fetch = async function(url, options) {
              return new Promise((resolve, reject) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'FETCH_REQUEST',
                  url: url,
                  options: options
                }));
                
                window.addEventListener('message', function responseHandler(event) {
                  const data = JSON.parse(event.data);
                  if (data.type === 'FETCH_RESPONSE') {
                    window.removeEventListener('message', responseHandler);
                    if (data.ok) {
                      resolve(new Response(data.body, {
                        status: data.status,
                        headers: data.headers
                      }));
                    } else {
                      reject(new Error(data.error));
                    }
                  }
                });
              });
            };
          })();
          </script>
        `;
        indexContent = indexContent.replace('</head>', `${injectedScript}</head>`);

        setHtmlContent(indexContent);
      } catch (err) {
        console.error('Error loading app:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadApp();

    // Cleanup function
    return () => {
      // Remove downloaded and extracted files
      RNFS.unlink(`${RNFS.CachesDirectoryPath}/${appId}.zip`).catch(console.error);
      RNFS.unlink(`${RNFS.CachesDirectoryPath}/${appId}`).catch(console.error);
    };
  }, [appId]);

  const sendMessageToWebView = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const dataToSend = {
      username: username,
      accessToken: accessToken,
      agentId: appId
    };

    const message = JSON.stringify(dataToSend);
    webViewRef.current.postMessage(message);
  };

  const onMessage = async (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'FETCH_REQUEST') {
      try {
        const response = await fetch(data.url, data.options);
        const responseBody = await response.text();
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        webViewRef.current.injectJavaScript(`
          window.postMessage(JSON.stringify({
            type: 'FETCH_RESPONSE',
            ok: ${response.ok},
            status: ${response.status},
            headers: ${JSON.stringify(responseHeaders)},
            body: ${JSON.stringify(responseBody)}
          }), '*');
        `);
      } catch (error) {
        webViewRef.current.injectJavaScript(`
          window.postMessage(JSON.stringify({
            type: 'FETCH_RESPONSE',
            ok: false,
            error: '${error.message}'
          }), '*');
        `);
      }
    } else {
      console.log('Message received from WebView:', event.nativeEvent.data);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading game...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!htmlContent) {
    return (
      <View style={styles.container}>
        <Text>Failed to load game</Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ html: htmlContent, baseUrl: '' }}
      onLoad={() => sendMessageToWebView()}
      ref={webViewRef}
      style={styles.container}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true}
      originWhitelist={['*']}
      mixedContentMode="always"
      allowsBackForwardNavigationGestures={true}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      allowsInlineMediaPlayback={true}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error: ', nativeEvent);
      }}
      onMessage={onMessage}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView HTTP error: ', nativeEvent);
      }}
    />
  );
};

const downloadZipFile = async (appId: string, destination: string) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const response = await apiClient.get(`/avatars/agents/${appId}/download/`,
    { responseType: 'arraybuffer',
      headers: { 
      Authorization: `Bearer ${accessToken}` 
   }});
  
   console.log("Game is downloaded");
   const uint8Array = new Uint8Array(response.data);
   const base64Data = fromByteArray(uint8Array);
   await RNFS.writeFile(destination, base64Data, 'base64');
   console.log("Game is written to file system");
};

const listFiles = async (dirPath: string, depth: number = 0): Promise<FileInfo[]> => {
  console.log(`Scanning directory (depth ${depth}):`, dirPath);
  
  try {
    const files = await RNFS.readDir(dirPath);
    const fileInfos: FileInfo[] = [];

    for (const file of files) {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      console.log(`Found file: ${file.name}, isDirectory: ${file.isDirectory()}, type: ${fileType || 'unknown'}`);

      const fileInfo: FileInfo = {
        name: file.name,
        path: file.path,
        isDirectory: file.isDirectory(),
        type: fileType
      };

      fileInfos.push(fileInfo);

      if (file.isDirectory()) {
        const subFiles = await listFiles(file.path, depth + 1);
        fileInfos.push(...subFiles);
      }
    }

    return fileInfos;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
};

const processFiles = async (files: FileInfo[], indexContent: string) => {
  const dataUriMap = new Map<string, string>();

  for (const file of files) {
    if (file.name !== 'index.html' && !file.isDirectory) {
      if (file.name.endsWith('.css') || file.name.endsWith('.js')) {
        // For CSS and JS files, read as UTF-8 and inline
        const content = await RNFS.readFile(file.path, 'utf8');
        if (file.name.endsWith('.css')) {
          indexContent = indexContent.replace(`<link rel="stylesheet" href="${file.name}">`, `<style>${content}</style>`);
        } else if (file.name.endsWith('.js')) {
          indexContent = indexContent.replace(`<script type="text/babel" src="${file.name}"></script>`, `<script type="text/babel">${content}</script>`);
        }
        console.log(`${file.name} inlined successfully`);
      } else {
        // For other files (like images), read as base64 and create data URIs
        console.log("Getting base64 content for file: ", file.name);
        const content = await RNFS.readFile(file.path, 'base64');
        const mimeType = getMimeType(file.name);
        const dataUri = `data:${mimeType};base64,${content}`;
        dataUriMap.set(file.name, dataUri);
        console.log(`${file.name} converted to data URI successfully`);
      }
    }
  }

  // Replace all file references with their corresponding data URIs
  for (const [fileName, dataUri] of dataUriMap.entries()) {
    const regex = new RegExp(escapeRegExp(fileName), 'g');
    indexContent = indexContent.replace(regex, dataUri);
    console.log(`Replaced all occurrences of ${fileName} with its data URI`);
  }

  return indexContent;
};

// Helper function to escape special characters in filenames for use in regex
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getMimeType(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'svg': return 'image/svg+xml';
    case 'ico': return 'image/x-icon';
    // Add more cases as needed
    default: return 'application/octet-stream';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});

export default DynamicAppLoader;