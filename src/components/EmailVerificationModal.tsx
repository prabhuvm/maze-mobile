import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { apiClient } from '../api/client';

const EmailVerificationModal = ({ visible, onClose, username, navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleVerify = () => {
    apiClient.post('/users/verify-email-code/', { username, verificationCode })
      .then(response => {
        if (response.status === 200) {
          setStatusMessage('Email verified successfully.');
          setTimeout(() => {
            onClose();
            setStatusMessage('');
            setVerificationCode('');
          }, 2000);
        }
      })
      .catch(error => {
        setStatusMessage('Verification failed. Please try again.');
        console.error('Error verifying email:', error);
      });
  };

  const handleClose = () => {
    setStatusMessage('');
    setVerificationCode('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Complete Email Verification</Text>
              <Text style={styles.message}>Please enter the verification code sent to your email. If you need to update your email, please visit update profile.</Text>
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
              <TouchableOpacity style={styles.button} onPress={handleVerify}>
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
              {statusMessage ? (
                <Text style={styles.statusMessage}>{statusMessage}</Text>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: 'gray',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  statusMessage: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default EmailVerificationModal;
