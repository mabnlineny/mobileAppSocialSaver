import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'app_settings';

const defaultSettings = {
  saveLocation: 'default',
  autoDetectPlatform: true,
  darkMode: false,
  highQualityDefault: true,
  notifications: true,
  wifiOnly: false,
  autoPlayPreview: true
};

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const updateSetting = async (key, value) => {
    try {
      const updatedSettings = {
        ...settings,
        [key]: value
      };
      
      setSettings(updatedSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving setting:', error);
      Alert.alert('Error', 'Could not save settings');
    }
  };

  const resetSettings = async () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              setSettings(defaultSettings);
              await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
              Alert.alert('Success', 'Settings reset to default');
            } catch (error) {
              console.error('Error resetting settings:', error);
              Alert.alert('Error', 'Could not reset settings');
            }
          }
        }
      ]
    );
  };

  const renderSwitch = (key, label, description) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={settings[key]}
        onValueChange={(value) => updateSetting(key, value)}
        trackColor={{ false: '#d0d0d0', true: theme.colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );

  const renderNavigationItem = (label, icon, onPress) => (
    <TouchableOpacity style={styles.navigationItem} onPress={onPress}>
      <View style={styles.navigationItemContent}>
        <FontAwesome5 name={icon} size={18} color={theme.colors.textSecondary} style={styles.navigationIcon} />
        <Text style={styles.navigationLabel}>{label}</Text>
      </View>
      <FontAwesome5 name="chevron-right" size={16} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Download Settings</Text>
          {renderSwitch('highQualityDefault', 'High Quality Default', 'Always download in best available quality')}
          {renderSwitch('wifiOnly', 'Wi-Fi Only', 'Only download media when connected to Wi-Fi')}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          {renderSwitch('autoDetectPlatform', 'Auto-Detect Platform', 'Automatically detect platform from URL')}
          {renderSwitch('darkMode', 'Dark Mode', 'Use dark theme throughout the app')}
          {renderSwitch('notifications', 'Notifications', 'Enable download completion notifications')}
          {renderSwitch('autoPlayPreview', 'Auto-Play Preview', 'Automatically play video previews')}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>
          
          {renderNavigationItem('About SocialSaver', 'info-circle', () => navigation.navigate('About'))}
          
          <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
            <Text style={styles.resetButtonText}>Reset to Default Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  navigationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  navigationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationIcon: {
    marginRight: 12,
  },
  navigationLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  resetButtonText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsScreen;