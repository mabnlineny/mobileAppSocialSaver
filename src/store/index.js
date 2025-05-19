/**
 * Redux Store
 * 
 * This module configures the Redux store using Redux Toolkit.
 */

import { configureStore } from '@reduxjs/toolkit';
import downloadReducer from './slices/downloadSlice';
import userReducer from './slices/userSlice';
import settingsReducer from './slices/settingsSlice';
import historyReducer from './slices/historySlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    download: downloadReducer,
    user: userReducer,
    settings: settingsReducer,
    history: historyReducer,
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;