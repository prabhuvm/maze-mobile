import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../GlobalContext';
import ResetPasswordModal from './ResetPasswordModal';
import DeviceInfo from 'react-native-device-info';

const AuthScreen = () => {
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { username, setAccessToken, setUsername, setRefreshToken, deviceId, setDeviceId} = useGlobalContext();
  const [verifyError, setVerifyError] = useState(false);
  const [verifyErrMessage, setVerifyErrMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
       // Get the device name
       DeviceInfo.getDeviceName().then((name) => {
        setDeviceName(name);
      });

      // Get the device name
      DeviceInfo.getUniqueId().then((id) => {
        setDeviceId(id);
      });
  }, []);

  const handleLogin = () => {
    setStatusMessage("Processing...");
    console.log("###### Device identities - ID: ", deviceId, " Name: ", deviceName);
    apiClient.post('users/login/', { username, password, deviceId, deviceName })
      .then(response => {
        const {accessToken, refreshToken } = response.data;
        AsyncStorage.setItem('accessToken', accessToken);
        AsyncStorage.setItem('refreshToken', refreshToken);
        setUsername(username);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        resetFields();
        navigation.navigate('Eligibility');
      })
      .catch(error => {
        setVerifyError(true);
        setVerifyErrMessage('Login Failed. Sign up if you are a new user.');
        if (error.response) {
          console.error('Error response:', error.response);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      });
  };

  const handleResetPassword = () => {
    resetFields();
    setModalVisible(true);
  };

  const handleSignup = () => {
    resetFields();
    navigation.navigate('SignupStep');
  }

  const resetFields = () => {
    setVerifyError(false);
    setVerifyErrMessage('');
    setStatusMessage('');
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/maze.jpeg')} style={styles.robotImage} />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleResetPassword}>
        <Text style={styles.resetPasswordText}>Forgot Password? Reset here</Text>
      </TouchableOpacity>
      {!verifyError && <Text style={styles.statusMessage}>{statusMessage}</Text>}
      {verifyError && <Text style={styles.verifyErrMessage}>{verifyErrMessage}</Text>}

      <ResetPasswordModal navigation={navigation} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white', // Add background color from the theme
  },
  robotImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold', // Bold text as in the theme
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 20, // Rounded corners
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 20, // Rounded corners
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  resetButton: {
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  resetButtonText: {
    color: 'blue',
  },
  resetPasswordText: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 5,
  },
  verifyErrMessage: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
  },
  statusMessage: {
    color: 'blue',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
  },
});

export default AuthScreen;
