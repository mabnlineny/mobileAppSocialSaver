import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const platforms = [
  { id: 'auto', label: 'Auto Detect', icon: 'magic' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
  { id: 'youtube', label: 'YouTube', icon: 'youtube' },
  { id: 'twitter', label: 'Twitter', icon: 'twitter' }
];

const PlatformSelector = ({ selectedPlatform, onSelectPlatform }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Platform:</Text>
      <View style={styles.platformButtons}>
        {platforms.map(platform => (
          <TouchableOpacity
            key={platform.id}
            style={[
              styles.platformButton,
              selectedPlatform === platform.id && styles.platformButtonActive
            ]}
            onPress={() => onSelectPlatform(platform.id)}
          >
            <FontAwesome5 
              name={platform.icon} 
              size={14} 
              color={selectedPlatform === platform.id ? '#fff' : '#555'} 
              style={styles.platformIcon} 
            />
            <Text 
              style={[
                styles.platformLabel,
                selectedPlatform === platform.id && styles.platformLabelActive
              ]}
            >
              {platform.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  platformButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  platformButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  platformIcon: {
    marginRight: 6,
  },
  platformLabel: {
    fontSize: 14,
    color: '#555',
  },
  platformLabelActive: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default PlatformSelector;