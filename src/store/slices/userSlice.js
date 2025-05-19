/**
 * User Slice
 * 
 * This module provides Redux state management for user authentication and profile.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi, authApi } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../../services/logger';

// Define initial state
const initialState = {
  user: null,
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
  isLoggedIn: false,
  connectedPlatforms: {
    instagram: false,
    youtube: false,
    twitter: false,
  },
};

// Async thunk for user signup
export const signup = createAsyncThunk(
  'user/signup',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await userApi.signup(email, password);
      
      // Log user signup
      logger.logUserSignup(email);
      
      return result;
    } catch (error) {
      logger.logError('Signup failed', { email, error: error.message });
      return rejectWithValue(error.message || 'Signup failed');
    }
  }
);

// Async thunk for user login
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await userApi.login(email, password);
      
      // Store email for later use
      await AsyncStorage.setItem('user_email', email);
      
      // Log user login
      logger.logUserLogin(email);
      
      return { ...result, email };
    } catch (error) {
      logger.logError('Login failed', { email, error: error.message });
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async thunk for user logout
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { getState }) => {
    const { user } = getState().user;
    
    // Remove stored credentials
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_email');
    
    // Log user logout
    if (user) {
      logger.logUserLogout(user.email);
    }
    
    return null;
  }
);

// Async thunk for getting user profile
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Get stored email
      const email = await AsyncStorage.getItem('user_email');
      
      if (!email) {
        throw new Error('User not logged in');
      }
      
      const profile = await userApi.getProfile(email);
      return { ...profile, email };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get profile');
    }
  }
);

// Async thunk for connecting platform
export const connectPlatform = createAsyncThunk(
  'user/connectPlatform',
  async ({ platform, code }, { rejectWithValue }) => {
    try {
      let result;
      
      // If code is provided, use OAuth flow
      if (code) {
        result = await authApi.connectPlatform(platform, code);
      } else {
        // Otherwise use simple connect (stub in API)
        result = await userApi.connectPlatform(platform);
      }
      
      return { platform, result };
    } catch (error) {
      return rejectWithValue({
        platform,
        error: error.message || `Failed to connect ${platform}`
      });
    }
  }
);

// Async thunk for checking connected platforms
export const checkConnectedPlatforms = createAsyncThunk(
  'user/checkConnectedPlatforms',
  async (_, { rejectWithValue }) => {
    try {
      const platforms = ['instagram', 'youtube', 'twitter'];
      const results = {};
      
      // Check each platform
      for (const platform of platforms) {
        try {
          const result = await authApi.checkPlatformLogin(platform);
          results[platform] = result.isLoggedIn;
        } catch (error) {
          console.warn(`Failed to check ${platform} connection:`, error);
          results[platform] = false;
        }
      }
      
      return results;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to check connected platforms');
    }
  }
);

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Signup failed';
      })
      
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoggedIn = true;
        state.user = {
          email: action.payload.email,
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
        state.isLoggedIn = false;
        state.user = null;
      })
      
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.connectedPlatforms = {
          instagram: false,
          youtube: false,
          twitter: false,
        };
      })
      
      // Get profile cases
      .addCase(getProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to get profile';
        // Don't reset user or isLoggedIn here - might be temporary error
      })
      
      // Connect platform cases
      .addCase(connectPlatform.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(connectPlatform.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.connectedPlatforms[action.payload.platform] = true;
      })
      .addCase(connectPlatform.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error || `Failed to connect platform`;
      })
      
      // Check connected platforms cases
      .addCase(checkConnectedPlatforms.fulfilled, (state, action) => {
        state.connectedPlatforms = action.payload;
      });
  },
});

// Export actions
export const { clearError } = userSlice.actions;

// Export selectors
export const selectUser = (state) => state.user.user;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectConnectedPlatforms = (state) => state.user.connectedPlatforms;

// Export reducer
export default userSlice.reducer;