import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { apiClient } from '../api/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGlobalContext } from '../GlobalContext';
import UserList from './UserList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [keywords, setKeywords] = useState(route.params?.keywords || '');
  const [people, setPeople] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [peoplePage, setPeoplePage] = useState(1);
  const [avatarsPage, setAvatarsPage] = useState(1);
  const {username} = useGlobalContext();
  const[followDetails, setFollowDetails] = useState({});

  useEffect(() => {
    fetchPeople();
    fetchAvatars();
  }, []);

  useEffect(() => {
    if (route.params) {
      setKeywords(route.params.keywords || '');
    }
  }, [route.params]);

  const handleSearch = () => {
    //calling again to sync with go press
    fetchPeople();
    fetchAvatars();
  };

  const fetchPeople = async (page = 1) => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    await apiClient.get(`/users/search/`, 
    { 
      params: { keywords, page }, 
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

  const fetchAvatars = async (page = 1) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.get(`/avatars/search/`, { 
      params: { keywords, page }, 
      headers: { 
        Authorization: `Bearer ${accessToken}` 
      }
    })
      .then(response => {
        if (page === 1) {
          setAvatars(response.data);
        } else {
          setAvatars([...avatars, ...response.data]);
        }
      })
      .catch(error => console.error('Error fetching avatars:', error));
  };

  const renderAvatar = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={/*{ uri: item.image } */ require('../assets/images/robot.gif')} style={styles.avatar} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemProfile}>{item.profile}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={keywords}
          onChangeText={setKeywords}
        />
        <TouchableOpacity style={styles.goButton} onPress={handleSearch}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>People</Text>

      <UserList
      people={people}/>
      
      <Text style={styles.sectionTitle}>Avatars</Text>
      <FlatList
        data={avatars}
        keyExtractor={(item) => item.id}
        renderItem={renderAvatar}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  goButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  goButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
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
  itemProfile: {
    fontSize: 14,
    color: '#777',
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
});

export default SearchScreen;
