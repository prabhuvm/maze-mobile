import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';

const StoreScreen = () => {
  const navigation = useNavigation();
  const [bots, setBots] = useState([]);
  const [botDict, setBotDict] = useState({});
  const {username} = useGlobalContext();

  useEffect(() => {
    const avatarAgents = async() => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await apiClient.get('/avatars/agents/', { 
        headers: { 
          Authorization: `Bearer ${accessToken}` 
        }
      }).then(response => {
          console.log("Avatar Agents:", response.data); // Debugging line
          setBots(response.data);
  
          const botDictionary = response.data.reduce((acc, avatar) => {
            acc[avatar.id] = avatar;
            return acc;
          }, {});
          setBotDict(botDictionary); // Update avatarDict state
        })
        .catch(error => console.error(error));
    }

    avatarAgents();
  }, []);

  const showDetails = (id : string) => {
    navigation.navigate("Details", {bot : botDict[id]});
  }

  const renderBot = ({ item }) => (
    <View style={styles.botContainer}>
      <TouchableOpacity onPress={() => showDetails(item.id)}>
        <Image source={{ uri: item.app_screenshot_url }} style={styles.botImage} />
      </TouchableOpacity>
      
      <View style={styles.botDetails}>
        <TouchableOpacity onPress={() => showDetails(item.id)}>
          <Text style={styles.botName}>{item.name}</Text>
        </TouchableOpacity> 
        <Text style={styles.botDescription}>{item.summary}</Text>
        <View style={styles.priceAndButtonContainer}>
          {/* <Text style={styles.botPrice}>{item.price}</Text> */}
          <TouchableOpacity style={styles.addButton} onPress={() => showDetails(item.id)} >
            <Text style={styles.addButtonText}>Show Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/backi.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>AI Bot Collections</Text>
      </View>

      <FlatList
        data={bots}
        keyExtractor={(item) => item.id}
        renderItem={renderBot}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.downloadAllButton} onPress={() => navigation.navigate('Collections')}>
        <Text style={styles.downloadAllButtonText}>Your Collections</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginLeft: 20,
    width: 30,
    height: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    marginLeft: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  botContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
  },
  botImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  botDetails: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  botName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  botDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  priceAndButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botPrice: {
    fontSize: 14,
    color: '#777',
  },
  addButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 16,
    color: '#000',
  },
  downloadAllButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  downloadAllButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default StoreScreen;
