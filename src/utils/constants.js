// API URL
export const API_BASE_URL = 'http://localhost:8000';

// Supported platforms
export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  TWITTER: 'twitter',
};

// File types
export const FILE_TYPES = {
  VIDEO: 'video',
  AUDIO: 'audio',
  IMAGE: 'image',
};

// Download statuses
export const DOWNLOAD_STATUS = {
  PENDING: 'pending',
  DOWNLOADING: 'downloading',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Storage paths
export const STORAGE_PATHS = {
  DOWNLOAD_HISTORY: 'downloadHistory',
  USER_SETTINGS: 'userSettings',
};

// Notification channels
export const NOTIFICATION_CHANNELS = {
  DOWNLOADS: 'downloads-channel',
};

// Default settings
export const DEFAULT_SETTINGS = {
  autoDetectPlatform: true,
  saveMetadata: true,
  highQualityByDefault: true,
  showNotifications: true,
  darkMode: false,
  saveHistory: true,
};

export default {
  API_BASE_URL,
  PLATFORMS,
  FILE_TYPES,
  DOWNLOAD_STATUS,
  STORAGE_PATHS,
  NOTIFICATION_CHANNELS,
  DEFAULT_SETTINGS,
};
