import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../GlobalContext';
import UserList from './UserList';
import { Notification } from '../types';

const notificationsToday = [
  {
    id: '1',
    title: 'New device login',
    description: 'From: Windows 1m',
    time: '1m',
    icon: require('../assets/test/bot-drphil.png'), // Placeholder for device login icon
  },
];

const NotificationScreen = () => {
    const navigation = useNavigation();
    const [suggestedPeople, setSuggestedPeople] = useState([]);
    const[notificationsPrevious, setNotificationsPrevious] = useState<Notification[]>([]);
    const {username, notifications, setNotifications} = useGlobalContext();
    
    useEffect(() => {
      getSuggestedPeople();
      getNotifications();
    }, [])
    
    const getSuggestedPeople = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await apiClient.get(`/users/suggestions/`, 
      { 
        headers: { 
          Authorization: `Bearer ${accessToken}` 
        } 
      }).then(response => {
        console.log("People suggestions: ", response.data);
        setSuggestedPeople(response.data);
      })
      .catch(error => console.error('Error fetching people:', error));
    };



  const getNotifications = async () => { 
        const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await apiClient.get(`/notifications/`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    setNotifications(response.data.notifications);
    setNotificationsPrevious(response.data.notificationsPrevious);
    console.log("############# Notifications recieved: ", response.data)
  }
  

  const renderNotification = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Image source={item.icon ? { uri: item.icon } : require('../assets/images/human.jpeg')} style={styles.notificationIcon} />
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.body}</Text>
      </View>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/backi.png')} style={styles.headerIcon} />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>All Activity</Text>
        </View>
        { notifications.length > 0 && <Text style={styles.sectionTitle}>Recent</Text> }
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          horizontal={false}
        />
        { notificationsPrevious.length > 0 && <Text style={styles.sectionTitle}>Previous</Text> }
        <FlatList
          data={notificationsPrevious}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          horizontal={false}
        />
        <Text style={styles.sectionTitle}>Suggested people to follow</Text>
        <UserList
          people={suggestedPeople}/>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
    marginLeft: 5,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#888',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  personContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  personAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  personTextContainer: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  personHandle: {
    fontSize: 14,
    color: '#888',
  },
  followButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  followButtonText: {
    fontSize: 14,
    color: '#000',
  },
});

export default NotificationScreen;
