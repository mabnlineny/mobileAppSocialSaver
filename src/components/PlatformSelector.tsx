import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

// Platform type definition
interface Platform {
  id: string;
  label: string;
  icon: string;
}

// Component props
interface PlatformSelectorProps {
  platforms: Platform[];
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
  disabled?: boolean;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platforms,
  selectedPlatform,
  onSelectPlatform,
  disabled = false
}) => {
  const { theme } = useTheme();
  
  // Get icon color based on platform
  const getIconColor = (platform: string, isSelected: boolean) => {
    if (isSelected) {
      return '#ffffff';
    }
    
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
  
  // Get background color for platform button
  const getButtonBackgroundColor = (platform: string, isSelected: boolean) => {
    if (isSelected) {
      switch (platform) {
        case 'instagram':
          return theme.colors.instagram;
        case 'youtube':
          return theme.colors.youtube;
        case 'twitter':
          return theme.colors.twitter;
        default:
          return theme.colors.primary;
      }
    }
    
    return theme.colors.card;
  };
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>Select Platform:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.platformsContainer}
      >
        {platforms.map(platform => {
          const isSelected = selectedPlatform === platform.id;
          
          return (
            <TouchableOpacity
              key={platform.id}
              style={[
                styles.platformButton,
                {
                  backgroundColor: getButtonBackgroundColor(platform.id, isSelected),
                  borderColor: isSelected ? 'transparent' : theme.colors.border,
                  opacity: disabled ? 0.6 : 1
                }
              ]}
              onPress={() => onSelectPlatform(platform.id)}
              disabled={disabled}
            >
              <FontAwesome5
                name={platform.icon}
                size={16}
                color={getIconColor(platform.id, isSelected)}
                style={styles.platformIcon}
              />
              <Text
                style={[
                  styles.platformLabel,
                  {
                    color: isSelected ? '#ffffff' : theme.colors.text
                  }
                ]}
              >
                {platform.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  platformsContainer: {
    flexDirection: 'row',
    paddingVertical: 4
  },
  platformButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10
  },
  platformIcon: {
    marginRight: 6
  },
  platformLabel: {
    fontSize: 14,
    fontWeight: '500'
  }
});

export default PlatformSelector;