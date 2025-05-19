import { pgTable, serial, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  downloads: many(downloads),
  settings: many(userSettings),
}));

// Downloads table
export const downloads = pgTable('downloads', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }),
  url: text('url').notNull(),
  platform: varchar('platform', { length: 50 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  filePath: text('file_path'),
  fileName: varchar('file_name', { length: 255 }),
  fileSize: integer('file_size'),
  thumbnail: text('thumbnail'),
  status: varchar('status', { length: 50 }).notNull().default('completed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Download relations
export const downloadsRelations = relations(downloads, ({ one }) => ({
  user: one(users, {
    fields: [downloads.userId],
    references: [users.id],
  }),
}));

// User settings table
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  autoDetectPlatform: boolean('auto_detect_platform').default(true),
  saveMetadata: boolean('save_metadata').default(true),
  highQualityByDefault: boolean('high_quality_by_default').default(true),
  showNotifications: boolean('show_notifications').default(true),
  darkMode: boolean('dark_mode').default(false),
  saveHistory: boolean('save_history').default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User settings relations
export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

// For when users are not logged in - guest downloads
export const guestDownloads = pgTable('guest_downloads', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  url: text('url').notNull(),
  platform: varchar('platform', { length: 50 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});