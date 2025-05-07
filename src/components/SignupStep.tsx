import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const SignupStep = () => {
  const {deviceId, setUsername, setDeviceId} = useGlobalContext();
  const [deviceName, setDeviceName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const emailInputRef = useRef(null);

  const [verifyError, setVerifyError] = useState(false);
  const [verifyErrMessage, setVerifyErrMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');


  const validateFields = () => {
    let valid = true;
    let errors = {};
    if (!email) {
      errors.email = 'Email is required';
      valid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        errors.email = 'Invalid email address';
        valid = false;
      }
    }
    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
      valid = false;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

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

  const handleSignup = () => {
    if (validateFields()) {
      setStatusMessage("Processing...");
      apiClient.post('/users/sign-up/', {
        email, password, deviceId, deviceName
      })
        .then(response => {
          console.log("########################### sign up: ", response.data, ":::", response.status);
          if (response.status === 201){
            const {username, accessToken, refreshToken } = response.data;
            console.log('##################### token read: ', accessToken)
            setUsername(username);
            AsyncStorage.setItem('accessToken', accessToken);
            AsyncStorage.setItem('refreshToken', refreshToken);
            navigation.navigate('Interests');
          } else {
            if(response.data.error)
              setVerifyErrMessage(response.data.error);
            setVerifyError(true);
          }
        })
        .catch(error => {
          setVerifyErrMessage("Account creation failed, try after sometime!");
          setVerifyError(true);
          console.error(error);
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/maze.jpeg')} style={styles.logo} />

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          ref={emailInputRef}
          style={[styles.input, errors.username && styles.errorInput]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={[styles.input, errors.password && styles.errorInput]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Confirm:</Text>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.errorInput]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {!verifyError && <Text style={styles.statusMessage}>{statusMessage}</Text>}
      {verifyError && <Text style={styles.verifyErrMessage}>{verifyErrMessage}</Text>}

      {Object.keys(errors).map((key) => (
        <Text key={key} style={styles.errorText}>{errors[key]}</Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white', // Add background color from the theme
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginRight: 5,
    width: 80, // Ensures labels are aligned properly
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 4,
    borderRadius: 20, // Rounded corners
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 20, // Rounded corners
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  errorInput: {
    borderColor: 'red',
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

export default SignupStep;
