import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const PlatformIcon = ({ platform, size = 16 }) => {
  const getIconName = () => {
    switch (platform) {
      case 'instagram':
        return 'instagram';
      case 'youtube':
        return 'youtube';
      case 'twitter':
        return 'twitter';
      default:
        return 'globe';
    }
  };

  const getIconColor = () => {
    switch (platform) {
      case 'instagram':
        return theme.colors.instagram;
      case 'youtube':
        return theme.colors.youtube;
      case 'twitter':
        return theme.colors.twitter;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <FontAwesome5 
      name={getIconName()} 
      size={size} 
      color={getIconColor()} 
    />
  );
};

const MediaTypeIcon = ({ type, size = 16 }) => {
  const getIconName = () => {
    switch (type) {
      case 'video':
        return 'video';
      case 'photo':
        return 'image';
      case 'audio':
        return 'music';
      default:
        return 'file';
    }
  };

  return (
    <FontAwesome5 
      name={getIconName()} 
      size={size} 
      color={theme.colors.textSecondary} 
    />
  );
};

const DownloadCard = ({ 
  item,
  onPress,
  onShare,
  onDelete 
}) => {
  // Format the timestamp to a readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get platform display name
  const getPlatformName = (platform) => {
    switch (platform) {
      case 'instagram':
        return 'Instagram';
      case 'youtube':
        return 'YouTube';
      case 'twitter':
        return 'Twitter';
      default:
        return 'Unknown';
    }
  };

  // Get media type display name
  const getMediaTypeName = (type) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'photo':
        return 'Photo';
      case 'audio':
        return 'Audio';
      default:
        return 'File';
    }
  };

  // Use placeholder values if item properties are missing
  const title = item.title || 'Untitled';
  const timestamp = item.timestamp || new Date().toISOString();
  const platform = item.platform || 'unknown';
  const type = item.type || 'unknown';
  const thumbnail = item.thumbnail || 'https://via.placeholder.com/100';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.thumbnailContainer}>
        {thumbnail ? (
          <Image 
            source={{ uri: thumbnail }} 
            style={styles.thumbnail} 
            resizeMode="cover" 
          />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <MediaTypeIcon type={type} size={24} />
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <PlatformIcon platform={platform} size={14} />
            <Text style={styles.metaText}>{getPlatformName(platform)}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <MediaTypeIcon type={type} size={14} />
            <Text style={styles.metaText}>{getMediaTypeName(type)}</Text>
          </View>
        </View>
        
        <Text style={styles.timestamp}>{formatDate(timestamp)}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onShare?.(item)}
        >
          <FontAwesome5 name="share-alt" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onDelete?.(item)}
        >
          <FontAwesome5 name="trash-alt" size={16} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  actionsContainer: {
    justifyContent: 'space-around',
    paddingLeft: 8,
  },
  actionButton: {
    padding: 6,
  },
});

export default DownloadCard;