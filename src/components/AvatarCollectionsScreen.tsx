import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';




const CollectionsScreen = () => {
  const navigation = useNavigation();
  const [agents, setAgents] = useState([]);
  const [botDict, setBotDict] = useState({});
  const {username} = useGlobalContext();


  const showDetails = (id : string) => {
    navigation.navigate("Details", {bot : botDict[id]});
  }

  const gotToChat = (item) => {
    const gameDetails = {
      appId : item.game_id, 
      botId: item.id, 
      event: null
    }
    navigation.navigate("GameScreen", gameDetails);

  }

  const AgentItem = ({ item }) => (
    <View style={styles.avatarContainer}>
      <View style={styles.avatarImageWrapper}>
      <TouchableOpacity onPress={() => showDetails(item.id)}>
        <Image source={{ uri: item.app_screenshot_url }} style={styles.avatarImage} />
        </TouchableOpacity> 
        <View style={styles.usernameOverlay}>
          <Text style={styles.avatarUsername}>{item.name}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton} onPress={() => gotToChat(item)}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    const fetchCollections = async() => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await apiClient.get(`/users/${username}/agents/`,  
        { headers: { 
          Authorization: `Bearer ${accessToken}` 
       }})
        .then(response => {
          console.log("Agents recieved: ", response.data);
          setAgents(response.data);

          const botDictionary = response.data.reduce((acc, avatar) => {
            acc[avatar.id] = avatar;
            return acc;
          }, {});
          setBotDict(botDictionary); // Update avatarDict state

        })
        .catch(error => {
          console.error('Error following:', error);
        });
    }
    fetchCollections();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>My Collections</Text>
        <TouchableOpacity>
          <Image source={require('../assets/icons/search.png')} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {agents.map((agent) => (
          <AgentItem key={agent.id} item={agent} />
        ))}
      </ScrollView>
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={navigation.goBack}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
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
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  scrollView: {
    paddingHorizontal: 10,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarImageWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  usernameOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  avatarUsername: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  addButtonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  chatButtonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButtonContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  closeButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CollectionsScreen;
