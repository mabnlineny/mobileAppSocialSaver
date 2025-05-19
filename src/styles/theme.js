/**
 * Application Theme
 * 
 * This file defines the theme colors, spacing, fonts, and other UI constants
 * used throughout the application for consistent styling.
 */

export const theme = {
  // Color palette
  colors: {
    primary: '#0066cc',
    secondary: '#3498db',
    accent: '#2ecc71',
    error: '#e74c3c',
    warning: '#f39c12',
    info: '#3498db',
    success: '#2ecc71',
    background: '#f4f6fa',
    card: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    border: '#dddddd',
    disabled: '#cccccc',
    instagram: '#c13584',
    youtube: '#ff0000',
    twitter: '#1da1f2'
  },
  
  // Typography
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System-Bold',
    },
    fontSize: {
      tiny: 10,
      small: 12,
      regular: 14,
      medium: 16,
      large: 18,
      xlarge: 20,
      xxlarge: 24,
      huge: 30
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  
  // Spacing
  spacing: {
    tiny: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 48
  },
  
  // Border radius
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 20,
    round: 9999 // For fully rounded elements like round buttons
  },
  
  // Shadows
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4
    }
  },
  
  // Animation
  animation: {
    timing: {
      fast: 200,
      normal: 300,
      slow: 500
    }
  }
};