import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';

const ResetPasswordScreen = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSuccessMessage, setVerificationSuccessMessage] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const [codeId, setCodeId] = useState(route.params.codeId);
  const passwordInputRef = useRef(null);


  var emailOrUsername= route.params.emailOrUsername;

  const validateFields = () => {
    let valid = true;
    let errors = {};
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

  const handleVerification = () => {
    if (!verificationCode) {
      errors.verificationCode = 'Verification code is required';
      setErrors(errors);
    } else {
        console.log("########## verify code params: ", { emailOrUsername, verificationCode, codeId })
    apiClient.post('users/verify-reset-code/', { emailOrUsername, verificationCode, codeId })
      .then(response => {
        if (response.data.success === 1) {
          setIsVerified(true);
          setErrors({});
          setUsername(response.data.username);
          setVerificationSuccessMessage('Verification successful');
          setTimeout(() => {
            if (passwordInputRef.current) {
                passwordInputRef.current.focus();
            }
          }, 100);
        } else {
          setErrors({ verificationCode: 'Verification failed' });
        }
      })
      .catch(error => console.error(error));
  }
}

  const handleResendCode = () => {
    apiClient.post('users/send-reset-code/', { emailOrUsername })
      .then(response => {
        if(response.status === 200) {
            setCodeId(response.data.codeId);
            alert('Verification code sent.');
        } else {
            alert('Failed to send verification code. Please try again.');
        }
      })
      .catch(error => console.error(error));
  };

  const handleResetPassword = () => {
    if (validateFields() && isVerified) {
        console.log("############ Password reset params: ", {username, password, verificationCode, codeId});
      apiClient.post('/users/reset-password/', {
        username, password, verificationCode, codeId
      })
        .then(response => {
          if (response.data.success === 1) {
            alert('Password Reset Successful! You can login now.');
            setIsVerified(false);
            setVerificationSuccessMessage('');
            navigation.navigate('Login');
          } else {
            alert('Signup failed');
          }
        })
        .catch(error => console.error(error));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/maze.jpeg')} style={styles.logo} />

      <View style={styles.verificationContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.vlabel}>Code:</Text>
          <TextInput
            style={[styles.vinput, styles.verificationInput, errors.verificationCode && styles.errorInput]}
            placeholder="Verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            editable={!isVerified}
          />
        </View>
        <View style={styles.verifyButtonContainer}>
          <TouchableOpacity
            style={[styles.verifyButton, isVerified && styles.disabledButton]}
            onPress={handleVerification}
            disabled={isVerified}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resendButton} disabled={isVerified} onPress={handleResendCode}>
            <Text style={styles.resendButtonText}>Resend verification code</Text>
          </TouchableOpacity>
        </View>
        {isVerified && <Text style={styles.successMessage}>{verificationSuccessMessage}</Text>}
      </View>

      {errors.verificationCode && (
        <Text style={styles.errorText}>{errors.verificationCode}</Text>
      )}

      <Text style={styles.instructionText}>Please enter the verification code sent to your email and confirm verification before proceeding.</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          ref={passwordInputRef}
          style={[styles.input, errors.password && styles.errorInput]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={isVerified}
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
          editable={isVerified}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={!isVerified}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
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
  verificationContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
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
  vlabel: {
    fontSize: 16,
    marginRight: 5,
    width: 80, // Ensures labels are aligned properly
  },
  vinput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 20,
    width: 0,
    borderRadius: 20, // Rounded corners
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
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
  verifyButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20, // Rounded corners
    alignItems: 'center',
    marginLeft:60,
    width: 100,
    marginRight: 10,
  },
  resendButton: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20, // Adjust for better spacing
  },
  resendButtonText: {
    color: 'blue',
  },
  instructionText: {
    color: 'gray',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
        color: 'green',
        fontSize: 14,
        marginTop: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  errorInput: {
    borderColor: 'red',
  },
});

export default ResetPasswordScreen;
