import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const AboutScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 18 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="cloud-download-alt" size={60} color={theme.colors.primary} />
          <Text style={styles.appName}>SocialSaver</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About SocialSaver</Text>
          <Text style={styles.paragraph}>
            SocialSaver is a powerful tool that allows you to download videos and photos 
            from popular social media platforms including Instagram, YouTube, and Twitter.
          </Text>
          <Text style={styles.paragraph}>
            With SocialSaver, you can easily save your favorite content for offline 
            viewing, sharing, or archiving.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Copy the URL of any Instagram, YouTube, or Twitter content you want to download
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Paste the URL in the download box on the home screen
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Select your preferred quality options (if available)
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>4</Text>
            </View>
            <Text style={styles.instructionText}>
              Tap download and wait for the process to complete
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supported Platforms</Text>
          <View style={styles.platformsContainer}>
            <View style={styles.platformItem}>
              <FontAwesome5 name="instagram" size={24} color={theme.colors.instagram} />
              <Text style={styles.platformName}>Instagram</Text>
            </View>
            <View style={styles.platformItem}>
              <FontAwesome5 name="youtube" size={24} color={theme.colors.youtube} />
              <Text style={styles.platformName}>YouTube</Text>
            </View>
            <View style={styles.platformItem}>
              <FontAwesome5 name="twitter" size={24} color={theme.colors.twitter} />
              <Text style={styles.platformName}>Twitter</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disclaimer</Text>
          <Text style={styles.paragraph}>
            SocialSaver is designed for personal use only. Please respect copyright laws 
            and the terms of service of each platform. We do not host or store any of the 
            content, and this app should only be used for downloading content that you have 
            the right to download.
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 SocialSaver App</Text>
          <Text style={styles.footerText}>All Rights Reserved</Text>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 16,
  },
  appVersion: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
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
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  platformsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  platformItem: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  platformName: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.text,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
});

export default AboutScreen;