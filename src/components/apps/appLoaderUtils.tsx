import * as RNFS from 'react-native-fs';
import * as ZipArchive from 'react-native-zip-archive';
import { apiClient } from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fromByteArray } from 'base64-js';

/**
 * Represents information about a file in the app bundle
 */
interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  type?: string;
}

/**
 * Downloads a zip file containing the app bundle
 * @param appId - The ID of the app to download
 * @param destination - The local path where the zip file should be saved
 */
export const downloadZipFile = async (appId: string, destination: string) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const response = await apiClient.get(`/avatars/agents/${appId}/download/`, {
    responseType: 'arraybuffer',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const uint8Array = new Uint8Array(response.data);
  const base64Data = fromByteArray(uint8Array);
  await RNFS.writeFile(destination, base64Data, 'base64');
};

/**
 * Extracts the contents of a zip file
 * @param zipFilePath - The path to the zip file
 * @param extractPath - The path where the contents should be extracted
 */
export const extractZipFile = async (zipFilePath: string, extractPath: string) => {
  await ZipArchive.unzip(zipFilePath, extractPath);
};

/**
 * Recursively lists all files in a directory
 * @param dirPath - The path to the directory
 * @param depth - The current depth of recursion (used for logging)
 * @returns An array of FileInfo objects representing the files found
 */
export const listFiles = async (dirPath: string, depth: number = 0): Promise<FileInfo[]> => {
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
        // Recursively list files in subdirectories
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

/**
 * Processes the files in the app bundle, inlining CSS and JS, and converting other assets to data URIs
 * @param files - An array of FileInfo objects representing the files in the app bundle
 * @param indexContent - The content of the index.html file
 * @returns The updated content of the index.html file with inlined resources
 */
export const processFiles = async (files: FileInfo[], indexContent: string) => {
  const dataUriMap = new Map<string, string>();

  for (const file of files) {
    if (file.name !== 'index.html' && !file.isDirectory) {
      if (file.name.endsWith('.css') || file.name.endsWith('.js')) {
        // Inline CSS and JS files
        const content = await RNFS.readFile(file.path, 'utf8');
        if (file.name.endsWith('.css')) {
          indexContent = indexContent.replace(`<link rel="stylesheet" href="${file.name}">`, `<style>${content}</style>`);
        } else if (file.name.endsWith('.js')) {
          indexContent = indexContent.replace(`<script type="text/babel" src="${file.name}"></script>`, `<script type="text/babel">${content}</script>`);
        }
        console.log(`${file.name} inlined successfully`);
      } else {
        // Convert other assets to data URIs
        console.log("Getting base64 content for file: ", file.name);
        const content = await RNFS.readFile(file.path, 'base64');
        const mimeType = getMimeType(file.name);
        const dataUri = `data:${mimeType};base64,${content}`;
        dataUriMap.set(file.name, dataUri);
        console.log(`${file.name} converted to data URI successfully`);
      }
    }
  }

  // Replace asset references with data URIs in the index.html content
  for (const [fileName, dataUri] of dataUriMap.entries()) {
    const regex = new RegExp(escapeRegExp(fileName), 'g');
    indexContent = indexContent.replace(regex, dataUri);
    console.log(`Replaced all occurrences of ${fileName} with its data URI`);
  }

  return indexContent;
};

/**
 * Determines the MIME type for a file based on its extension
 * @param filename - The name of the file
 * @returns The MIME type of the file
 */
export const getMimeType = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'svg': return 'image/svg+xml';
    case 'ico': return 'image/x-icon';
    default: return 'application/octet-stream';
  }
};

/**
 * Escapes special characters in a string for use in a regular expression
 * @param string - The string to escape
 * @returns The escaped string
 */
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}