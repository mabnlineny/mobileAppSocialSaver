import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('auto');
  
  const handleUrlChange = (text) => {
    setUrl(text);
    if (platform === 'auto') {
      setPlatform(detectPlatform(text));
    }
  };
  
  const detectPlatform = (url) => {
    if (!url) return 'auto';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    return 'auto';
  };
  
  const handleDownload = () => {
    if (!url) {
      Alert.alert('Missing URL', 'Please enter a URL to download');
      return;
    }
    
    // Simple validation for demo
    const detectedPlatform = detectPlatform(url);
    if (detectedPlatform === 'auto') {
      Alert.alert('Invalid URL', 'Please enter a valid social media URL');
      return;
    }
    
    Alert.alert(
      'Download Started', 
      `Starting download from ${detectedPlatform}.\nThis is a demo and no actual download will occur.`
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>SocialSaver</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.downloadCard}>
          <Text style={styles.cardTitle}>Download Media</Text>
          <Text style={styles.cardSubtitle}>Enter URL from Instagram, YouTube, or Twitter</Text>
          
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              placeholder="Paste URL here..."
              value={url}
              onChangeText={handleUrlChange}
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.platformContainer}>
            <Text style={styles.platformLabel}>Platform:</Text>
            <View style={styles.platformButtons}>
              <TouchableOpacity 
                style={[
                  styles.platformButton, 
                  platform === 'auto' && styles.activePlatform
                ]}
                onPress={() => setPlatform('auto')}
              >
                <Text style={styles.platformButtonText}>Auto</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.platformButton, 
                  platform === 'instagram' && styles.activePlatform
                ]}
                onPress={() => setPlatform('instagram')}
              >
                <Text style={styles.platformButtonText}>Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.platformButton, 
                  platform === 'youtube' && styles.activePlatform
                ]}
                onPress={() => setPlatform('youtube')}
              >
                <Text style={styles.platformButtonText}>YouTube</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.platformButton, 
                  platform === 'twitter' && styles.activePlatform
                ]}
                onPress={() => setPlatform('twitter')}
              >
                <Text style={styles.platformButtonText}>Twitter</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <FontAwesome5 name="download" size={16} color="#fff" />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to Download</Text>
          <View style={styles.infoStep}>
            <View style={styles.infoStepCircle}><Text style={styles.infoStepNumber}>1</Text></View>
            <Text style={styles.infoStepText}>Copy the URL of a video or photo</Text>
          </View>
          <View style={styles.infoStep}>
            <View style={styles.infoStepCircle}><Text style={styles.infoStepNumber}>2</Text></View>
            <Text style={styles.infoStepText}>Paste it in the input field above</Text>
          </View>
          <View style={styles.infoStep}>
            <View style={styles.infoStepCircle}><Text style={styles.infoStepNumber}>3</Text></View>
            <Text style={styles.infoStepText}>Click Download to save it to your device</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
          <FontAwesome5 name="home" size={22} color={theme.colors.primary} />
          <Text style={[styles.tabLabel, { color: theme.colors.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('History')}>
          <FontAwesome5 name="history" size={22} color="#888" />
          <Text style={styles.tabLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Settings')}>
          <FontAwesome5 name="cog" size={22} color="#888" />
          <Text style={styles.tabLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  downloadCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  platformContainer: {
    marginBottom: 20,
  },
  platformLabel: {
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  activePlatform: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  platformButtonText: {
    fontSize: 14,
    color: '#333',
  },
  downloadButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoStepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoStepNumber: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoStepText: {
    fontSize: 15,
    color: '#555',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 60,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
});

export default HomeScreen;