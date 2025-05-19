import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../components/Header';
import DownloadForm from '../components/DownloadForm';
import DownloadCard from '../components/DownloadCard';
import { checkAndRequestPermissions } from '../utils/permissions';
import { theme } from '../styles/theme';

const DownloadScreen = ({ navigation }) => {
  const [downloadItems, setDownloadItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const granted = await checkAndRequestPermissions();
    setPermissionsGranted(granted);
    
    if (!granted) {
      Alert.alert(
        'Permission Required',
        'This app needs storage permission to save downloaded files.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Request Again', onPress: checkPermissions }
        ]
      );
    }
  };

  const handleDownloadReady = (downloadOption) => {
    // Add new download item to the top of the list
    setDownloadItems(prevItems => [downloadOption, ...prevItems]);
  };

  const handleDownloadComplete = (item, result) => {
    // Update download item status
    setDownloadItems(prevItems => 
      prevItems.map(prevItem => 
        prevItem.url === item.url ? { ...prevItem, downloaded: true } : prevItem
      )
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkPermissions();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Header title="SocialSaver" rightIcon="question-circle" onRightPress={() => navigation.navigate('Settings', { screen: 'About' })} />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <DownloadForm
          onDownloadReady={handleDownloadReady}
        />
        
        {!permissionsGranted && (
          <TouchableOpacity 
            style={styles.permissionWarning}
            onPress={checkPermissions}
          >
            <FontAwesome5 name="exclamation-circle" size={20} color={theme.colors.warning} />
            <Text style={styles.permissionWarningText}>
              Storage permission is required to save files
            </Text>
            <FontAwesome5 name="chevron-right" size={16} color={theme.colors.warning} />
          </TouchableOpacity>
        )}
        
        <View style={styles.downloadsSection}>
          <Text style={styles.sectionTitle}>
            {downloadItems.length > 0 ? 'Available Downloads' : 'Recent Downloads'}
          </Text>
          
          {downloadItems.length > 0 ? (
            downloadItems.map((item, index) => (
              <DownloadCard
                key={`${item.url}-${index}`}
                item={item}
                onDownloadComplete={handleDownloadComplete}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateImageContainer}>
                <FontAwesome5 name="download" size={60} color={theme.colors.primary} style={styles.emptyStateIcon} />
              </View>
              <Text style={styles.emptyStateTitle}>No Downloads Yet</Text>
              <Text style={styles.emptyStateDescription}>
                Paste a URL from Instagram, YouTube, or Twitter to download content
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.warningBg,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  permissionWarningText: {
    flex: 1,
    color: theme.colors.warning,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  downloadsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateIcon: {
    opacity: 0.8,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default DownloadScreen;
