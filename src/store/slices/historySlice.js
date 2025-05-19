/**
 * History Slice
 * 
 * This module provides Redux state management for download history.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDownloadHistory, clearDownloadHistory, deleteDownload } from '../../services/storage';
import logger from '../../services/logger';

// Define initial state
const initialState = {
  history: [],
  loading: false,
  error: null,
  filters: {
    platform: 'all', // 'all', 'instagram', 'youtube', 'twitter'
    type: 'all', // 'all', 'video', 'audio', 'image'
    timeRange: 'all', // 'all', 'today', 'week', 'month'
  },
};

// Async thunk for fetching download history
export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async (limit = 100, { rejectWithValue }) => {
    try {
      const history = await getDownloadHistory(limit);
      return history;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch download history');
    }
  }
);

// Async thunk for clearing download history
export const clearHistory = createAsyncThunk(
  'history/clearHistory',
  async (_, { rejectWithValue }) => {
    try {
      const success = await clearDownloadHistory();
      if (!success) {
        throw new Error('Failed to clear download history');
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear download history');
    }
  }
);

// Async thunk for deleting a download from history
export const removeFromHistory = createAsyncThunk(
  'history/removeFromHistory',
  async (downloadId, { rejectWithValue }) => {
    try {
      const success = await deleteDownload(downloadId);
      if (!success) {
        throw new Error('Failed to delete download from history');
      }
      return downloadId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete download from history');
    }
  }
);

// Helper function to apply filters to history
const applyFilters = (history, filters) => {
  let filteredHistory = [...history];
  
  // Apply platform filter
  if (filters.platform !== 'all') {
    filteredHistory = filteredHistory.filter(item => 
      item.platform === filters.platform
    );
  }
  
  // Apply type filter
  if (filters.type !== 'all') {
    filteredHistory = filteredHistory.filter(item => 
      item.fileType === filters.type || item.type === filters.type
    );
  }
  
  // Apply time range filter
  if (filters.timeRange !== 'all') {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (filters.timeRange) {
      case 'today':
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      default:
        break;
    }
    
    filteredHistory = filteredHistory.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= cutoffDate;
    });
  }
  
  return filteredHistory;
};

// Create the history slice
const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.filters = {
        platform: 'all',
        type: 'all',
        timeRange: 'all',
      };
    },
    addToHistory: (state, action) => {
      // Add a new download to history
      state.history.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch history cases
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch download history';
      })
      
      // Clear history cases
      .addCase(clearHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearHistory.fulfilled, (state) => {
        state.loading = false;
        state.history = [];
      })
      .addCase(clearHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to clear download history';
      })
      
      // Remove from history cases
      .addCase(removeFromHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = state.history.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete download from history';
      });
  },
});

// Export actions
export const { setFilters, resetFilters, addToHistory } = historySlice.actions;

// Export selectors
export const selectHistory = (state) => state.history.history;
export const selectFilteredHistory = (state) => applyFilters(state.history.history, state.history.filters);
export const selectHistoryLoading = (state) => state.history.loading;
export const selectHistoryError = (state) => state.history.error;
export const selectHistoryFilters = (state) => state.history.filters;

// Export reducer
export default historySlice.reducer;