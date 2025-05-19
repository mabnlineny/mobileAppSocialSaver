import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { getDownloadHistory, clearDownloadHistory } from '../utils/fileSystemAdapter';
import DownloadCard from '../components/DownloadCard';
import { theme } from '../styles/theme';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const downloadHistory = await getDownloadHistory();
      setHistory(downloadHistory);
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Could not load download history');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear your download history?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearDownloadHistory();
              setHistory([]);
              Alert.alert('Success', 'Download history cleared');
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Could not clear download history');
            }
          }
        }
      ]
    );
  };

  const handleItemPress = (item) => {
    // For demo, just show details
    Alert.alert(
      'Download Details',
      `Title: ${item.title || 'Unknown'}\nPlatform: ${item.platform || 'Unknown'}\nType: ${item.type || 'Unknown'}\nDate: ${new Date(item.timestamp).toLocaleString()}`
    );
  };

  const handleShare = (item) => {
    Alert.alert('Share', 'Sharing functionality would open here');
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item from your history?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Filter out the deleted item
              const updatedHistory = history.filter(
                (historyItem) => historyItem.id !== item.id
              );
              setHistory(updatedHistory);
              
              // In a real app, we would also update storage
              // For now, we'll just update the state
              Alert.alert('Success', 'Item removed from history');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Could not delete item');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    loadHistory();
    
    // Add a focus listener to reload when navigating back to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
    });
    
    return unsubscribe;
  }, [navigation]);

  // Add mock data for demo if empty
  useEffect(() => {
    if (!loading && history.length === 0) {
      // For demo purposes, add some example history items
      const mockHistory = [
        {
          id: '1',
          title: 'Cute Cat Video',
          url: 'https://instagram.com/p/example1',
          platform: 'instagram',
          type: 'video',
          timestamp: new Date().toISOString(),
          thumbnail: 'https://via.placeholder.com/300/e91e63/ffffff?text=IG'
        },
        {
          id: '2',
          title: 'Travel Vlog: Paris',
          url: 'https://youtube.com/watch?v=example2',
          platform: 'youtube',
          type: 'video',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          thumbnail: 'https://via.placeholder.com/300/ff0000/ffffff?text=YT'
        },
        {
          id: '3',
          title: 'News Update Photo',
          url: 'https://twitter.com/example3',
          platform: 'twitter',
          type: 'photo',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          thumbnail: 'https://via.placeholder.com/300/1da1f2/ffffff?text=TW'
        }
      ];
      
      setHistory(mockHistory);
    }
  }, [loading, history]);

  const renderItem = ({ item }) => (
    <DownloadCard
      item={item}
      onPress={handleItemPress}
      onShare={handleShare}
      onDelete={handleDelete}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="history" size={50} color="#ccc" />
      <Text style={styles.emptyText}>No download history yet</Text>
      <Text style={styles.emptySubtext}>
        Your downloaded media will appear here
      </Text>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.downloadButtonText}>Start Downloading</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Download History</Text>
        {history.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <FontAwesome5 name="trash-alt" size={16} color="#fff" />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyComponent}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  clearButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  downloadButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HistoryScreen;