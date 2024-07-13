import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, Alert, Modal,Clipboard } from 'react-native';

const InviteModal = ({ visible, onClose }) => {
  const message = 'Check out this awesome app!';

  const inviteViaWhatsApp = () => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Make sure WhatsApp is installed on your device');
    });
  };

  const inviteViaTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Make sure Twitter is installed on your device');
    });
  };

  const inviteViaLinkedIn = () => {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Make sure LinkedIn is installed on your device');
    });
  };

  const inviteViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Make sure Facebook is installed on your device');
    });
  };

  const copyToClipboard = () => {
    Clipboard.setString(message);
    Alert.alert('Link copied', 'The link has been copied to your clipboard.');
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Invite friends</Text>
            <TouchableOpacity onPress={onClose}>
            <Image source={require('../assets/icons/close.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.option} onPress={inviteViaWhatsApp}>
            <Image source={require('../assets/icons/whatsapp.png')} style={styles.icon} />
            <Text style={styles.optionText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={inviteViaTwitter}>
            <Image source={require('../assets/icons/twitter.png')} style={styles.icon} />
            <Text style={styles.optionText}>Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={inviteViaLinkedIn}>
            <Image source={require('../assets/icons/linkedin.png')} style={styles.icon} />
            <Text style={styles.optionText}>LinkedIn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={inviteViaFacebook}>
            <Image source={require('../assets/icons/facebook.png')} style={styles.icon} />
            <Text style={styles.optionText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={copyToClipboard}>
          <Image source={require('../assets/icons/copylink.png')} style={styles.icon} />
            <Text style={styles.copyText}>Copy link</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  closeIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
  copyText: {
    fontSize: 16,
    flex: 1,
  },
});

export default InviteModal;
