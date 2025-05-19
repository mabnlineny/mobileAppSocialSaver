import { Platform } from 'react-native';

// Helper to check if we're running on web
export const isWeb = Platform.OS === 'web';

// Helper to check if we're running on a native platform
export const isNative = Platform.OS === 'android' || Platform.OS === 'ios';

// Helper to check if we're running in Expo development
export const isExpo = typeof global.Expo !== 'undefined';