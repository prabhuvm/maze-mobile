import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../GlobalContext';
import { NativeModules } from 'react-native';
import GameInviteModal from './details/GameInviteModal';  // Import the InviteModal

const DetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { bot } = route.params;
  const {username} = useGlobalContext();
  const [botAdded, setBotAdded] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false); // State to show/hide modal

  useEffect(() => {
    const fetchCollections = async() => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await apiClient.get(`/users/${username}/agents/`,  
        { headers: { 
          Authorization: `Bearer ${accessToken}` 
       }})
        .then(response => {
          const botDictionary = response.data.reduce((acc, avatar) => {
            acc[avatar.id] = avatar;
            return acc;
          }, {});

          setBotAdded(bot.id in botDictionary);
        })
        .catch(error => {
          console.error('Error following:', error);
        });
    }
    fetchCollections();
  }, []);

  const openAppOrStore = async (appStoreId) => {
    const { AppLauncher } = NativeModules;
    await AppLauncher.launchApp(appStoreId)
      .then(() => console.log('App opened successfully'))
      .catch(err => console.log('Error opening app: ', err));
  };

  const gotToChat = () => {
    if (bot.is_native) {
      const gameDetails = {
        appId: bot.game_id,
        botId: bot.id,
        event: null // Pass the event ID to connect to the right game instance
      }
      navigation.navigate("GameScreen", gameDetails);
    } else {
      openAppOrStore(bot.deep_link_url);
    }
  };

  const addToCollection = async() => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.post(`/users/${username}/agents/`, {
        agent: bot.id
      }, { headers: { 
        Authorization: `Bearer ${accessToken}` 
     }})
      .then(() => setBotAdded(true))
      .catch(error => console.error('Error following:', error));
  };

  const removeFromCollection = async() => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.delete(`/users/${username}/agents/${bot.id}`, 
      { headers: { 
        Authorization: `Bearer ${accessToken}` 
     }})
      .then(() => setBotAdded(false))
      .catch(error => console.error('Error following:', error));
  };

  const openInviteModal = () => setInviteVisible(true);  // Function to show modal
  const closeInviteModal = () => setInviteVisible(false); // Function to hide modal

  return (
    <View style={styles.container}>
      <ScrollView>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require('../assets/icons/backi.png')} style={styles.icon} />
      </TouchableOpacity>
      <Image source={{ uri: bot.app_screenshot_url }} style={styles.botImage} />
      <Text style={styles.botName}>{bot.name}</Text>
      <Text style={styles.botDescription}>{bot.description}</Text>
      <View style={styles.buttonContainer}>
        {botAdded ? 
          (<TouchableOpacity style={styles.actionButton} onPress={removeFromCollection}>
              <Text style={styles.actionButtonText}>Remove from Collection</Text>
           </TouchableOpacity>) : 
          (<TouchableOpacity style={styles.actionButton} onPress={addToCollection}>
              <Text style={styles.actionButtonText}>Add to Collection</Text>
           </TouchableOpacity>)
        }

        <TouchableOpacity onPress={gotToChat} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Launch Application</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.specificationsTitle}>Specifications</Text>
      <View style={styles.specificationsContainer}>
        {/* Add your specifications here */}
      </View>
      </ScrollView>
      {/* Floating Bubble Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={openInviteModal}>
        <Image source={require('../assets/icons/plus.png')} style={styles.fabIcon} />
      </TouchableOpacity>

      {/* Invite Modal */}
      <GameInviteModal visible={inviteVisible} onClose={closeInviteModal} botId={bot.id} username={username} botName={bot.name}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
    padding: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  botImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  botName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  botDescription: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#000',
  },
  specificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  specificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    backgroundColor: '#333',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // To make sure it's above other elements
  },
  fabIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});

export default DetailsScreen;
