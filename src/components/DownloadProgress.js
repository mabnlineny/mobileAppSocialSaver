import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const DownloadProgress = ({ 
  progress, 
  status = 'downloading',
  fileType = 'video',
  fileSize
}) => {
  // Create animated value for progress
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Rotate animation for loading indicator
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  // Start rotation animation when downloading
  useEffect(() => {
    if (status === 'downloading') {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    } else {
      rotateAnim.stopAnimation();
    }
    
    return () => {
      rotateAnim.stopAnimation();
    };
  }, [status, rotateAnim]);
  
  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false
    }).start();
  }, [progress, progressAnim]);
  
  // Get status icon and color
  const getStatusIcon = () => {
    switch (status) {
      case 'downloading':
        return (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <FontAwesome5 name="circle-notch" size={24} color={theme.colors.primary} />
          </Animated.View>
        );
      case 'completed':
        return <FontAwesome5 name="check-circle" size={24} color={theme.colors.success} />;
      case 'error':
        return <FontAwesome5 name="times-circle" size={24} color={theme.colors.error} />;
      case 'paused':
        return <FontAwesome5 name="pause-circle" size={24} color={theme.colors.warning} />;
      default:
        return <FontAwesome5 name="circle-notch" size={24} color={theme.colors.primary} />;
    }
  };
  
  // Get file type icon
  const getFileTypeIcon = () => {
    switch (fileType) {
      case 'video':
        return <FontAwesome5 name="video" size={16} color={theme.colors.textSecondary} />;
      case 'audio':
        return <FontAwesome5 name="music" size={16} color={theme.colors.textSecondary} />;
      case 'photo':
        return <FontAwesome5 name="image" size={16} color={theme.colors.textSecondary} />;
      default:
        return <FontAwesome5 name="file" size={16} color={theme.colors.textSecondary} />;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    
    if (typeof bytes === 'string') {
      return bytes;
    }
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };
  
  // Get status text
  const getStatusText = () => {
    switch (status) {
      case 'downloading':
        return 'Downloading...';
      case 'completed':
        return 'Download complete';
      case 'error':
        return 'Download failed';
      case 'paused':
        return 'Download paused';
      default:
        return 'Downloading...';
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
          <View style={styles.fileInfoContainer}>
            {getFileTypeIcon()}
            {fileSize && (
              <Text style={styles.fileSize}>{formatFileSize(fileSize)}</Text>
            )}
          </View>
        </View>
        <View style={styles.statusIconContainer}>
          {getStatusIcon()}
        </View>
      </View>
      
      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            })}
          ]} 
        />
      </View>
      
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  statusIconContainer: {
    marginLeft: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressTextContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default DownloadProgress;