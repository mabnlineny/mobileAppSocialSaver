/**
 * File System Adapter
 * 
 * This module provides a consistent interface for file system operations
 * across different platforms (web and native).
 * 
 * For web, it uses browser-compatible methods.
 * For native, it would use react-native-fs or similar libraries.
 */

import { Platform } from 'react-native';
import { isWeb } from './platform';
import * as FileSystem from './fileSystemWeb';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
const HISTORY_STORAGE_KEY = 'download_history';

/**
 * Prepare folder structure for downloads
 */
export const prepareFolderStructure = async () => {
  // If we're on the web, use web implementation
  if (isWeb) {
    return FileSystem.prepareFolderStructure();
  }
  
  // For native platforms, this would call the native implementation
  // Not implementing native functionality for this demo
  console.log('Native folder structure preparation');
  return true;
};

/**
 * Download a file to the appropriate folder
 * @param {string} url - URL to download from
 * @param {string} fileName - File name to save as
 * @param {string} fileType - File type (video or audio)
 * @param {function} onProgress - Progress callback
 * @returns {Promise} - Promise with download result
 */
export const downloadFile = async (url, fileName, fileType = 'video', onProgress) => {
  try {
    if (isWeb) {
      return await FileSystem.downloadFile(url, fileName, fileType, onProgress);
    }
    
    // For native platforms (simplified for demo)
    console.log(`Downloading ${url} as ${fileName} (${fileType})`);
    
    // Simulate progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      if (progress > 1) {
        clearInterval(interval);
        progress = 1;
      }
      onProgress?.(progress);
    }, 300);
    
    // Simulate download completion
    return new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(interval);
        resolve({
          success: true,
          filePath: `/download/${fileName}`,
          fileSize: 15000000, // 15MB
          mimeType: fileType === 'video' ? 'video/mp4' : 'image/jpeg'
        });
      }, 3000);
    });
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

/**
 * Save download to history
 * @param {Object} downloadInfo - Download information
 */
export const saveToHistory = async (downloadInfo) => {
  try {
    const history = await getDownloadHistory();
    history.unshift({
      ...downloadInfo,
      id: Date.now().toString(),
      timestamp: downloadInfo.timestamp || new Date().toISOString()
    });
    
    // Limit history to 100 items
    const limitedHistory = history.slice(0, 100);
    
    // Save to storage
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitedHistory));
    
    return true;
  } catch (error) {
    console.error('Error saving to history:', error);
    return false;
  }
};

/**
 * Get download history
 * @returns {Array} - Download history
 */
export const getDownloadHistory = async () => {
  try {
    const historyData = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

/**
 * Clear download history
 */
export const clearDownloadHistory = async () => {
  try {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};

/**
 * Check storage space (mock implementation)
 * @returns {Object} - Storage space information
 */
export const checkStorageSpace = async () => {
  // For web, we can't reliably get storage info
  if (isWeb) {
    return {
      freeSpace: 1000000000, // 1GB
      totalSpace: 5000000000, // 5GB
      usedSpace: 100000000    // 100MB
    };
  }
  
  // For native platforms (simplified)
  return {
    freeSpace: 1000000000,
    totalSpace: 5000000000,
    usedSpace: 100000000
  };
};

/**
 * Get folder size (mock implementation)
 * @returns {number} - Folder size in bytes
 */
export const getFolderSize = async () => {
  return 50000000; // 50MB
};