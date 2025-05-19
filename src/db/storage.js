import { db } from './index.js';
import { users, downloads, userSettings, guestDownloads } from '../shared/schema.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Database Storage service for handling database operations
 */
export class DatabaseStorage {
  /**
   * Get a user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} - User object
   */
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  /**
   * Get a user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} - User object
   */
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }
  
  /**
   * Get a user by email
   * @param {string} email - Email
   * @returns {Promise<Object>} - User object
   */
  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : undefined;
  }
  
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Created user
   */
  async createUser(userData) {
    const result = await db.insert(users).values(userData).returning();
    if (result.length === 0) {
      throw new Error('Failed to create user');
    }
    
    // Create default settings for user
    await this.createUserSettings(result[0].id);
    
    return result[0];
  }
  
  /**
   * Create default settings for a user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - Created settings
   */
  async createUserSettings(userId) {
    const result = await db.insert(userSettings).values({
      userId,
      autoDetectPlatform: true,
      saveMetadata: true,
      highQualityByDefault: true,
      showNotifications: true,
      darkMode: false,
      saveHistory: true
    }).returning();
    
    return result.length > 0 ? result[0] : undefined;
  }
  
  /**
   * Get user settings
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - User settings
   */
  async getUserSettings(userId) {
    const result = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return result.length > 0 ? result[0] : undefined;
  }
  
  /**
   * Update user settings
   * @param {number} userId - User ID
   * @param {Object} newSettings - New settings
   * @returns {Promise<Object>} - Updated settings
   */
  async updateUserSettings(userId, newSettings) {
    // First, ensure user has settings
    const existingSettings = await this.getUserSettings(userId);
    
    if (!existingSettings) {
      return this.createUserSettings(userId);
    }
    
    // Update settings
    const result = await db.update(userSettings)
      .set({ ...newSettings, updatedAt: new Date() })
      .where(eq(userSettings.userId, userId))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }
  
  /**
   * Record a download
   * @param {Object} downloadData - Download data
   * @returns {Promise<Object>} - Created download record
   */
  async recordDownload(downloadData) {
    // If userId is provided, add to user's downloads
    if (downloadData.userId) {
      const result = await db.insert(downloads).values(downloadData).returning();
      return result.length > 0 ? result[0] : undefined;
    } 
    // Otherwise, add to guest downloads
    else {
      const { userId, ...guestData } = downloadData;
      const result = await db.insert(guestDownloads).values(guestData).returning();
      return result.length > 0 ? result[0] : undefined;
    }
  }
  
  /**
   * Get user's download history
   * @param {number} userId - User ID
   * @param {number} limit - Maximum number of records
   * @returns {Promise<Array>} - Download history
   */
  async getUserDownloadHistory(userId, limit = 100) {
    return await db.select()
      .from(downloads)
      .where(eq(downloads.userId, userId))
      .orderBy(desc(downloads.createdAt))
      .limit(limit);
  }
  
  /**
   * Clear user's download history
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} - Success indicator
   */
  async clearUserDownloadHistory(userId) {
    const result = await db.delete(downloads)
      .where(eq(downloads.userId, userId))
      .returning({ id: downloads.id });
    
    return result.length > 0;
  }
  
  /**
   * Get guest download history
   * @param {string} ipAddress - IP address
   * @param {number} limit - Maximum number of records
   * @returns {Promise<Array>} - Download history
   */
  async getGuestDownloadHistory(ipAddress, limit = 100) {
    if (!ipAddress) return [];
    
    return await db.select()
      .from(guestDownloads)
      .where(eq(guestDownloads.ipAddress, ipAddress))
      .orderBy(desc(guestDownloads.createdAt))
      .limit(limit);
  }
}

// Export a singleton instance
export const storage = new DatabaseStorage();

export default storage;