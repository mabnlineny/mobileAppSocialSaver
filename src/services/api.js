/**
 * API Service
 * 
 * This module provides a centralized Axios client for handling API requests.
 */

import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL
const API_BASE_URL = 'http://localhost:2500';

// Create Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor for handling tokens
api.interceptors.request.use(
  async (config) => {
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('auth_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized
      await AsyncStorage.removeItem('auth_token');
      
      // You could also implement a redirect to login screen here
    }
    
    return Promise.reject(error);
  }
);

// Downloader API Functions
export const downloaderApi = {
  /**
   * Get information about a video/media from URL
   * @param {string} url - URL of the media to download
   * @param {string} platform - Platform (youtube, instagram, twitter, etc.)
   * @returns {Promise} - Promise with the download information
   */
  getMediaInfo: async (url, platform = 'auto') => {
    try {
      const response = await api.post('/download', { url, platform });
      return response.data;
    } catch (error) {
      console.error('Error getting media info:', error);
      throw error;
    }
  },
  
  /**
   * Download content from a URL
   * @param {Object} data - Download parameters
   * @returns {Promise} - Promise with the download result
   */
  downloadContent: async (data) => {
    try {
      const response = await api.post('/download', data);
      return response.data;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },
  
  /**
   * Get stream URL for a video
   * @param {string} url - Video URL
   * @param {string} itag - Quality identifier
   * @returns {string} - Stream URL
   */
  getStreamUrl: (url, itag) => {
    return `${API_BASE_URL}/stream?url=${encodeURIComponent(url)}&itag=${itag}`;
  },
  
  /**
   * Log download activity
   * @param {Object} logData - Log data
   * @returns {Promise} - Promise with the log result
   */
  logDownload: async (logData) => {
    try {
      const response = await api.post('/log', logData);
      return response.data;
    } catch (error) {
      console.error('Log error:', error);
      throw error;
    }
  }
};

// User API Functions
export const userApi = {
  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise with the signup result
   */
  signup: async (email, password) => {
    try {
      const response = await api.post('/signup', { email, password });
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  /**
   * Log in a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise with the login result
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      
      // Store token if login successful
      if (response.data.token) {
        await AsyncStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Get current user profile
   * @param {string} email - User email
   * @returns {Promise} - Promise with the user profile
   */
  getProfile: async (email) => {
    try {
      const response = await api.get(`/profile?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('Profile error:', error);
      throw error;
    }
  },
  
  /**
   * Connect social platform
   * @param {string} platform - Platform name (instagram, twitter, youtube)
   * @returns {Promise} - Promise with the connection result
   */
  connectPlatform: async (platform) => {
    try {
      const response = await api.post(`/connect/${platform}`);
      return response.data;
    } catch (error) {
      console.error(`Connect ${platform} error:`, error);
      throw error;
    }
  }
};

// Auth API Functions
export const authApi = {
  /**
   * Get authentication URL for platform
   * @param {string} platform - Platform name
   * @returns {Promise} - Promise with the auth URL
   */
  getAuthUrl: async (platform) => {
    try {
      const response = await api.get(`/auth-url/${platform}`);
      return response.data;
    } catch (error) {
      console.error('Auth URL error:', error);
      throw error;
    }
  },
  
  /**
   * Check if platform is connected
   * @param {string} platform - Platform name
   * @returns {Promise} - Promise with the connection status
   */
  checkPlatformLogin: async (platform) => {
    try {
      const response = await api.get(`/check-platform/${platform}`);
      return response.data;
    } catch (error) {
      console.error('Check platform error:', error);
      throw error;
    }
  },
  
  /**
   * Connect platform with authorization code
   * @param {string} platform - Platform name
   * @param {string} code - Authorization code
   * @returns {Promise} - Promise with the connection result
   */
  connectPlatform: async (platform, code) => {
    try {
      const response = await api.post(`/connect/${platform}`, { code });
      return response.data;
    } catch (error) {
      console.error('Connect platform error:', error);
      throw error;
    }
  },
  
  /**
   * Disconnect platform
   * @param {string} platform - Platform name
   * @returns {Promise} - Promise with the disconnection result
   */
  disconnectPlatform: async (platform) => {
    try {
      const response = await api.post(`/disconnect/${platform}`);
      return response.data;
    } catch (error) {
      console.error('Disconnect platform error:', error);
      throw error;
    }
  },
  
  /**
   * Get current authenticated user
   * @returns {Promise} - Promise with the current user
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
};

export default api;