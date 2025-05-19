import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';
import {
  getMediaInfo,
  downloadContent,
  resetDownload,
  selectDownloadStatus,
  selectDownloadProgress,
  selectMediaInfo,
  selectDownloadError
} from '../store/slices/downloadSlice';
import { useTheme } from '../contexts/ThemeContext';
import DownloadProgress from './DownloadProgress';
import PlatformSelector from './PlatformSelector';

// Supported platforms
const PLATFORMS = [
  { id: 'auto', label: 'Auto Detect', icon: 'magic' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
  { id: 'youtube', label: 'YouTube', icon: 'youtube' },
  { id: 'twitter', label: 'Twitter', icon: 'twitter' }
];

// Supported quality options
const QUALITY_OPTIONS = [
  { id: 'highest', label: 'Highest Quality', description: 'Best available quality' },
  { id: 'medium', label: 'Medium Quality', description: 'Balanced size and quality' },
  { id: 'lowest', label: 'Lowest Quality', description: 'Smallest file size' }
];

// Type definitions
interface DownloadFormProps {
  onDownloadComplete?: (result: any) => void;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ onDownloadComplete }) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  
  // Redux state
  const status = useSelector(selectDownloadStatus);
  const progress = useSelector(selectDownloadProgress);
  const mediaInfo = useSelector(selectMediaInfo);
  const error = useSelector(selectDownloadError);
  
  // Local state
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('auto');
  const [quality, setQuality] = useState('highest');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  
  // Detect platform from URL
  const detectPlatform = (inputUrl: string) => {
    if (!inputUrl) return 'auto';
    if (inputUrl.includes('instagram.com')) return 'instagram';
    if (inputUrl.includes('youtube.com') || inputUrl.includes('youtu.be')) return 'youtube';
    if (inputUrl.includes('twitter.com') || inputUrl.includes('x.com')) return 'twitter';
    return 'auto';
  };
  
  // Handle URL change
  const handleUrlChange = (text: string) => {
    setUrl(text);
    if (platform === 'auto') {
      setPlatform(detectPlatform(text));
    }
  };
  
  // Handle platform change
  const handlePlatformChange = (newPlatform: string) => {
    setPlatform(newPlatform);
  };
  
  // Handle quality change
  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    setShowQualityOptions(false);
  };
  
  // Handle info fetch
  const handleInfoFetch = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }
    
    // Dispatch getMediaInfo action
    try {
      // Reset any previous download state
      dispatch(resetDownload());
      
      // Make sure URL has protocol prefix
      let processedUrl = url;
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = 'https://' + processedUrl;
      }
      
      await dispatch(getMediaInfo({ url: processedUrl, platform })).unwrap();
    } catch (error) {
      console.error('Error fetching media info:', error);
    }
  };
  
  // Handle download
  const handleDownload = async () => {
    if (!mediaInfo) {
      Alert.alert('Error', 'Please analyze the URL first');
      return;
    }
    
    try {
      const result = await dispatch(downloadContent({ 
        mediaInfo, 
        quality: quality, 
        format: selectedFormat || (mediaInfo.type === 'video' ? 'mp4' : 'jpg')
      })).unwrap();
      
      if (onDownloadComplete) {
        onDownloadComplete(result);
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  
  // Reset form
  const handleReset = () => {
    setUrl('');
    setPlatform('auto');
    setQuality('highest');
    setSelectedFormat('');
    setShowQualityOptions(false);
    dispatch(resetDownload());
  };
  
  // Handle successful download completion
  useEffect(() => {
    if (status === 'success' && progress === 1) {
      // Wait a bit before resetting the form
      const timer = setTimeout(() => {
        handleReset();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [status, progress]);
  
  // Show error if any
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);
  
  // Get formats from media info
  const getAvailableFormats = () => {
    if (!mediaInfo) return [];
    
    if (mediaInfo.formats) {
      return mediaInfo.formats;
    }
    
    if (mediaInfo.type === 'video') {
      return ['mp4', 'webm'];
    } else if (mediaInfo.type === 'audio') {
      return ['mp3', 'm4a'];
    } else if (mediaInfo.type === 'photo') {
      return ['jpg', 'png'];
    }
    
    return [];
  };
  
  // Get status text based on current status
  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Analyzing...';
      case 'downloading':
        return 'Downloading...';
      case 'success':
        return 'Download complete!';
      case 'failed':
        return 'Download failed';
      default:
        return 'Enter URL to download';
    }
  };
  
  // Determine if analyze button should be disabled
  const isAnalyzeDisabled = !url || status === 'loading' || status === 'downloading';
  
  // Determine if download button should be disabled
  const isDownloadDisabled = !mediaInfo || status === 'downloading' || status === 'loading';
  
  return (
    <View style={styles.container}>
      {/* URL Input */}
      <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder="Paste URL here..."
          placeholderTextColor={theme.colors.textLight}
          value={url}
          onChangeText={handleUrlChange}
          autoCapitalize="none"
          autoCorrect={false}
          editable={status !== 'downloading'}
        />
        {url.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setUrl('')}
            disabled={status === 'downloading'}
          >
            <FontAwesome5 name="times-circle" size={18} color={theme.colors.textLight} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Platform Selector */}
      <PlatformSelector
        platforms={PLATFORMS}
        selectedPlatform={platform}
        onSelectPlatform={handlePlatformChange}
        disabled={status === 'downloading'}
      />
      
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            isAnalyzeDisabled && styles.disabledButton,
            { backgroundColor: theme.colors.secondary }
          ]}
          onPress={handleInfoFetch}
          disabled={isAnalyzeDisabled}
        >
          {status === 'loading' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <FontAwesome5 name="search" size={16} color="#fff" />
              <Text style={styles.buttonText}>Analyze</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.downloadButton,
            isDownloadDisabled && styles.disabledButton,
            { backgroundColor: theme.colors.primary }
          ]}
          onPress={handleDownload}
          disabled={isDownloadDisabled}
        >
          <FontAwesome5 name="download" size={16} color="#fff" />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
      </View>
      
      {/* Status Text */}
      <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
        {getStatusText()}
      </Text>
      
      {/* Media Info Card */}
      {mediaInfo && status !== 'downloading' && status !== 'loading' && (
        <View style={[styles.mediaInfoCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.mediaInfoHeader}>
            <Text style={[styles.mediaInfoTitle, { color: theme.colors.text }]}>
              {mediaInfo.title || 'Unknown Title'}
            </Text>
            <Text style={[styles.mediaInfoSubtitle, { color: theme.colors.textSecondary }]}>
              {mediaInfo.platform} • {mediaInfo.type} • {mediaInfo.size || 'Unknown size'}
            </Text>
          </View>
          
          {/* Quality Options */}
          <TouchableOpacity
            style={styles.qualitySelector}
            onPress={() => setShowQualityOptions(!showQualityOptions)}
          >
            <Text style={[styles.qualityLabel, { color: theme.colors.text }]}>Quality:</Text>
            <Text style={[styles.qualityValue, { color: theme.colors.primary }]}>
              {QUALITY_OPTIONS.find(opt => opt.id === quality)?.label || 'Select Quality'}
            </Text>
            <FontAwesome5
              name={showQualityOptions ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
          
          {/* Quality Options Dropdown */}
          {showQualityOptions && (
            <View style={styles.qualityOptions}>
              {QUALITY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.qualityOption,
                    quality === option.id && {
                      backgroundColor: theme.colors.primary + '20', // 20% opacity
                    },
                  ]}
                  onPress={() => handleQualityChange(option.id)}
                >
                  <Text 
                    style={[
                      styles.qualityOptionLabel,
                      { color: theme.colors.text }
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.qualityOptionDescription,
                      { color: theme.colors.textSecondary }
                    ]}
                  >
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {/* Format Selector */}
          {getAvailableFormats().length > 0 && (
            <View style={styles.formatSelector}>
              <Text style={[styles.formatLabel, { color: theme.colors.text }]}>Format:</Text>
              <View style={styles.formatOptions}>
                {getAvailableFormats().map(format => (
                  <TouchableOpacity
                    key={format}
                    style={[
                      styles.formatOption,
                      selectedFormat === format && {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setSelectedFormat(format)}
                  >
                    <Text 
                      style={[
                        styles.formatOptionText,
                        { color: selectedFormat === format ? '#fff' : theme.colors.text }
                      ]}
                    >
                      {format.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
      
      {/* Download Progress */}
      {status === 'downloading' && (
        <DownloadProgress 
          progress={progress} 
          status="downloading" 
          fileType={mediaInfo?.type || 'video'} 
          fileSize={mediaInfo?.size || '0B'} 
        />
      )}
      
      {status === 'success' && (
        <DownloadProgress 
          progress={1} 
          status="completed" 
          fileType={mediaInfo?.type || 'video'} 
          fileSize={mediaInfo?.size || '0B'} 
        />
      )}
      
      {status === 'failed' && (
        <DownloadProgress 
          progress={progress} 
          status="error" 
          fileType={mediaInfo?.type || 'video'} 
          fileSize={mediaInfo?.size || '0B'} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  analyzeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  statusText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  mediaInfoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  mediaInfoHeader: {
    marginBottom: 16,
  },
  mediaInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mediaInfoSubtitle: {
    fontSize: 14,
  },
  qualitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  qualityValue: {
    flex: 1,
    fontSize: 16,
  },
  qualityOptions: {
    marginBottom: 16,
  },
  qualityOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  qualityOptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  qualityOptionDescription: {
    fontSize: 12,
  },
  formatSelector: {
    marginTop: 8,
  },
  formatLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  formatOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  formatOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginRight: 8,
    marginBottom: 8,
  },
  formatOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DownloadForm;