/**
 * Theme Context
 * 
 * This module provides context for app theme (dark/light mode).
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { loadSettings, saveSettings, selectTheme } from '../store/slices/settingsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const lightTheme = {
  colors: {
    primary: '#0066cc',
    secondary: '#3498db',
    accent: '#2ecc71',
    error: '#e74c3c',
    warning: '#f39c12',
    info: '#3498db',
    success: '#2ecc71',
    background: '#f4f6fa',
    card: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    border: '#dddddd',
    disabled: '#cccccc',
    instagram: '#c13584',
    youtube: '#ff0000',
    twitter: '#1da1f2',
  },
  // Typography, spacing, etc. remain the same in both themes
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System-Bold',
    },
    fontSize: {
      tiny: 10,
      small: 12,
      regular: 14,
      medium: 16,
      large: 18,
      xlarge: 20,
      xxlarge: 24,
      huge: 30
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  spacing: {
    tiny: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 48
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 20,
    round: 9999
  },
};

// Dark theme - only colors change
export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#1a8cff',
    secondary: '#4dabf5',
    background: '#121212',
    card: '#1e1e1e',
    text: '#f0f0f0',
    textSecondary: '#b0b0b0',
    textLight: '#7a7a7a',
    border: '#2a2a2a',
    disabled: '#5a5a5a',
  },
};

// Create the context
export const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

// Storage key for theme preference
const THEME_STORAGE_KEY = 'social_saver_theme';

// Provider component
export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const savedTheme = useSelector(selectTheme);
  
  // State for theme mode
  const [isDark, setIsDark] = useState(savedTheme === 'dark');
  
  // Load theme from settings on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // First try loading from settings in Redux
        if (savedTheme) {
          setIsDark(savedTheme === 'dark');
          return;
        }
        
        // If no settings in Redux, try loading from storage
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
          setIsDark(storedTheme === 'dark');
          // Update Redux settings
          dispatch(saveSettings({ theme: storedTheme }));
          return;
        }
        
        // If no stored preference, use system preference
        setIsDark(systemColorScheme === 'dark');
        dispatch(saveSettings({ theme: systemColorScheme === 'dark' ? 'dark' : 'light' }));
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, [dispatch, systemColorScheme, savedTheme]);
  
  // Toggle theme function
  const toggleTheme = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    
    try {
      // Save to storage
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      
      // Update Redux settings
      dispatch(saveSettings({ theme: newTheme }));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };
  
  // Get current theme object
  const theme = isDark ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);