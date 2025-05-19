import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

// Configure notifications
export const configureNotifications = () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },
    
    // (required) Called when a remote or local notification is opened or received
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      
      // Process the notification
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    
    // Should the initial notification be popped automatically
    popInitialNotification: true,
    
    // Permissions to register (iOS only)
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    
    // Android only
    requestPermissions: Platform.OS === 'ios',
  });
  
  // Create notification channel for Android
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'downloads-channel',
        channelName: 'Downloads Channel',
        channelDescription: 'Channel for download notifications',
        soundName: 'default',
        importance: 4, // High importance
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }
};

/**
 * Show a local notification
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {Object} data - Additional data
 */
export const showNotification = (title, message, data = {}) => {
  PushNotification.localNotification({
    // Android properties
    channelId: 'downloads-channel',
    autoCancel: true,
    largeIcon: 'ic_launcher',
    smallIcon: 'ic_notification',
    bigText: message,
    subText: 'SocialSaver',
    vibrate: true,
    vibration: 300,
    priority: 'high',
    
    // iOS properties
    category: 'downloads',
    
    // Common properties
    title: title,
    message: message,
    playSound: true,
    soundName: 'default',
    
    // Custom data
    data: data,
  });
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};

export default {
  configureNotifications,
  showNotification,
  cancelAllNotifications,
};
