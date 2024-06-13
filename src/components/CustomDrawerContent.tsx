// CustomDrawerContent.tsx
import React from 'react';
import { Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { apiClient } from '../api/client'; // Make sure to import your API client
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    <DrawerItemList {...props} />
    <DrawerItem
      label="Delete Account"
      onPress={() => {
        Alert.alert(
          'Delete Account',
          'Are you sure you want to delete your account?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: deleteAccount },
          ],
          { cancelable: false }
        );
      }}
    />
  </DrawerContentScrollView>
);

export default CustomDrawerContent;
