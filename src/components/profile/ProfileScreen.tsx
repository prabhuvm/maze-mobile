import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../../GlobalContext';
import { apiClient } from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AchievementBoard from './AchievementBoard';  // Import the AchievementBoard component
import ProfileActivities from './ProfileActivities'; // Import the Activities component (dummy for now)

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { username: loginUsername } = useGlobalContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [curUser, setCurUser] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [premium, setPremium] = useState(false);  // State to track if the user is premium
  const route = useRoute();
  const [profileUsername, setProfileUsername] = useState(route.params?.profileUsername || loginUsername);
  const [achievements, setAchievements] = useState([]);  // State for achievements
  const [activeTab, setActiveTab] = useState('ProfileActivities');  // To toggle between Achievements and Activities

  useEffect(() => {
    setDescription('');
    setName('');
    setProfilePic(null);
    fetchUserDetails();
    fetchProfilePic();
    fetchAchievements();  // Fetch achievements on profile load
    checkFollowed(profileUsername);
    setCurUser(loginUsername === profileUsername);
  }, [profileUsername]);

  useFocusEffect(
    React.useCallback(() => {
      const newProfileUsername = route.params?.profileUsername;
      if (newProfileUsername && newProfileUsername !== profileUsername) {
        setProfileUsername(newProfileUsername);
      } else if (!newProfileUsername) {
        setProfileUsername(loginUsername);
      }
      return () => {
        navigation.setParams({
          profileUsername: undefined,
        });
      };
    }, [route.params?.profileUsername, loginUsername, navigation])
  );

  const fetchUserDetails = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.get(`/users/${profileUsername}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('++++++++++ user details response.data >>>>>', response.data);
      setName(response.data.name);
      setDescription(response.data.description);
      setPremium(response.data.premium);  // Set the premium flag from the API response
      setFollowerCount(response.data.follower_count);
    } catch (error) {
      console.error('Failed to fetch user details', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.get(`/users/${profileUsername}/achievements`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setAchievements(response.data.achievements);  // Set achievements data
    } catch (error) {
      console.error('Failed to fetch achievements', error);
    }
  };

  const handleFollow = async (fusername) => {
    if (!followed) {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await apiClient.post(`/users/${loginUsername}/follow/`, {
        username: fusername
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
          if (response.status === 200) {
            setFollowed(true);
          }
        })
        .catch(error => {
          console.error('Error following:', error);
        });
    }
  };

  const checkFollowed = async (fusername) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.post(`/users/${loginUsername}/is-following/`, {
      username: fusername
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        if (response.status === 200) {
          setFollowed(response.data.result);
        }
      })
      .catch(error => {
        console.error('Error checking follow status:', error);
      });
  };

  const fetchProfilePic = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.get(`/users/${profileUsername}/user_pic/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setProfilePic({ uri: response.data.url });
    } catch (error) {
      console.error('Failed to fetch profile picture', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/icons/backi.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>@{profileUsername}</Text> 
        {!curUser && (
          <TouchableOpacity onPress={() => navigation.navigate('Message', { fusername: profileUsername })}>
            
            <Image source={require('../../assets/icons/message.png')} style={styles.icon} />
          </TouchableOpacity>
        )}


      </View>

      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image source={profilePic || require('../../assets/images/human.jpeg')} style={styles.avatar} />
          {premium && (
            <Image source={require('../../assets/icons/badge-f.png')} style={styles.premiumBadge} />
          )}
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.followConnectionsContainer}>
        {curUser ? (
          <TouchableOpacity style={styles.followButton} onPress={() => navigation.navigate('Update Profile', { setup: false })}>
            <Text style={styles.followButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.followButton} onPress={() => handleFollow(profileUsername)}>
            <Text style={styles.followButtonText}>{followed ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.connectionsContainer} onPress={() => navigation.navigate('Connections', { fusername: profileUsername })}>
          <Text style={styles.connectionsNumber}>{followerCount}</Text>
          <Text style={styles.connectionsText}>Followers</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs for Achievements and Activities */}
      <View style={styles.tabs}>
      <TouchableOpacity onPress={() => setActiveTab('ProfileActivities')} style={styles.tab}>
          <Text style={activeTab === 'ProfileActivities' ? styles.tabActiveText : styles.tabText}>Activities</Text>
        </TouchableOpacity>
      
        {/* <TouchableOpacity onPress={() => setActiveTab('Achievements')} style={styles.tab}>
          <Text style={activeTab === 'Achievements' ? styles.tabActiveText : styles.tabText}>Achievements</Text>
        </TouchableOpacity> */}
        
      </View>
      
      {/*
      activeTab === 'Achievements' ? (
        <AchievementBoard achievements={achievements} />
      ) : (
        <Activities />  
      )*/}

      <ProfileActivities />  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,  // Ensure the title is centered
  },
  icon: {
    width: 30,
    height: 30,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',  // This makes the badge position relative to the avatar
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  premiumBadge: {
    position: 'absolute',
    width: 36,
    height: 36,
    bottom: 0,
    right: 0,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  followConnectionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  followButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#333',
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  followButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  connectionsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  connectionsText: {
    fontSize: 14,
    color: '#777',
  },
  connectionsNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginVertical: 10,
  },
  tab: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  tabActiveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ProfileScreen;
