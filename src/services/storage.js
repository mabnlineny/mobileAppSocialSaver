/**
 * Storage Service
 * 
 * This module provides functions for handling file system operations,
 * folder creation, and file saving in web and native platforms.
 */

import { Platform } from 'react-native';
import { isWeb } from '../utils/platform';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { downloadFile } from '../utils/fileSystemAdapter';

// Constants for folder structure
export const FOLDERS = {
  ROOT: 'SocialSaver',
  VIDEO: 'Video',
  AUDIO: 'Audio',
  IMAGE: 'Image',
};

// Constants for storage keys
const STORAGE_KEYS = {
  DOWNLOAD_HISTORY: 'social_saver_download_history',
  SETTINGS: 'social_saver_settings',
  USER_PROFILE: 'social_saver_user_profile',
  ONBOARDING_COMPLETED: 'social_saver_onboarding_completed',
  AGE_CONSENT_GIVEN: 'social_saver_age_consent_given',
};

/**
 * Create folder structure for downloads
 * - SocialSaver
 *   - Video
 *   - Audio
 *   - Image
 */
export const createFolderStructure = async () => {
  try {
    if (isWeb) {
      // Web doesn't need folder creation
      return true;
    }
    
    // Create main folder
    await prepareFolderStructure();
    
    // Success message
    console.log('Folder structure created successfully');
    return true;
  } catch (error) {
    console.error('Error creating folder structure:', error);
    return false;
  }
};

/**
 * Save a file to the appropriate folder
 * @param {string} url - URL of the file to download
 * @param {string} fileName - Name to save the file as
 * @param {string} fileType - Type of file (video, audio, image)
 * @param {function} onProgress - Progress callback
 * @returns {Promise} - Promise with download result
 */
export const saveFile = async (url, fileName, fileType = 'video', onProgress) => {
  try {
    // Determine folder based on file type
    let folder;
    switch (fileType.toLowerCase()) {
      case 'video':
        folder = FOLDERS.VIDEO;
        break;
      case 'audio':
        folder = FOLDERS.AUDIO;
        break;
      case 'image':
      case 'photo':
        folder = FOLDERS.IMAGE;
        break;
      default:
        folder = FOLDERS.VIDEO;
    }
    
    // Download the file
    const result = await downloadFile(url, fileName, fileType, onProgress);
    
    // Return download information
    return {
      success: true,
      filePath: result.filePath,
      fileName,
      fileType,
      fileSize: result.fileSize || 0,
      folder,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Save file error:', error);
    throw new Error(`Failed to save file: ${error.message}`);
  }
};

/**
 * Save download to history
 * @param {Object} downloadInfo - Download information
 * @returns {Promise<boolean>} - Success indicator
 */
export const saveToHistory = async (downloadInfo) => {
  try {
    // Get existing history
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOAD_HISTORY);
    const history = historyData ? JSON.parse(historyData) : [];
    
    // Add new download to beginning of history
    history.unshift({
      ...downloadInfo,
      id: Date.now().toString(),
      timestamp: downloadInfo.timestamp || new Date().toISOString(),
    });
    
    // Limit history to 100 entries
    const limitedHistory = history.slice(0, 100);
    
    // Save updated history
    await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOAD_HISTORY, JSON.stringify(limitedHistory));
    
    return true;
  } catch (error) {
    console.error('Save to history error:', error);
    return false;
  }
};

/**
 * Get download history
 * @param {number} limit - Maximum number of history items to return
 * @returns {Promise<Array>} - Download history
 */
export const getDownloadHistory = async (limit = 100) => {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOAD_HISTORY);
    const history = historyData ? JSON.parse(historyData) : [];
    
    return history.slice(0, limit);
  } catch (error) {
    console.error('Get history error:', error);
    return [];
  }
};

/**
 * Clear download history
 * @returns {Promise<boolean>} - Success indicator
 */
export const clearDownloadHistory = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOAD_HISTORY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Clear history error:', error);
    return false;
  }
};

/**
 * Delete a download from history
 * @param {string} downloadId - ID of the download to delete
 * @returns {Promise<boolean>} - Success indicator
 */
export const deleteDownload = async (downloadId) => {
  try {
    // Get existing history
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOAD_HISTORY);
    const history = historyData ? JSON.parse(historyData) : [];
    
    // Remove the download
    const updatedHistory = history.filter(item => item.id !== downloadId);
    
    // Save updated history
    await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOAD_HISTORY, JSON.stringify(updatedHistory));
    
    return true;
  } catch (error) {
    console.error('Delete download error:', error);
    return false;
  }
};

/**
 * Check if onboarding has been completed
 * @returns {Promise<boolean>} - Whether onboarding has been completed
 */
export const isOnboardingCompleted = async () => {
  try {
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === 'true';
  } catch (error) {
    console.error('Onboarding check error:', error);
    return false;
  }
};

/**
 * Mark onboarding as completed
 * @returns {Promise<boolean>} - Success indicator
 */
export const completeOnboarding = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    return true;
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return false;
  }
};

/**
 * Check if age consent has been given
 * @returns {Promise<boolean>} - Whether age consent has been given
 */
export const isAgeConsentGiven = async () => {
  try {
    const consent = await AsyncStorage.getItem(STORAGE_KEYS.AGE_CONSENT_GIVEN);
    return consent === 'true';
  } catch (error) {
    console.error('Age consent check error:', error);
    return false;
  }
};

/**
 * Give age consent
 * @returns {Promise<boolean>} - Success indicator
 */
export const giveAgeConsent = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AGE_CONSENT_GIVEN, 'true');
    return true;
  } catch (error) {
    console.error('Give age consent error:', error);
    return false;
  }
};

/**
 * Save user settings
 * @param {Object} settings - User settings
 * @returns {Promise<boolean>} - Success indicator
 */
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Save settings error:', error);
    return false;
  }
};

/**
 * Get user settings
 * @returns {Promise<Object>} - User settings
 */
export const getSettings = async () => {
  try {
    const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsData ? JSON.parse(settingsData) : null;
  } catch (error) {
    console.error('Get settings error:', error);
    return null;
  }
};

/**
 * Calculate total storage used by downloads
 * @returns {Promise<number>} - Total storage used in bytes
 */
export const calculateStorageUsed = async () => {
  try {
    // For web, return mock data
    if (isWeb) {
      return 50 * 1024 * 1024; // 50MB
    }
    
    // For native, would implement actual storage calculation
    // This is a placeholder for demonstration
    return 50 * 1024 * 1024; // 50MB
  } catch (error) {
    console.error('Calculate storage error:', error);
    return 0;
  }
};

export default {
  createFolderStructure,
  saveFile,
  saveToHistory,
  getDownloadHistory,
  clearDownloadHistory,
  deleteDownload,
  isOnboardingCompleted,
  completeOnboarding,
  isAgeConsentGiven,
  giveAgeConsent,
  saveSettings,
  getSettings,
  calculateStorageUsed,
};