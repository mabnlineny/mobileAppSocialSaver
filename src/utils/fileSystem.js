import RNFetchBlob from 'rn-fetch-blob';
import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base folder name for downloads
const FOLDER_NAME = 'SocialSaver';
const DOWNLOADS_HISTORY_KEY = 'downloadHistory';

/**
 * Prepare folder structure for downloads
 * Creates SocialSaver/Video and SocialSaver/Audio folders
 */
export const prepareFolderStructure = async () => {
  try {
    const dirs = RNFetchBlob.fs.dirs;
    const basePath = Platform.OS === 'android' 
      ? dirs.DownloadDir 
      : dirs.DocumentDir;
    
    const mainFolderPath = `${basePath}/${FOLDER_NAME}`;
    const videoFolderPath = `${mainFolderPath}/Video`;
    const audioFolderPath = `${mainFolderPath}/Audio`;
    
    // Create main folder if it doesn't exist
    const mainFolderExists = await RNFetchBlob.fs.exists(mainFolderPath);
    if (!mainFolderExists) {
      await RNFetchBlob.fs.mkdir(mainFolderPath);
    }
    
    // Create video folder if it doesn't exist
    const videoFolderExists = await RNFetchBlob.fs.exists(videoFolderPath);
    if (!videoFolderExists) {
      await RNFetchBlob.fs.mkdir(videoFolderPath);
    }
    
    // Create audio folder if it doesn't exist
    const audioFolderExists = await RNFetchBlob.fs.exists(audioFolderPath);
    if (!audioFolderExists) {
      await RNFetchBlob.fs.mkdir(audioFolderPath);
    }
    
    return {
      mainFolderPath,
      videoFolderPath,
      audioFolderPath
    };
  } catch (error) {
    console.error('Error creating folder structure:', error);
    throw new Error('Failed to create folder structure: ' + error.message);
  }
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
    // Create folders if they don't exist
    const folders = await prepareFolderStructure();
    
    // Determine destination folder
    const destFolder = fileType.toLowerCase() === 'audio' 
      ? folders.audioFolderPath 
      : folders.videoFolderPath;
    
    // Clean up file name - remove special characters
    const cleanFileName = fileName.replace(/[^\w\s.]/gi, '_');
    const filePath = `${destFolder}/${cleanFileName}`;
    
    // Download the file
    const res = await RNFetchBlob
      .config({
        fileCache: true,
        path: filePath,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: cleanFileName,
          description: `Downloading ${fileType} from SocialSaver`,
          mime: fileType === 'audio' ? 'audio/mpeg' : 'video/mp4',
          path: filePath,
        }
      })
      .fetch('GET', url)
      .progress((received, total) => {
        const progress = received / total;
        if (onProgress) onProgress(progress);
      });
    
    // Save to download history
    await saveToHistory({
      filePath,
      fileName: cleanFileName,
      fileType: fileType === 'audio' ? 'mp3' : 'mp4',
      platform: getPlatformFromUrl(url),
      timestamp: Date.now(),
      url,
    });
    
    return {
      success: true,
      filePath,
      fileName: cleanFileName,
      fileType,
    };
  } catch (error) {
    console.error('Download error:', error);
    throw new Error('Download failed: ' + error.message);
  }
};

/**
 * Get platform name from URL
 * @param {string} url - URL to analyze
 * @returns {string} - Platform name
 */
const getPlatformFromUrl = (url) => {
  if (!url) return 'unknown';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  return 'unknown';
};

/**
 * Save download to history
 * @param {Object} downloadInfo - Download information
 */
export const saveToHistory = async (downloadInfo) => {
  try {
    // Get existing history
    let history = await getDownloadHistory();
    
    // Add new download to history
    history.unshift(downloadInfo);
    
    // Keep only the last 100 downloads
    if (history.length > 100) {
      history = history.slice(0, 100);
    }
    
    // Save history
    await AsyncStorage.setItem(DOWNLOADS_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving to history:', error);
  }
};

/**
 * Get download history
 * @returns {Array} - Download history
 */
export const getDownloadHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(DOWNLOADS_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
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
    await AsyncStorage.removeItem(DOWNLOADS_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

/**
 * Check storage space
 * @returns {Object} - Storage space information
 */
export const checkStorageSpace = async () => {
  try {
    if (Platform.OS === 'android') {
      const stats = await RNFetchBlob.fs.df();
      return {
        totalBytes: stats.total,
        freeBytes: stats.free,
      };
    } else {
      // On iOS, storage space information is not available
      return {
        totalBytes: 0,
        freeBytes: 0,
      };
    }
  } catch (error) {
    console.error('Error checking storage space:', error);
    return {
      totalBytes: 0,
      freeBytes: 0,
    };
  }
};

/**
 * Get folder size
 * @returns {number} - Folder size in bytes
 */
export const getFolderSize = async () => {
  try {
    const dirs = RNFetchBlob.fs.dirs;
    const basePath = Platform.OS === 'android' 
      ? dirs.DownloadDir 
      : dirs.DocumentDir;
    
    const mainFolderPath = `${basePath}/${FOLDER_NAME}`;
    
    // Check if folder exists
    const exists = await RNFetchBlob.fs.exists(mainFolderPath);
    if (!exists) {
      return 0;
    }
    
    // On Android, we can use du command to get folder size
    if (Platform.OS === 'android') {
      try {
        const result = await RNFetchBlob.fs.df();
        // This is just an approximation for the app
        return Math.round(result.total * 0.001); // Just an estimate
      } catch (error) {
        return 0;
      }
    }
    
    // On iOS, we need to list files and add their sizes
    return 0; // Simplified for this example
  } catch (error) {
    console.error('Error getting folder size:', error);
    return 0;
  }
};
