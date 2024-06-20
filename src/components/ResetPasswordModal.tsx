import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { apiClient } from '../api/client';

const ResetPasswordModal = ({ navigation, visible, onClose }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [buttonLabel, setButtonLabel] = useState('Send Verification Code');
  const [sendStatus, setSendStatus] = useState(false);
  const [codeId, setCodeId] = useState('');

  const handleSendResetCode = () => {
    if(sendStatus) {
      onClose();
      setStatusMessage('');
      navigation.navigate('ResetPassword', {emailOrUsername, codeId});
    } else {
    apiClient.post('users/send-reset-code/', { emailOrUsername })
      .then(response => {
        if(response.status === 200) {
            setSendStatus(true);
            setButtonLabel("Next >>");
            setStatusMessage('Verification code is sent to registered email. Press "Next" to continue');
            setCodeId(response.data.codeId);
        } else {
            setStatusMessage('Failed to send verification code.');
        }
      })
      .catch(error => {
        setStatusMessage('Failed to send verification code.');
        console.error('Error sending reset code:', error);
      });
    }
  };

  const handleClose = () => {
    setEmailOrUsername('');
    setStatusMessage('');
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
              <Text style={styles.title}>Reset Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Email or Username"
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                editable={!sendStatus}
              />
              <TouchableOpacity style={styles.button} onPress={handleSendResetCode}>
                <Text style={styles.buttonText}>{buttonLabel}</Text>
              </TouchableOpacity>
              {statusMessage ? (
                <Text style={[styles.statusMessage, sendStatus ? styles.greenStatus : styles.redStatus]}>{statusMessage}</Text>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    height: '30%',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  statusMessage: {
    marginTop: 20,
    textAlign: 'center',
  },
  redStatus: {
    color: 'red',
  },
  greenStatus: {
    color: 'green',
  },
});

export default ResetPasswordModal;
