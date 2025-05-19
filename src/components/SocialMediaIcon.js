import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const SocialMediaIcon = ({ platform, size = 24, style }) => {
  const getIconName = () => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'instagram';
      case 'youtube':
        return 'youtube';
      case 'twitter':
        return 'twitter';
      default:
        return 'share-alt';
    }
  };

  const getIconColor = () => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return theme.platformColors.instagram;
      case 'youtube':
        return theme.platformColors.youtube;
      case 'twitter':
        return theme.platformColors.twitter;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getIconColor() }, style]}>
      <FontAwesome5 name={getIconName()} size={size * 0.6} color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
});

export default SocialMediaIcon;
