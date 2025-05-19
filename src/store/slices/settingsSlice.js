/**
 * Settings Slice
 * 
 * This module provides Redux state management for app settings and theme.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../../services/logger';

// Default settings
export const DEFAULT_SETTINGS = {
  theme: 'light', // 'light' or 'dark'
  downloadQuality: 'highest', // 'highest', 'medium', 'lowest'
  saveLocation: 'default', // 'default', 'custom'
  customLocation: '', // custom save location path
  wifi_only: false, // only download on WiFi
  notifications: true, // show notifications
  auto_detect_platform: true, // auto detect platform from URL
  preview_media: true, // show media preview
  keep_screen_on: true, // keep screen on during downloads
  max_concurrent_downloads: 1, // maximum number of concurrent downloads
  max_history_items: 100, // maximum number of history items to keep
  consent_adult_content: false, // user has consented to adult content
};

// Define initial state
const initialState = {
  settings: DEFAULT_SETTINGS,
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

// Settings storage key
const SETTINGS_STORAGE_KEY = 'social_saver_settings';

// Async thunk for loading settings
export const loadSettings = createAsyncThunk(
  'settings/loadSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        return settings;
      }
      
      // If no settings found, save and return defaults
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      
      return DEFAULT_SETTINGS;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load settings');
    }
  }
);

// Async thunk for saving settings
export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async (settings, { getState, rejectWithValue }) => {
    try {
      // Merge with current settings
      const currentSettings = getState().settings.settings;
      const newSettings = { ...currentSettings, ...settings };
      
      // Save to storage
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      
      // Log settings change
      logger.logSettingsChange(newSettings);
      
      return newSettings;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save settings');
    }
  }
);

// Async thunk for resetting settings
export const resetSettings = createAsyncThunk(
  'settings/resetSettings',
  async (_, { rejectWithValue }) => {
    try {
      // Save default settings
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      
      // Log settings reset
      logger.logSettingsChange(DEFAULT_SETTINGS);
      
      return DEFAULT_SETTINGS;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reset settings');
    }
  }
);

// Async thunk for toggling theme
export const toggleTheme = createAsyncThunk(
  'settings/toggleTheme',
  async (_, { getState }) => {
    const currentSettings = getState().settings.settings;
    const newTheme = currentSettings.theme === 'light' ? 'dark' : 'light';
    
    // Update just the theme setting
    return saveSettings({ theme: newTheme });
  }
);

// Create the settings slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load settings cases
      .addCase(loadSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load settings';
        // Use default settings if loading fails
        state.settings = DEFAULT_SETTINGS;
      })
      
      // Save settings cases
      .addCase(saveSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to save settings';
      })
      
      // Reset settings cases
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

// Export actions
export const { clearError } = settingsSlice.actions;

// Export selectors
export const selectSettings = (state) => state.settings.settings;
export const selectTheme = (state) => state.settings.settings.theme;
export const selectSettingsStatus = (state) => state.settings.status;
export const selectSettingsError = (state) => state.settings.error;

// Export reducer
export default settingsSlice.reducer;