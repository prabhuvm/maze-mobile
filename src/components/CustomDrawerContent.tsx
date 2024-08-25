import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client'; // Make sure to import your API client

const deleteAccount = async () => {
  try {
    const response = await apiClient.delete('/delete-account'); // Make the API call to delete the account
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

const CustomDrawerContent = ({ toggleInviteModal, ...props }) => (
  <DrawerContentScrollView {...props}>
    <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Timeline')}>
      <Image source={require('../assets/icons/timeline.png')} style={styles.icon} />
      <Text style={styles.menuItemText}>Timeline</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Profile')}>
      <Image source={require('../assets/icons/profile.png')} style={styles.icon} />
      <Text style={styles.menuItemText}>Profile</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Coins')}>
      <Image source={require('../assets/icons/coins.png')} style={styles.icon} />
      <Text style={styles.menuItemText}>Coins</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Update Profile')}>
      <Image source={require('../assets/icons/edit.png')} style={styles.icon} />
      <Text style={styles.menuItemText}>Update Profile</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.menuItem} onPress={toggleInviteModal}>
        <Image source={require('../assets/icons/invite.png')} style={styles.icon} />
        <Text style={styles.menuItemText}>Invite Friends</Text>
      </TouchableOpacity>
    <TouchableOpacity style={styles.menuItem} onPress={() => {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: deleteAccount },
        ],
        { cancelable: false }
      );
    }}>
      <Image source={require('../assets/icons/delete.png')} style={styles.icon} />
      <Text style={styles.menuItemText}>Delete Account</Text>
    </TouchableOpacity>
  </DrawerContentScrollView>
);

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
  },
  inviteContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  inviteButton: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  inviteText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
