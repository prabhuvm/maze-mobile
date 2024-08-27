import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { useTheme } from '../styles/ThemeContext';
import { themes } from '../styles/themes';

const SettingsScreen = ({ navigation }) => {
    const { setTheme } = useTheme();
  const [isPushEnabled, setIsPushEnabled] = useState(true);
//   const [isEmailEnabled, setIsEmailEnabled] = useState(false);
//   const [isSMSEnabled, setIsSMSEnabled] = useState(false);

  const toggleSwitch = (setState) => {
    setState((previousState) => !previousState);
  };

  const deleteAccount = async () => {
    try {
      const response = await apiClient.delete('/delete-account');
      if (response.status === 200) {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        Alert.alert('Success', 'Account deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete account');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account');
      console.error(error);
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: deleteAccount },
      ],
      { cancelable: false }
    );
  };

  const handleTheme = (theme) => {
    setTheme(theme);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/backt.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>Push Notifications</Text>
          <Switch
            onValueChange={() => toggleSwitch(setIsPushEnabled)}
            value={isPushEnabled}
          />
        </View>
        {/* <View style={styles.optionContainer}>
          <Text style={styles.optionText}>Email Notifications</Text>
          <Switch
            onValueChange={() => toggleSwitch(setIsEmailEnabled)}
            value={isEmailEnabled}
          />
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.optionText}>SMS Notifications</Text>
          <Switch
            onValueChange={() => toggleSwitch(setIsSMSEnabled)}
            value={isSMSEnabled}
          />
        </View> */}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('About')}>
          <Text style={styles.optionText}>About</Text>
          <Image source={require('../assets/icons/forward.png')} style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={() => navigation.navigate('Updates')}>
          <Text style={styles.optionText}>Software Updates</Text>
          <Image source={require('../assets/icons/forward.png')} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
      <Text style={styles.sectionTitle}>Themes</Text>
     <View style={styles.themeSelector}>
        <View style={styles.themeOptions}>
            <TouchableOpacity
            style={[styles.themeDot, { backgroundColor: themes.light.background }]}
            onPress={() => handleTheme(themes.light)}
            />
            <TouchableOpacity
            style={[styles.themeDot, { backgroundColor: themes.teal.background}]}
            onPress={() => handleTheme(themes.teal)}
            />
            <TouchableOpacity
            style={[styles.themeDot, { backgroundColor: themes.yellow.background }]}
            onPress={() => handleTheme(themes.yellow)}
            />
            <TouchableOpacity
            style={[styles.themeDot, { backgroundColor: themes.crimson.background}]}
            onPress={() => handleTheme(themes.crimson)}
            />
        </View>
    </View>
    </View>

      <TouchableOpacity 
        style={[styles.optionContainer, styles.deleteAccountContainer]} 
        onPress={confirmDeleteAccount}
      >
        <Image source={require('../assets/icons/delete.png')} style={styles.deleteIcon} />
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 16,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#888',
  },
  deleteAccountContainer: {
    marginTop: 20,
    backgroundColor: '#FFD2D2',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20, // Adjust padding to fit content properly
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // Align text and icon in a row
  },
  deleteIcon: {
    width: 24, 
    height: 24, 
    marginRight: 10, // Space between the icon and the text
  },
  deleteText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },

  themeSelector: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '40%',
    marginTop: 10,
  },
  themeDot: {
    width: 20,
    height: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default SettingsScreen;
