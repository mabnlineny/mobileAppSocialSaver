import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const Header = ({ 
  title, 
  leftIcon, 
  rightIcon, 
  onLeftPress, 
  onRightPress,
  showGradient = true
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container, 
      { paddingTop: insets.top },
      showGradient ? styles.gradientBg : styles.solidBg
    ]}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />
      
      <View style={styles.content}>
        {leftIcon ? (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onLeftPress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <FontAwesome5 name={leftIcon} size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
        
        <Text style={styles.title}>{title}</Text>
        
        {rightIcon ? (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onRightPress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <FontAwesome5 name={rightIcon} size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  gradientBg: {
    backgroundColor: theme.colors.primary,
  },
  solidBg: {
    backgroundColor: theme.colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 40,
  },
});

export default Header;
