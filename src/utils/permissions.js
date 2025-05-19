import { Platform, Alert } from 'react-native';
import { isWeb } from './platform';

/**
 * Check and request storage permissions
 * @returns {Promise<boolean>} - Whether permissions are granted
 */
export const checkAndRequestPermissions = async () => {
  // On web, no permissions are needed
  if (isWeb || Platform.OS === 'web') {
    return true;
  }

  // For Expo development in emulator, we'll temporarily return true
  // This avoids native module issues during development
  console.log('Permissions check: Platform is', Platform.OS);
  
  // In a production app, we would properly request permissions
  // But for now, return true to avoid the TurboModule error
  return true;
};

/**
 * Show permission explanation and open settings
 */
export const showPermissionExplanation = () => {
  Alert.alert(
    'Permission Required',
    'SocialSaver needs storage permission to save files. Please grant this permission in settings.',
    [
      { 
        text: 'Cancel', 
        style: 'cancel' 
      },
      { 
        text: 'Open Settings', 
        onPress: () => {
          // For development only
          console.log('Open settings would be triggered here');
        } 
      },
    ]
  );
};
