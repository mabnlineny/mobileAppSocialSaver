import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

// Platform icons
export const InstagramIcon = ({ size, color, style }) => (
  <FontAwesome5 name="instagram" size={size} color={color} style={style} />
);

export const YouTubeIcon = ({ size, color, style }) => (
  <FontAwesome5 name="youtube" size={size} color={color} style={style} />
);

export const TwitterIcon = ({ size, color, style }) => (
  <FontAwesome5 name="twitter" size={size} color={color} style={style} />
);

// Feature icons
export const DownloadIcon = ({ size, color, style }) => (
  <FontAwesome5 name="download" size={size} color={color} style={style} />
);

export const VideoIcon = ({ size, color, style }) => (
  <FontAwesome5 name="video" size={size} color={color} style={style} />
);

export const AudioIcon = ({ size, color, style }) => (
  <FontAwesome5 name="music" size={size} color={color} style={style} />
);

export const PhotoIcon = ({ size, color, style }) => (
  <FontAwesome5 name="image" size={size} color={color} style={style} />
);

export const SettingsIcon = ({ size, color, style }) => (
  <FontAwesome5 name="cog" size={size} color={color} style={style} />
);

export const HistoryIcon = ({ size, color, style }) => (
  <FontAwesome5 name="history" size={size} color={color} style={style} />
);

export const InfoIcon = ({ size, color, style }) => (
  <FontAwesome5 name="info-circle" size={size} color={color} style={style} />
);

export const SearchIcon = ({ size, color, style }) => (
  <FontAwesome5 name="search" size={size} color={color} style={style} />
);

export const ShareIcon = ({ size, color, style }) => (
  <FontAwesome5 name="share-alt" size={size} color={color} style={style} />
);

// Navigation icons
export const BackIcon = ({ size, color, style }) => (
  <FontAwesome5 name="arrow-left" size={size} color={color} style={style} />
);

export const ForwardIcon = ({ size, color, style }) => (
  <FontAwesome5 name="arrow-right" size={size} color={color} style={style} />
);

export const MenuIcon = ({ size, color, style }) => (
  <FontAwesome5 name="bars" size={size} color={color} style={style} />
);

// Status icons
export const SuccessIcon = ({ size, color, style }) => (
  <FontAwesome5 name="check-circle" size={size} color={color || '#48BB78'} style={style} />
);

export const ErrorIcon = ({ size, color, style }) => (
  <FontAwesome5 name="times-circle" size={size} color={color || '#F56565'} style={style} />
);

export const WarningIcon = ({ size, color, style }) => (
  <FontAwesome5 name="exclamation-circle" size={size} color={color || '#ED8936'} style={style} />
);

export const LoadingIcon = ({ size, color, style }) => (
  <FontAwesome5 name="spinner" size={size} color={color} style={[{ ...(style || {}), opacity: 0.8 }]} />
);
