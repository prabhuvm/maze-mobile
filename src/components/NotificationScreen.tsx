import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const notificationsToday = [
  {
    id: '1',
    title: 'New device login',
    description: 'From: Windows 1m',
    time: '1m',
    icon: require('../assets/test/bot-drphil.png'), // Placeholder for device login icon
  },
];

const notificationsPrevious = [
  {
    id: '1',
    title: 'LIVE: Cooper is live!',
    description: 'By: @cooper | 9w',
    time: '9w',
    icon: require('../assets/test/bot-elonmusk.png'), // Placeholder for live icon
  },
  {
    id: '2',
    title: 'Profile views',
    description: 'Views: 3 | 15w',
    time: '15w',
    icon: require('../assets/test/bot-taylorswift.png'), // Placeholder for profile views icon
  },
];

const suggestedPeople = [
  {
    id: '1',
    name: 'Sarah Berstein',
    handle: '@sarah | Follow',
    avatar: require('../assets/test/avatar-alyssa.png'),
  },
  {
    id: '2',
    name: 'Kendal Vashisht',
    handle: '@kendal | Follow',
    avatar: require('../assets/test/avatar-irene.png'),
  },
];

const NotificationScreen = () => {
    const navigation = useNavigation();
    useEffect(() => {
      const getNotifications = async () => { 
        const accessToken = AsyncStorage.getItem("accessToken");
      const response1 = await apiClient.get(`/notifications/`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );}
    getNotifications();
    }) 
  const renderNotification = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Image source={item.icon} style={styles.notificationIcon} />
      <View style={styles.notificationTextContainer}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
      </View>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

  const renderSuggestedPerson = ({ item }) => (
    <View style={styles.personContainer}>
      <Image source={item.avatar} style={styles.personAvatar} />
      <View style={styles.personTextContainer}>
        <Text style={styles.personName}>{item.name}</Text>
        <Text style={styles.personHandle}>{item.handle}</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
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
        <Text style={styles.sectionTitle}>Today</Text>
        <FlatList
          data={notificationsToday}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          horizontal={false}
        />
        <Text style={styles.sectionTitle}>Previous</Text>
        <FlatList
          data={notificationsPrevious}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          horizontal={false}
        />
        <Text style={styles.sectionTitle}>Suggested people to follow</Text>
        <FlatList
          data={suggestedPeople}
          keyExtractor={(item) => item.id}
          renderItem={renderSuggestedPerson}
          horizontal={false}
        />
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
