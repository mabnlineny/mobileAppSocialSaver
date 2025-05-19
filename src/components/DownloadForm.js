import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { downloadFile } from '../utils/fileSystemAdapter';
import { getMediaInfo } from '../api/downloaderApi';
import PlatformSelector from './PlatformSelector';

const DownloadForm = ({ onDownloadStart, onDownloadComplete, onError }) => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const detectPlatform = (url) => {
    if (!url) return 'auto';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    return 'auto';
  };

  const handleUrlChange = (text) => {
    setUrl(text);
    if (platform === 'auto') {
      setPlatform(detectPlatform(text));
    }
  };

  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
  };

  const handleDownload = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    // Ensure URL has proper protocol prefix
    let processedUrl = url;
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }

    try {
      setLoading(true);
      onDownloadStart?.();
      setDownloadProgress(0);

      // For demonstration purposes - replace with actual API call in production
      console.log(`Starting download from ${platform}: ${processedUrl}`);
      
      // Simulate getting media info
      // In a real app, this would be: const mediaInfo = await getMediaInfo(url, platform);
      const mediaInfo = {
        title: 'Sample Media',
        thumbnail: 'https://via.placeholder.com/300x200',
        duration: '00:01:30',
        url: processedUrl,
        downloadUrl: processedUrl,
        type: 'video',
        platform: platform || detectPlatform(processedUrl),
        quality: 'HD'
      };
      
      // Simulate download
      const onProgress = (progress) => {
        setDownloadProgress(progress);
      };
      
      // Generate a file name
      const fileName = `download_${Date.now()}.mp4`;
      
      // Simulating download - in a production app, this would download the actual file
      setTimeout(() => {
        setLoading(false);
        setDownloadProgress(1);
        
        const downloadResult = {
          url: url,
          filePath: `/downloads/${fileName}`,
          platform: platform || detectPlatform(url),
          timestamp: new Date().toISOString(),
          mediaInfo: mediaInfo
        };
        
        onDownloadComplete?.(downloadResult);
        
        Alert.alert(
          'Download Complete',
          `Successfully downloaded media from ${platform || detectPlatform(url)}`,
          [{ text: 'OK' }]
        );
        
        // Reset form
        setUrl('');
        setDownloadProgress(0);
      }, 2000);
    } catch (error) {
      console.error('Download error:', error);
      setLoading(false);
      onError?.(error);
      Alert.alert('Download Failed', `Error: ${error.message || 'Could not download the media'}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Paste URL here..."
          value={url}
          onChangeText={handleUrlChange}
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {url.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setUrl('')}
          >
            <FontAwesome5 name="times-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      
      <PlatformSelector 
        selectedPlatform={platform} 
        onSelectPlatform={handlePlatformChange} 
      />
      
      <TouchableOpacity 
        style={[styles.downloadButton, url.length === 0 && styles.downloadButtonDisabled]}
        onPress={handleDownload}
        disabled={loading || url.length === 0}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <FontAwesome5 name="download" size={16} color="#fff" />
            <Text style={styles.downloadButtonText}>Download</Text>
          </>
        )}
      </TouchableOpacity>
      
      {loading && downloadProgress > 0 && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${downloadProgress * 100}%` }]} />
          <Text style={styles.progressText}>{Math.round(downloadProgress * 100)}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 10,
  },
  downloadButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  downloadButtonDisabled: {
    backgroundColor: '#aaa',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    lineHeight: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default DownloadForm;