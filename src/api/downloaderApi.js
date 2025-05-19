/**
 * Social Media Downloader API
 * 
 * This module provides functions to download content from social media platforms.
 */

import { Platform } from 'react-native';
import axios from 'axios';
import { isWeb } from '../utils/platform';
import { saveToHistory } from '../utils/fileSystemAdapter';

/**
 * Download content from a social media URL
 * @param {string} url - The URL to download from
 * @param {string} platform - The platform (instagram, youtube, twitter, or auto)
 * @returns {Promise} - Promise with download result
 */
export const downloadContent = async (url, platform) => {
  try {
    // Get media info first
    const mediaInfo = await getMediaInfo(url, platform);
    
    if (!mediaInfo || !mediaInfo.downloadUrl) {
      throw new Error('Could not retrieve media information');
    }
    
    // Log the download attempt
    await logDownload({
      url,
      platform: mediaInfo.platform,
      type: mediaInfo.type,
      timestamp: new Date().toISOString()
    });
    
    // Return the media info with download URL
    return mediaInfo;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

/**
 * Get stream URL for video content
 * @param {string} url - The video URL
 * @param {string} itag - The video quality identifier
 * @returns {string} - Stream URL
 */
export const getStreamUrl = (url, itag) => {
  // For demo purposes, return the same URL
  // In a production app, this would generate actual streaming URLs
  return url;
};

/**
 * Log download attempt
 * @param {Object} data - Log data
 * @returns {Promise} - Promise with log response
 */
export const logDownload = async (data) => {
  try {
    // Save to download history
    await saveToHistory({
      url: data.url,
      platform: data.platform,
      type: data.type || 'video',
      timestamp: data.timestamp || new Date().toISOString(),
      status: 'completed'
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error logging download:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get media information from URL
 * @param {string} url - Social media URL
 * @returns {Promise} - Promise with media information
 */
export const getMediaInfo = async (url) => {
  try {
    // Ensure URL has proper protocol prefix
    let processedUrl = url;
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    // For demo purposes, we'll return data based on URL pattern
    // In a production app, this would make actual API calls to retrieve media information
    
    // Detect platform from URL
    let platform = 'unknown';
    let type = 'video';
    let title = 'Media Title';
    
    if (processedUrl.includes('instagram.com')) {
      platform = 'instagram';
      if (processedUrl.includes('/p/')) {
        type = 'photo';
        title = 'Instagram Photo';
      } else {
        type = 'video';
        title = 'Instagram Video';
      }
    } else if (processedUrl.includes('youtube.com') || processedUrl.includes('youtu.be')) {
      platform = 'youtube';
      type = 'video';
      title = 'YouTube Video';
    } else if (processedUrl.includes('twitter.com') || processedUrl.includes('x.com')) {
      platform = 'twitter';
      type = processedUrl.includes('/photo/') ? 'photo' : 'video';
      title = `Twitter ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    }
    
    // Generate a response with the processed URL
    return {
      title: title,
      description: `This is a sample ${type} from ${platform}`,
      thumbnail: 'https://via.placeholder.com/300x200',
      duration: type === 'video' ? '00:01:30' : null,
      url: processedUrl,
      downloadUrl: processedUrl, // In a real app, this would be an actual download URL
      type: type,
      platform: platform,
      quality: 'HD',
      size: '15MB',
      formats: type === 'video' ? ['720p', '480p', '360p'] : null
    };
    
  } catch (error) {
    console.error('Error getting media info:', error);
    throw new Error(`Failed to get media information: ${error.message}`);
  }
};