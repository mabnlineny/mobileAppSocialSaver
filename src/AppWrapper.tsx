import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './store';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import { loadSettings } from './store/slices/settingsSlice';
import { createFolderStructure } from './services/storage';
import { initializeNotifications } from './services/notifications';

// Root component with all providers
const AppWrapper = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <AppWithProviders />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

// App with providers to access theme and auth context
const AppWithProviders = () => {
  const { theme, isDark } = useTheme();
  const dispatch = store.dispatch;

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load settings
        dispatch(loadSettings());
        
        // Create folder structure for downloads
        await createFolderStructure();
        
        // Initialize notifications
        await initializeNotifications();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    initializeApp();
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.primary} 
      />
      <App />
    </SafeAreaProvider>
  );
};

export default AppWrapper;