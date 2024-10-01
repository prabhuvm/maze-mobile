import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';
import { useNavigation } from '@react-navigation/native';


const CustomDrawerContent = ({ toggleInviteModal, ...props }) => {
  const { username, loginName, loginPremium, deviceId } = useGlobalContext();
  const [profilePic, setProfilePic] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await apiClient.get(`/users/${username}/user_pic/`, { 
          headers: { 
            Authorization: `Bearer ${accessToken}` 
          } 
          });
          console.log("Profile pic for user: ", response.data.url);
        setProfilePic({ uri: response.data.url });
      } catch (error) {
        console.error('Failed to fetch profile picture', error);
      }
    };
    fetchProfilePic();
  }, []);


  const handleLogout = async () => {
    try {
         const refreshToken = await AsyncStorage.getItem('refreshToken');
         const accessToken = await AsyncStorage.getItem('accessToken');
          if (refreshToken) {
            const response = await apiClient.post('/users/logout/', { deviceId }, 
            { headers: { 
              Authorization: `Bearer ${accessToken}`
            } });
          } else {
            Alert.alert('Error', 'No refresh token found');
          }
        } catch (error) {
          console.error(error);
        } finally {
          console.log("########################  log-out Cleanup: ");
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          navigation.navigate('SplashLogout'); // Redirect to the Auth page or login screen
        }
      };

        const confirmLogout = () => {
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


  return (
    <DrawerContentScrollView {...props}>
      {/* Profile Section */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.profileContainer} onPress={() => props.navigation.navigate('Profile')}>
          <View style={styles.profileImageContainer}>
          <Image source={profilePic || require('../assets/images/human.jpeg')} style={styles.profileImage} />
            {loginPremium && (
              <Image source={require('../assets/icons/badge-f.png')} style={styles.badge} />
            )}
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{loginName}</Text>
            <Text style={styles.viewProfileText}>View profile</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Profile')}>
          <Image source={require('../assets/icons/profile.png')} style={styles.icon} />
          <Text style={styles.menuItemText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Premium')}>
          <Image source={require('../assets/icons/badge-f.png')} style={styles.icon} />
          <Text style={styles.menuItemText}>Premium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Coins')}>
          <Image source={require('../assets/icons/coins.png')} style={styles.icon} />
          <Text style={styles.menuItemText}>Coins</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionDivider}></View>

      {/* Communities Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>Communities</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Leaderboard')}>
          <Image source={require('../assets/icons/leaderboard.png')} style={styles.icon} />
          <Text style={styles.menuItemText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Community')}>
          <Image source={require('../assets/icons/community.png')} style={styles.icon} />
          <Text style={styles.menuItemText}>Communities</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionDivider}></View>

      {/* Other Actions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>More Options</Text>
        <TouchableOpacity style={styles.menuItem} onPress={toggleInviteModal}>
          <Image source={require('../assets/icons/invite.png')} style={styles.icon} />
          <Text style={styles.menuItemText}>Invite Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate('Settings')}>
          <Image source={require('../assets/icons/cog.png')} style={styles.icon} />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={confirmLogout}>
          <Image source={require('../assets/icons/logout.png')} style={styles.icon} />
          <Text style={styles.menuItemText}>Log Out</Text>
        </TouchableOpacity>

      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  badge: {
    width: 20,
    height: 20,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  profileTextContainer: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewProfileText: {
    fontSize: 14,
    color: '#666',
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default CustomDrawerContent;
