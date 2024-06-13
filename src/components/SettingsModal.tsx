import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { useTheme } from '../styles/ThemeContext';
import { themes } from '../styles/themes';

const SettingsModal = ({ visible, onClose, navigation }) => {
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log("########################  log-out access token: ", accessToken);
      if (refreshToken) {
        const response = await apiClient.get('/users/log-out/', { headers: { Authorization: `Bearer ${accessToken}`} });
        console.log("########################  log-out response: ", response);
      } else {
        Alert.alert('Error', 'No refresh token found');
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log("########################  log-out Cleanup: ");
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      navigation.replace('SplashLogout'); // Redirect to the Auth page or login screen
    }
  };

  const confirmLogout = () => {
    onClose();
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: handleLogout,
        },
      ],
      { cancelable: false }
    );
  };

  const handleExitApp = () => {
    BackHandler.exitApp();
  };

  const handleTheme = (theme) => {
    setTheme(theme);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.option} onPress={() => { /* Delete Account Logic */ onClose(); }}>
                <Text style={styles.optionText}>Notification Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={confirmLogout}>
                <Text style={styles.optionText}>Log Out</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={handleExitApp}>
                <Text style={styles.optionText}>Exit App</Text>
              </TouchableOpacity>

              {/* Theme Selector */}
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
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

export default SettingsModal;
