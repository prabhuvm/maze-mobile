import React, { useState, useEffect, FC, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { WebView, WebViewProps, WebViewMessageEvent } from 'react-native-webview';
import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../../GlobalContext';
import { webViewBridgeScript } from './webViewBridge';
import { downloadZipFile, extractZipFile, listFiles, processFiles } from './appLoaderUtils';

interface DynamicAppLoaderProps {
  appId: string;
}

interface WebViewMessage {
  type: string;
  [key: string]: any;
}

/**
 * Custom error class for app loading errors
 */
class AppLoaderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppLoaderError';
  }
}

// WebView configuration object
const webViewConfig: WebViewProps = {
  javaScriptEnabled: true,
  domStorageEnabled: true,
  startInLoadingState: true,
  scalesPageToFit: true,
  originWhitelist: ['*'],
  mixedContentMode: 'always',
  allowsBackForwardNavigationGestures: true,
  allowFileAccess: true,
  allowUniversalAccessFromFileURLs: true,
  allowsInlineMediaPlayback: true,
};

/**
 * DynamicAppLoader component
 * Loads and displays a dynamic app in a WebView
 */
const DynamicAppLoader: FC<DynamicAppLoaderProps> = ({ appId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const { username } = useGlobalContext();

  useEffect(() => {
    loadApp();
    return cleanup;
  }, [appId]);

  /**
   * Loads the app by downloading, extracting, and processing the app files
   */
  const loadApp = async () => {
    try {
      const zipFilePath = `${RNFS.CachesDirectoryPath}/${appId}.zip`;
      const extractPath = `${RNFS.CachesDirectoryPath}/${appId}`;

      await downloadZipFile(appId, zipFilePath);
      await extractZipFile(zipFilePath, extractPath);

      const files = await listFiles(extractPath);
      const indexFile = files.find(f => f.name === 'index.html');
      if (!indexFile) throw new AppLoaderError('index.html not found in the extracted files');

      let indexContent = await RNFS.readFile(indexFile.path, 'utf8');
      indexContent = await processFiles(files, indexContent);
      indexContent = injectWebViewBridge(indexContent);

      setHtmlContent(indexContent);
    } catch (err) {
      console.error('Error loading app:', err);
      setError(err instanceof Error ? err : new AppLoaderError('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cleans up temporary files after the component unmounts
   */
  const cleanup = () => {
    RNFS.unlink(`${RNFS.CachesDirectoryPath}/${appId}.zip`).catch(console.error);
    RNFS.unlink(`${RNFS.CachesDirectoryPath}/${appId}`).catch(console.error);
  };

  /**
   * Injects the WebView bridge script into the HTML content
   * @param content - The original HTML content
   * @returns The HTML content with the injected bridge script
   */
  const injectWebViewBridge = (content: string) => {
    return content.replace('</head>', `<script>${webViewBridgeScript}</script></head>`);
  };

  /**
   * Sends initial data to the WebView after it loads
   */
  const sendMessageToWebView = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const dataToSend = { username, accessToken, agentId: appId };
    webViewRef.current?.postMessage(JSON.stringify(dataToSend));
  };

  /**
   * Handles fetch requests from the WebView
   * @param data - The fetch request data
   */
  const handleFetchRequest = async (data: WebViewMessage) => {
    const { url, method, headers, body } = data;
    try {
      const response = await fetch(url, { method, headers, body });
      const responseBody = await response.text();
      const responseHeaders = Object.fromEntries(response.headers.entries());
      
      // Send the response back to the WebView
      webViewRef.current?.injectJavaScript(`
        window.postMessage(JSON.stringify({
          type: 'FETCH_RESPONSE',
          ok: ${response.ok},
          status: ${response.status},
          headers: ${JSON.stringify(responseHeaders)},
          body: ${JSON.stringify(responseBody)}
        }), '*');
      `);
    } catch (error) {
      // Send error response back to the WebView
      webViewRef.current?.injectJavaScript(`
        window.postMessage(JSON.stringify({
          type: 'FETCH_RESPONSE',
          ok: false,
          error: '${error instanceof Error ? error.message : 'Unknown error'}'
        }), '*');
      `);
    }
  };

  /**
   * Handles messages received from the WebView
   * @param event - The WebView message event
   */
  const onMessage = (event: WebViewMessageEvent) => {
    const data: WebViewMessage = JSON.parse(event.nativeEvent.data);
    switch (data.type) {
      case 'FETCH_REQUEST':
        handleFetchRequest(data);
        break;
      default:
        console.log('Message received from WebView:', data);
    }
  };

  // Render loading, error, or failed states if necessary
  if (loading) return <LoadingView />;
  if (error) return <ErrorView error={error.message} />;
  if (!htmlContent) return <FailedLoadView />;

  // Render the WebView with the loaded content
  return (
    <WebView
      {...webViewConfig}
      source={{ html: htmlContent, baseUrl: '' }}
      onLoad={sendMessageToWebView}
      ref={webViewRef}
      style={styles.container}
      onError={(syntheticEvent) => {
        console.error('WebView error: ', syntheticEvent.nativeEvent);
      }}
      onMessage={onMessage}
      onHttpError={(syntheticEvent) => {
        console.error('WebView HTTP error: ', syntheticEvent.nativeEvent);
      }}
    />
  );
};

/**
 * LoadingView component
 * Displays a loading indicator and message
 */
const LoadingView: FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Loading game...</Text>
  </View>
);

/**
 * ErrorView component
 * Displays an error message
 */
const ErrorView: FC<{ error: string }> = ({ error }) => (
  <View style={styles.container}>
    <Text>Error: {error}</Text>
  </View>
);

/**
 * FailedLoadView component
 * Displays a message when the app fails to load
 */
const FailedLoadView: FC = () => (
  <View style={styles.container}>
    <Text>Failed to load game</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});

export default DynamicAppLoader;
