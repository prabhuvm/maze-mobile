import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../GlobalContext';
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const {username:loginUsername} = useGlobalContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [curUser, setCurUser] = useState(false);
  const [followed, setFollowed] = useState(false);
  const route = useRoute();
  const [profileUsername, setProfileUsername] = useState(route.params?.profileUsername || loginUsername);

  useEffect(() => {
    setDescription('');
    setName('');
    setProfilePic(null)
    fetchUserDetails();
    fetchProfilePic();
    checkFollowed(profileUsername);
    setCurUser(loginUsername === profileUsername)
  }, [profileUsername])

  useFocusEffect(
    React.useCallback(() => {
      // Check if the screen is focused and if the profileUsername needs to be updated
      console.log("######## Route params: ", route.params);
      const newProfileUsername = route.params?.profileUsername;
      console.log("######## Params - newProfile: ", newProfileUsername, " profile:", profileUsername,
        ' status: ', newProfileUsername && newProfileUsername !== profileUsername
      );
      if (newProfileUsername && newProfileUsername !== profileUsername) {
        setProfileUsername(newProfileUsername);
      } else if (!newProfileUsername) {
        // If no newProfileUsername, default to loginUsername
        setProfileUsername(loginUsername);
      }

      console.log("######## Final - profile: ", profileUsername, " login: ", loginUsername);

      return () => {
        // This runs when the screen goes out of focus
        navigation.setParams({
          profileUsername: undefined,
        });
        console.log('Params cleared on defocus');
      };
    }, [route.params?.profileUsername, loginUsername, navigation])
  );

  const fetchUserDetails = async () => {
    try {
      console.log("Fetching User Details for: ", profileUsername);
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.get(`/users/${profileUsername}/`, 
      { headers: { 
        Authorization: `Bearer ${accessToken}` 
    } });
      setName(response.data.name);
      setDescription(response.data.description);
    } catch (error) {
      console.error('Failed to fetch user details', error);
    }
  };

  const handleFollow = async (fusername) => {
    if(!followed) {
    console.log("Calling follow with ", fusername)
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.post(`/users/${loginUsername}/follow/`, {
        username:fusername
      }, { headers: { 
        Authorization: `Bearer ${accessToken}` 
     }})
      .then(response => {
        if (response.status === 200) {
          setFollowed(true);
        }
      })
      .catch(error => {
        console.error('Error following:', error);
      });
    } else {
      console.log("Already followed");
    }
  }

  const checkFollowed = async (fusername) => {
    console.log("Is following request for : ", loginUsername, " -> ", fusername)
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.post(`/users/${loginUsername}/is-following/`, {
      username:fusername    
    },{ headers: { 
      Authorization: `Bearer ${accessToken}` 
   }})
    .then(response => {
      console.log("Is following response: ", response.data)
      if (response.status === 200) {
        setFollowed( response.data.result);
      }
    })
    .catch(error => {
      console.error('Error following:', error);
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
        console.log("Profile pic for user: ", response.data.url);
      setProfilePic({ uri: response.data.url });
    } catch (error) {
      console.error('Failed to fetch profile picture', error);
    }
  };

  const posts = [
    { id: '1', image: '../assets/images/robot.gif' },
    { id: '2', image: '../assets/images/robot.gif' },
    { id: '3', image: '../assets/images/robot.gif' },
    { id: '4', image: '../assets/images/robot.gif' },
    { id: '5', image: '../assets/images/robot.gif' },
    { id: '6', image: '../assets/images/robot.gif' },
  ];

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/backi.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>@{profileUsername}</Text>
        {curUser ? <Text></Text> : <TouchableOpacity onPress={() => navigation.navigate('Message', {fusername:profileUsername})}>
          <Image source={require('../assets/icons/message.png')} style={styles.icon} />
        </TouchableOpacity>}
        
      </View>
      <View style={styles.profileContainer}>
        <Image source={profilePic || require('../assets/images/human.jpeg')} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.followConnectionsContainer}>
        { curUser ? <TouchableOpacity style={styles.followButton} onPress={() => navigation.navigate('Update Profile')}>
          <Text style={styles.followButtonText}>Edit Profile</Text>
          </TouchableOpacity> 
        : <TouchableOpacity style={styles.followButton} onPress={() => handleFollow(profileUsername)}>
        <Text style={styles.followButtonText}>{followed? 'Following': 'Follow'}</Text>
        </TouchableOpacity> 
        
        }
        <TouchableOpacity style={styles.connectionsContainer} onPress={
          () => navigation.navigate('Connections', {fusername:profileUsername})}>
          <Text style={styles.connectionsNumber}>120K</Text>
          <Text style={styles.connectionsText}>Connections</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        <Text style={styles.tabActive}>Posts</Text>
        <Text style={styles.tab}>Mentions</Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
        contentContainerStyle={styles.postsContainer}
      />
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
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#000',
  },
  icon: {
    width: 30,
    height: 30,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
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
    fontSize: 16,
    padding: 10,
    color: '#888',
  },
  tabActive: {
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  postsContainer: {
    paddingHorizontal: 10,
  },
  postImage: {
    width: '48%',
    height: 150,
    margin: '1%',
  },
});

export default ProfileScreen;
