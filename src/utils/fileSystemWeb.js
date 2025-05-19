/**
 * Web-compatible version of file system operations
 * 
 * This file provides web implementations of file system operations
 * that are used by the fileSystemAdapter.
 */

/**
 * Prepare folder structure for downloads
 * In web environment, this is a no-op as we use browser downloads
 */
export const prepareFolderStructure = async () => {
  // No actual folder preparation needed for web
  return true;
};

/**
 * Download a file in web environment
 * @param {string} url - URL to download from
 * @param {string} fileName - File name to save as
 * @param {string} fileType - File type (video or audio)
 * @param {function} onProgress - Progress callback
 * @returns {Promise} - Promise with download result
 */
export const downloadFile = async (url, fileName, fileType = 'video', onProgress) => {
  try {
    // Ensure URL is properly formatted for web
    let downloadUrl = url;
    
    // Make sure we have a valid URL format - prefix with https:// if needed
    if (!downloadUrl.startsWith('http://') && !downloadUrl.startsWith('https://')) {
      downloadUrl = 'https://' + downloadUrl;
    }
    
    console.log(`Web downloading: ${downloadUrl} as ${fileName}`);
    
    // Simulate progress for the demo
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      if (progress > 1) {
        clearInterval(interval);
        progress = 1;
      }
      onProgress?.(progress);
    }, 300);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        clearInterval(interval);
        
        try {
          // For web environment
          // Create anchor element for download
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = fileName;
          a.style.display = 'none';
          
          // Add to DOM, trigger click and remove
          document.body.appendChild(a);
          a.click();
          
          // Small delay before cleanup
          setTimeout(() => {
            document.body.removeChild(a);
            resolve({
              success: true,
              filePath: fileName,
              mimeType: fileType === 'video' ? 'video/mp4' : 'image/jpeg'
            });
          }, 100);
        } catch (error) {
          reject(error);
        }
      }, 2000); // Simulate 2 second download
    });
  } catch (error) {
    console.error('Web download error:', error);
    throw error;
  }
};

/**
 * Get platform name from URL
 * @param {string} url - URL to analyze
 * @returns {string} - Platform name
 */
export const getPlatformFromUrl = (url) => {
  if (!url) return 'unknown';
  
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  
  return 'unknown';
};

// Other web implementations can be added here as needed