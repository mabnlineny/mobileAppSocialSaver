/**
 * Logger Service
 * 
 * This module provides functions for logging user activity
 * and download events using SQLite for local storage.
 */

import { Platform } from 'react-native';
import { isWeb } from '../utils/platform';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { downloaderApi } from './api';

// Storage key for logs in web environment
const LOGS_STORAGE_KEY = 'social_saver_activity_logs';

// Log types
export const LOG_TYPES = {
  DOWNLOAD_ATTEMPT: 'download_attempt',
  DOWNLOAD_SUCCESS: 'download_success',
  DOWNLOAD_FAILURE: 'download_failure',
  APP_LAUNCH: 'app_launch',
  SETTINGS_CHANGE: 'settings_change',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_SIGNUP: 'user_signup',
  AGE_CONSENT: 'age_consent',
  ERROR: 'error',
};

/**
 * Log download attempt
 * @param {Object} downloadInfo - Download information
 * @param {string} userId - User ID (optional)
 */
export const logDownloadAttempt = async (downloadInfo, userId = null) => {
  try {
    const logData = {
      type: LOG_TYPES.DOWNLOAD_ATTEMPT,
      timestamp: new Date().toISOString(),
      userId,
      data: {
        url: downloadInfo.url,
        platform: downloadInfo.platform,
        fileType: downloadInfo.fileType || 'unknown',
      },
    };
    
    // Save to local storage
    await saveLog(logData);
    
    // Send to server if available
    try {
      await downloaderApi.logDownload({
        email: userId,
        type: downloadInfo.fileType || 'video',
        status: 'attempt',
        meta: downloadInfo,
        ageConsent: await AsyncStorage.getItem('age_consent') === 'true',
      });
    } catch (error) {
      console.warn('Failed to send log to server:', error);
    }
  } catch (error) {
    console.error('Log download attempt error:', error);
  }
};

/**
 * Log download success
 * @param {Object} downloadInfo - Download information
 * @param {string} userId - User ID (optional)
 */
export const logDownloadSuccess = async (downloadInfo, userId = null) => {
  try {
    const logData = {
      type: LOG_TYPES.DOWNLOAD_SUCCESS,
      timestamp: new Date().toISOString(),
      userId,
      data: {
        url: downloadInfo.url,
        platform: downloadInfo.platform,
        fileType: downloadInfo.fileType || 'unknown',
        filePath: downloadInfo.filePath,
        fileSize: downloadInfo.fileSize,
      },
    };
    
    // Save to local storage
    await saveLog(logData);
    
    // Send to server if available
    try {
      await downloaderApi.logDownload({
        email: userId,
        type: downloadInfo.fileType || 'video',
        status: 'complete',
        meta: downloadInfo,
        ageConsent: await AsyncStorage.getItem('age_consent') === 'true',
      });
    } catch (error) {
      console.warn('Failed to send log to server:', error);
    }
  } catch (error) {
    console.error('Log download success error:', error);
  }
};

/**
 * Log download failure
 * @param {Object} downloadInfo - Download information
 * @param {string} errorMessage - Error message
 * @param {string} userId - User ID (optional)
 */
export const logDownloadFailure = async (downloadInfo, errorMessage, userId = null) => {
  try {
    const logData = {
      type: LOG_TYPES.DOWNLOAD_FAILURE,
      timestamp: new Date().toISOString(),
      userId,
      data: {
        url: downloadInfo.url,
        platform: downloadInfo.platform,
        fileType: downloadInfo.fileType || 'unknown',
        error: errorMessage,
      },
    };
    
    // Save to local storage
    await saveLog(logData);
    
    // Send to server if available
    try {
      await downloaderApi.logDownload({
        email: userId,
        type: downloadInfo.fileType || 'video',
        status: 'attempt', // Still an attempt, just failed
        meta: { ...downloadInfo, error: errorMessage },
        ageConsent: await AsyncStorage.getItem('age_consent') === 'true',
      });
    } catch (error) {
      console.warn('Failed to send log to server:', error);
    }
  } catch (error) {
    console.error('Log download failure error:', error);
  }
};

/**
 * Log app launch
 * @param {string} userId - User ID (optional)
 */
export const logAppLaunch = async (userId = null) => {
  try {
    const logData = {
      type: LOG_TYPES.APP_LAUNCH,
      timestamp: new Date().toISOString(),
      userId,
      data: {
        platform: Platform.OS,
        version: Platform.Version,
      },
    };
    
    // Save to local storage
    await saveLog(logData);
  } catch (error) {
    console.error('Log app launch error:', error);
  }
};

/**
 * Log settings change
 * @param {Object} settings - Changed settings
 * @param {string} userId - User ID (optional)
 */
export const logSettingsChange = async (settings, userId = null) => {
  try {
    const logData = {
      type: LOG_TYPES.SETTINGS_CHANGE,
      timestamp: new Date().toISOString(),
      userId,
      data: settings,
    };
    
    // Save to local storage
    await saveLog(logData);
  } catch (error) {
    console.error('Log settings change error:', error);
  }
};

/**
 * Log user login
 * @param {string} userId - User ID
 */
export const logUserLogin = async (userId) => {
  try {
    const logData = {
      type: LOG_TYPES.USER_LOGIN,
      timestamp: new Date().toISOString(),
      userId,
      data: {
        platform: Platform.OS,
      },
    };
    
    // Save to local storage
    await saveLog(logData);
  } catch (error) {
    console.error('Log user login error:', error);
  }
};

/**
 * Log user logout
 * @param {string} userId - User ID
 */
export const logUserLogout = async (userId) => {
  try {
    const logData = {
      type: LOG_TYPES.USER_LOGOUT,
      timestamp: new Date().toISOString(),
      userId,
      data: {
        platform: Platform.OS,
      },
    };
    
    // Save to local storage
    await saveLog(logData);
  } catch (error) {
    console.error('Log user logout error:', error);
  }
};

/**
 * Log user signup
 * @param {string} userId - User ID
 */
export const logUserSignup = async (userId) => {
  try {
    const logData = {
      type: LOG_TYPES.USER_SIGNUP,
      timestamp: new Date().toISOString(),
      userId,
      data: {
        platform: Platform.OS,
      },
    };
    
    // Save to local storage
    await saveLog(logData);
  } catch (error) {
    console.error('Log user signup error:', error);
  }
};

/**
 * Log age consent
 * @param {boolean} consent - Whether consent was given
 * @param {string} userId - User ID (optional)
 */
export const logAgeConsent = async (consent, userId = null) => {
  try {
    const logData = {
      type: LOG_TYPES.AGE_CONSENT,
      timestamp: new Date().toISOString(),
      userId,
      data: {
        consent,
      },
    };
    
    // Save to local storage
    await saveLog(logData);
    
    // Send to server if available
    try {
      await downloaderApi.logDownload({
        email: userId,
        type: 'consent',
        status: 'consent',
        meta: { consent },
        ageConsent: consent,
      });
    } catch (error) {
      console.warn('Failed to send consent log to server:', error);
    }
  } catch (error) {
    console.error('Log age consent error:', error);
  }
};

/**
 * Log error
 * @param {string} errorMessage - Error message
 * @param {Object} errorData - Additional error data
 * @param {string} userId - User ID (optional)
 */
export const logError = async (errorMessage, errorData = {}, userId = null) => {
  try {
    const logData = {
      type: LOG_TYPES.ERROR,
      timestamp: new Date().toISOString(),
      userId,
      data: {
        message: errorMessage,
        ...errorData,
        platform: Platform.OS,
      },
    };
    
    // Save to local storage
    await saveLog(logData);
  } catch (error) {
    console.error('Log error error:', error);
  }
};

/**
 * Save log to storage
 * @param {Object} logData - Log data
 */
const saveLog = async (logData) => {
  try {
    if (isWeb) {
      // For web, use AsyncStorage
      const logsData = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
      const logs = logsData ? JSON.parse(logsData) : [];
      
      // Add new log to beginning of array
      logs.unshift(logData);
      
      // Limit to 1000 logs
      const limitedLogs = logs.slice(0, 1000);
      
      // Save back to storage
      await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(limitedLogs));
    } else {
      // For native, would use SQLite
      // This is a placeholder for actual SQLite implementation
      console.log('Saving log to SQLite:', logData);
    }
  } catch (error) {
    console.error('Save log error:', error);
  }
};

/**
 * Get logs from storage
 * @param {string} type - Log type (optional)
 * @param {string} userId - User ID (optional)
 * @param {number} limit - Maximum number of logs to return
 * @returns {Promise<Array>} - Logs
 */
export const getLogs = async (type = null, userId = null, limit = 100) => {
  try {
    if (isWeb) {
      // For web, use AsyncStorage
      const logsData = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
      const logs = logsData ? JSON.parse(logsData) : [];
      
      // Filter by type and userId if provided
      let filteredLogs = logs;
      if (type) {
        filteredLogs = filteredLogs.filter(log => log.type === type);
      }
      if (userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === userId);
      }
      
      // Return limited number of logs
      return filteredLogs.slice(0, limit);
    } else {
      // For native, would use SQLite
      // This is a placeholder for actual SQLite implementation
      console.log('Getting logs from SQLite:', type, userId, limit);
      return [];
    }
  } catch (error) {
    console.error('Get logs error:', error);
    return [];
  }
};

/**
 * Clear logs from storage
 * @param {string} type - Log type (optional)
 * @param {string} userId - User ID (optional)
 */
export const clearLogs = async (type = null, userId = null) => {
  try {
    if (isWeb) {
      // For web, use AsyncStorage
      if (!type && !userId) {
        // Clear all logs
        await AsyncStorage.removeItem(LOGS_STORAGE_KEY);
      } else {
        // Filter logs
        const logsData = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
        if (!logsData) return;
        
        const logs = JSON.parse(logsData);
        let filteredLogs = logs;
        
        if (type) {
          filteredLogs = filteredLogs.filter(log => log.type !== type);
        }
        if (userId) {
          filteredLogs = filteredLogs.filter(log => log.userId !== userId);
        }
        
        // Save filtered logs
        await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(filteredLogs));
      }
    } else {
      // For native, would use SQLite
      // This is a placeholder for actual SQLite implementation
      console.log('Clearing logs from SQLite:', type, userId);
    }
  } catch (error) {
    console.error('Clear logs error:', error);
  }
};

export default {
  LOG_TYPES,
  logDownloadAttempt,
  logDownloadSuccess,
  logDownloadFailure,
  logAppLaunch,
  logSettingsChange,
  logUserLogin,
  logUserLogout,
  logUserSignup,
  logAgeConsent,
  logError,
  getLogs,
  clearLogs,
};