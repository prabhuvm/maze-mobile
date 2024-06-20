import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';
import UserList from './UserList';
import { se } from 'date-fns/locale/se';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ConnectionsPage = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('followers');
  const [people, setPeople] = useState([]);
  const {username} = useGlobalContext();
  const route = useRoute();

  const {fusername} = route.params

  useEffect(() => {
    console.log("Rendering connections for ", fusername, " in ", selectedTab);
    fetchPeople(selectedTab);
  }, [selectedTab]);

  const fetchPeople = async (query, page = 1) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.get(`/users/${fusername}/${query}/`, { 
      headers: { 
        Authorization: `Bearer ${accessToken}` 
      } 
    })
      .then(response => {
        console.log("Search results: ", response.data);
        if (page === 1) {
          setPeople(response.data);
        } else {
          setPeople([...people, ...response.data]);
        }
      })
      .catch(error => console.error('Error fetching people:', error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Connections</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab('followers')} style={[styles.tab, selectedTab === 'followers' && styles.activeTab]}>
          <Text style={[styles.tabText, selectedTab === 'followers' && styles.activeTabText]}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('following')} style={[styles.tab, selectedTab === 'following' && styles.activeTab]}>
          <Text style={[styles.tabText, selectedTab === 'following' && styles.activeTabText]}>Following</Text>
        </TouchableOpacity>
      </View>

      <UserList
        people={people}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    fontSize: 18,
    color: '#000',
  },
  settingsIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tab: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
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

export default ConnectionsPage;
