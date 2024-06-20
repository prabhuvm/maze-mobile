import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGlobalContext } from '../GlobalContext';
import { User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserListProps {
  people: User[];
}

const UserList: React.FC<UserListProps> = ({people}) => {
    const {username} = useGlobalContext();
    const[followDetails, setFollowDetails] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
      console.log("Updating is_following ", people);
      people.forEach(function (item, index) {
        console.log("Updating is_following ", item, " ", item.username);
        updateField(item.username);
      });
    }, [people]);

    const handleFollow = async(item) => {
      console.log("Calling follow with ", item)
      const accessToken = await AsyncStorage.getItem('accessToken');
      apiClient.post(`/users/${username}/follow/`, {
          username:item.username    
        }, { headers: { 
          Authorization: `Bearer ${accessToken}` 
        } })
        .then(response => {
          if (response.status === 200) {
            updateField(item.username);
          }
        })
        .catch(error => {
          console.error('Error following:', error);
        });
    }
  
    const updateField = async(fusername) => {
      console.log("Is following request for : ", username, " -> ", fusername)
      const accessToken = await AsyncStorage.getItem('accessToken');
      apiClient.post(`/users/${username}/is-following/`, {
        username:fusername    
      }, { headers: { 
        Authorization: `Bearer ${accessToken}` 
      } })
      .then(response => {
        console.log("Is following response: ", response.data)
        if (response.status === 200) {
          setFollowDetails(prevDetails => ({
            ...prevDetails,
            [fusername]: response.data.result
          }));
        }
      })
      .catch(error => {
        console.error('Error following:', error);
      });
    };

    const handleUserPress = (fusername) => {
      console.log("Navigating to ", fusername);
      navigation.navigate('Profile', {profileUsername: fusername})
    }

    const renderPerson = ({ item }) => (
        <View style={styles.itemContainer}>
          <Image source={/*{ uri: item.image } */ require('../assets/images/human.jpeg')} style={styles.avatar} />
          <View style={styles.itemTextContainer}>
          <TouchableOpacity onPress={() => handleUserPress(item.username)}>
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity> 
            <Text style={styles.itemUsername}>@{item.username}</Text>
          </View>
          {item.username in followDetails && followDetails[item.username] 
          ? <TouchableOpacity style={styles.button} onPress={() => handleFollow(item)}>
              <Text style={styles.addButtonText}>Following</Text>
            </TouchableOpacity> 
          : <TouchableOpacity style={styles.button} onPress={() => handleFollow(item)}>
              <Text style={styles.addButtonText}>Follow</Text>
            </TouchableOpacity>  }
        </View>
      );
  
    return (
      <FlatList
      data={people}
      keyExtractor={(item) => item.id}
      renderItem={renderPerson}
      contentContainerStyle={styles.listContainer}
    />
    );
  };

  const styles = StyleSheet.create({
    listContainer: {
      paddingBottom: 20,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    button: {
      backgroundColor: '#E0E0E0',
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 15,
    },
    addButtonText: {
      fontSize: 16,
      color: '#000',
    },
    itemTextContainer: {
      flex: 1,
      alignItems : 'center',
    },
    itemName: {
      paddingTop: 16,
      fontSize: 16,
      fontWeight: 'bold',
    },
    itemUsername: { // Added new style for username
      fontSize: 14,
      color: '#555',
    },
    itemProfile: {
      fontSize: 14,
      color: '#777',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
  });

  export default UserList;