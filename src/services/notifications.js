/**
 * Notifications Service
 * 
 * This module provides functions for managing local notifications.
 */

import { Platform } from 'react-native';
import { isWeb } from '../utils/platform';

// Mock implementation for web since web doesn't support native notifications
const createWebNotification = (title, body, data = {}) => {
  if (isWeb && 'Notification' in window) {
    // Check if browser supports notifications
    if (Notification.permission === 'granted') {
      // If permission is granted, show notification
      new Notification(title, { 
        body,
        data
      });
    } else if (Notification.permission !== 'denied') {
      // Request permission
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { 
            body,
            data
          });
        }
      });
    }
  }
};

/**
 * Initialize notifications
 * @returns {Promise<boolean>} - Success indicator
 */
export const initializeNotifications = async () => {
  try {
    if (isWeb) {
      // Web notifications
      if ('Notification' in window) {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
          await Notification.requestPermission();
        }
        return Notification.permission === 'granted';
      }
      return false;
    } else {
      // For mobile, this would use a library like react-native-push-notification
      console.log('Initializing mobile notifications');
      return true;
    }
  } catch (error) {
    console.error('Notification initialization error:', error);
    return false;
  }
};

/**
 * Check if notifications are enabled
 * @returns {Promise<boolean>} - Whether notifications are enabled
 */
export const areNotificationsEnabled = async () => {
  try {
    if (isWeb) {
      return 'Notification' in window && Notification.permission === 'granted';
    } else {
      // For mobile, would check permissions
      return true;
    }
  } catch (error) {
    console.error('Notifications check error:', error);
    return false;
  }
};

/**
 * Show download started notification
 * @param {Object} downloadInfo - Download information
 */
export const showDownloadStartedNotification = (downloadInfo) => {
  const title = 'Download Started';
  const body = `Starting download: ${downloadInfo.title || 'Media'}`;
  
  if (isWeb) {
    createWebNotification(title, body, { type: 'download_started', ...downloadInfo });
  } else {
    // For mobile, would use react-native-push-notification
    console.log('Mobile notification:', title, body);
  }
};

/**
 * Show download completed notification
 * @param {Object} downloadInfo - Download information
 */
export const showDownloadCompletedNotification = (downloadInfo) => {
  const title = 'Download Complete';
  const body = `Successfully downloaded: ${downloadInfo.title || 'Media'}`;
  
  if (isWeb) {
    createWebNotification(title, body, { type: 'download_complete', ...downloadInfo });
  } else {
    // For mobile, would use react-native-push-notification
    console.log('Mobile notification:', title, body);
  }
};

/**
 * Show download failed notification
 * @param {Object} downloadInfo - Download information
 * @param {string} errorMessage - Error message
 */
export const showDownloadFailedNotification = (downloadInfo, errorMessage) => {
  const title = 'Download Failed';
  const body = `Failed to download: ${downloadInfo.title || 'Media'} - ${errorMessage}`;
  
  if (isWeb) {
    createWebNotification(title, body, { type: 'download_failed', ...downloadInfo });
  } else {
    // For mobile, would use react-native-push-notification
    console.log('Mobile notification:', title, body);
  }
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = () => {
  if (!isWeb) {
    // For mobile, would use react-native-push-notification to cancel
    console.log('Cancelling all mobile notifications');
  }
};

export default {
  initializeNotifications,
  areNotificationsEnabled,
  showDownloadStartedNotification,
  showDownloadCompletedNotification,
  showDownloadFailedNotification,
  cancelAllNotifications,
};