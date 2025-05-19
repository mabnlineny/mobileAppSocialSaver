/**
 * Download Slice
 * 
 * This module provides Redux state management for download operations.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { downloaderApi } from '../../services/api';
import logger from '../../services/logger';
import { saveFile, saveToHistory } from '../../services/storage';
import { 
  showDownloadStartedNotification,
  showDownloadCompletedNotification,
  showDownloadFailedNotification
} from '../../services/notifications';

// Define initial state
const initialState = {
  currentDownload: null,
  progress: 0,
  status: 'idle', // 'idle', 'loading', 'downloading', 'success', 'failed'
  error: null,
  mediaInfo: null,
  downloads: [],
  totalDownloads: 0,
};

// Async thunk for getting media info
export const getMediaInfo = createAsyncThunk(
  'download/getMediaInfo',
  async ({ url, platform }, { rejectWithValue }) => {
    try {
      // Log download attempt
      logger.logDownloadAttempt({ url, platform });
      
      // Get media info from API
      const mediaInfo = await downloaderApi.getMediaInfo(url, platform);
      return mediaInfo;
    } catch (error) {
      logger.logError('Failed to get media info', { url, platform, error: error.message });
      return rejectWithValue(error.message || 'Could not get media information');
    }
  }
);

// Async thunk for downloading content
export const downloadContent = createAsyncThunk(
  'download/downloadContent',
  async ({ mediaInfo, quality, format }, { dispatch, rejectWithValue }) => {
    try {
      // Progress callback
      const onProgress = (progress) => {
        dispatch(setProgress(progress));
      };
      
      // Show notification
      showDownloadStartedNotification(mediaInfo);
      
      // Generate file name
      const fileName = `${mediaInfo.title || 'download'}_${Date.now()}.${format || 'mp4'}`;
      
      // Log download attempt
      logger.logDownloadAttempt({
        ...mediaInfo,
        quality,
        format,
      });
      
      // Download the file
      const downloadResult = await saveFile(
        mediaInfo.downloadUrl,
        fileName,
        mediaInfo.type,
        onProgress
      );
      
      // Log download success
      logger.logDownloadSuccess({
        ...mediaInfo,
        ...downloadResult,
        quality,
        format,
      });
      
      // Save to history
      await saveToHistory({
        ...mediaInfo,
        ...downloadResult,
        quality,
        format,
      });
      
      // Show notification
      showDownloadCompletedNotification({
        ...mediaInfo,
        ...downloadResult
      });
      
      return downloadResult;
    } catch (error) {
      // Log download failure
      logger.logDownloadFailure(mediaInfo, error.message || 'Download failed');
      
      // Show notification
      showDownloadFailedNotification(mediaInfo, error.message || 'Download failed');
      
      return rejectWithValue(error.message || 'Download failed');
    }
  }
);

// Create the download slice
const downloadSlice = createSlice({
  name: 'download',
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetDownload: (state) => {
      state.currentDownload = null;
      state.progress = 0;
      state.status = 'idle';
      state.error = null;
      state.mediaInfo = null;
    },
    cancelDownload: (state) => {
      state.status = 'idle';
      state.progress = 0;
      state.currentDownload = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get media info cases
      .addCase(getMediaInfo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getMediaInfo.fulfilled, (state, action) => {
        state.status = 'idle';
        state.mediaInfo = action.payload;
      })
      .addCase(getMediaInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to get media information';
        state.mediaInfo = null;
      })
      
      // Download content cases
      .addCase(downloadContent.pending, (state, action) => {
        state.status = 'downloading';
        state.progress = 0;
        state.currentDownload = {
          id: Date.now().toString(),
          mediaInfo: state.mediaInfo,
          startTime: new Date().toISOString(),
        };
        state.error = null;
      })
      .addCase(downloadContent.fulfilled, (state, action) => {
        state.status = 'success';
        state.progress = 1;
        state.currentDownload = {
          ...state.currentDownload,
          ...action.payload,
          endTime: new Date().toISOString(),
        };
        state.totalDownloads += 1;
        state.downloads.unshift(state.currentDownload);
      })
      .addCase(downloadContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Download failed';
        if (state.currentDownload) {
          state.currentDownload.error = state.error;
          state.currentDownload.endTime = new Date().toISOString();
        }
      });
  },
});

// Export actions
export const { setProgress, resetDownload, cancelDownload } = downloadSlice.actions;

// Export selectors
export const selectDownloadStatus = (state) => state.download.status;
export const selectDownloadProgress = (state) => state.download.progress;
export const selectCurrentDownload = (state) => state.download.currentDownload;
export const selectMediaInfo = (state) => state.download.mediaInfo;
export const selectDownloadError = (state) => state.download.error;
export const selectTotalDownloads = (state) => state.download.totalDownloads;
export const selectDownloads = (state) => state.download.downloads;

// Export reducer
export default downloadSlice.reducer;