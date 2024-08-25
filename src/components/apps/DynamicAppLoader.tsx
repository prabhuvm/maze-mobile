import React, { useState, useEffect, FC } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import * as RNFS from 'react-native-fs';
import * as ZipArchive from 'react-native-zip-archive';
import { apiClient } from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fromByteArray } from 'base64-js';

interface DynamicAppLoaderProps {
  appId: string;
}

const DynamicAppLoader: FC<DynamicAppLoaderProps> = ({ appId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [AppComponent, setAppComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadApp = async () => {
      try {
        // Step 1: Download the zip file
        const zipFilePath = `${RNFS.CachesDirectoryPath}/${appId}.zip`;
        await downloadZipFile(appId, zipFilePath);
        console.log("Zip extract start");

        // Step 2: Unzip the file
        const extractPath = `${RNFS.CachesDirectoryPath}/${appId}`;
        await ZipArchive.unzip(zipFilePath, extractPath);

        console.log("Listing all files in the extracted directory:");
        await listFiles(extractPath);
        
        console.log("Zip extract complete:", extractPath);

        // Step 3: Find the main entry file (assumed to be 'index.js')
        const mainFilePath = await findMainFile(extractPath, 'index.js');
        console.log("Main file path:", mainFilePath);

        if (!mainFilePath) {
          throw new Error('Could not find main entry file');
        }

        // Step 4: Read the main file
        const mainContent = await RNFS.readFile(mainFilePath, 'utf8');
        console.log("Main file content:", mainContent);
        console.log("File read complete:", mainFilePath);

        // Step 5: Evaluate the game component
        const gameExports = {};
        const gameModule = { exports: gameExports };
        const gameRequire = createRequire(extractPath);

        const evalFunc = new Function('module', 'exports', 'require', 'React', 'ReactNative', mainContent);
        evalFunc(gameModule, gameExports, gameRequire, React, require('react-native'));

        console.log("Evaluate complete");

        const GameComponent = gameModule.exports.default || gameModule.exports;

        if (typeof GameComponent !== 'function') {
          throw new Error('Invalid game component');
        }

        setAppComponent(() => GameComponent);
      } catch (err) {
        console.error('Error loading app :', err);
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

  if (!AppComponent) {
    return (
      <View style={styles.container}>
        <Text>Failed to load game</Text>
      </View>
    );
  }

  return <AppComponent />;
};

const downloadZipFile = async (appId: string, destination: string) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const appIdt = 'EDGWmdlO';
  const response = await apiClient.get(`/avatars/agents/${appIdt}/download/`,
    { responseType: 'arraybuffer',
      headers: { 
      Authorization: `Bearer ${accessToken}` 
   }});
  
   console.log("Game is downloaded");
   const uint8Array = new Uint8Array(response.data);
   const base64Data = fromByteArray(uint8Array);
   await RNFS.writeFile(destination, base64Data, 'base64');
   console.log("Game is written");
};

const findMainFile = async (dirPath: string, fileName: string): Promise<string | null> => {
  console.log('Searching for main file in:', dirPath);
  const files = await RNFS.readDir(dirPath);
  console.log('Files found:', files.map(f => f.name));
  
  // Recursively search for the specified file in the directory
  for (const file of files) {
    if (file.isDirectory()) {
      // If it's a directory, recursively search inside it
      const result = await findMainFile(file.path, fileName);
      if (result) return result;
    } else if (file.name === fileName) {
      // If it's the main file, return its path
      console.log('Found main file:', file.path);
      return file.path;
    }
  }

  console.log('No main file found in:', dirPath);
  return null;
};

const listFiles = async (dirPath: string, indent: string = '') => {
  const files = await RNFS.readDir(dirPath);
  for (const file of files) {
    console.log(`${indent}${file.path} ${file.isDirectory() ? '(dir)' : `(file, ${file.size} bytes)`}`);
    if (file.isDirectory()) {
      await listFiles(file.path, indent + '  ');
    }
  }
};

const createRequire = (basePath) => {
  return async (path) => {
    if (path === 'react') return React;
    if (path === 'react-native') return require('react-native');

    let fullPath;

    // Resolve the full path
    if (path.startsWith('./')) {
      fullPath = `${basePath}/${path.slice(2)}`; // Remove './' from the start
    } else if (path.startsWith('../')) {
      fullPath = `${basePath}/${path}`; // Handle '../' correctly
    } else if (path.startsWith('.')) {
      fullPath = `${basePath}/${path.slice(1)}`; // Remove '.' from the start
    } else {
      fullPath = path;
    }

    // Add `.js` extension if missing
    if (!fullPath.endsWith('.js')) {
      fullPath += '.js';
    }

    console.log(`Requiring path: ${path}, resolved fullPath: ${fullPath}`);

    try {
      const content = await RNFS.readFile(fullPath, 'utf8');
      const exports = {};
      const module = { exports };

      const evalFunc = new Function('module', 'exports', 'require', 'React', 'ReactNative', content);
      await evalFunc(module, exports, createRequire(basePath), React, require('react-native'));

      return module.exports;
    } catch (error) {
      console.error(`Failed to load module at path: ${fullPath}`, error);
      throw error;
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  } as ViewStyle,
});

export default DynamicAppLoader;
