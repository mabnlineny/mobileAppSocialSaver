import React, { useEffect } from 'react';
import { StatusBar, LogBox, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { checkAndRequestPermissions } from './src/utils/permissions';
import { prepareFolderStructure } from './src/utils/fileSystemAdapter';
import { theme } from './src/styles/theme';
import HomeScreen from './src/screens/HomeScreen';

// Ignore specific harmless warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  'shadow* style props are deprecated',
  'props.pointerEvents is deprecated',
]);

export default function App() {
  useEffect(() => {
    const setupApp = async () => {
      try {
        // Check and request necessary permissions
        const permissionsGranted = await checkAndRequestPermissions();
        
        if (permissionsGranted) {
          // Prepare folder structure for downloads
          await prepareFolderStructure();
        }
      } catch (error) {
        console.error('Error setting up app:', error);
      }
    };

    setupApp();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={theme.colors.primary} 
      />
      <View style={styles.container}>
        <HomeScreen />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    height: '100%',
    width: '100%'
  }
});
