import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../GlobalContext';
import { NativeModules } from 'react-native';

const GameDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { game } = route.params;
  const { username } = useGlobalContext();
  const [gameAdded, setGameAdded] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await apiClient.get(`/users/${username}/games/`,  
        { headers: { 
          Authorization: `Bearer ${accessToken}` 
       }})
        .then(response => {
          const gameDictionary = response.data.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {});

          setGameAdded(game.id in gameDictionary);
        })
        .catch(error => {
          console.error('Error fetching games:', error);
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

  const goToGame = () => {
    if (game.platforms.native) {
      const gameDetails = {
        appId: game.game_id,
        gameId: game.id,
        event: null // Pass the event ID to connect to the right game instance
      }
      console.log('Route params #### >>>>> ', gameDetails);
      navigation.navigate("GameScreen", gameDetails);
    } else {
      openAppOrStore(game.native_app_file);
    }
  };

  const addToCollection = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.post(`/users/${username}/games/`, {
        game: game.id
      }, { headers: { 
        Authorization: `Bearer ${accessToken}` 
     }})
      .then(() => setGameAdded(true))
      .catch(error => console.error('Error adding game:', error));
  };

  const removeFromCollection = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.delete(`/users/${username}/games/${game.id}`, 
      { headers: { 
        Authorization: `Bearer ${accessToken}` 
     }})
      .then(() => setGameAdded(false))
      .catch(error => console.error('Error removing game:', error));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/backi.png')} style={styles.icon} />
        </TouchableOpacity>
        <Image source={{ uri: game.background_image_url }} style={styles.gameImage} />
        <Text style={styles.gameName}>{game.name}</Text>
        <Text style={styles.gameDescription}>{game.detailed_description}</Text>
        <View style={styles.buttonContainer}>
          {gameAdded ? 
            (<TouchableOpacity style={styles.actionButton} onPress={removeFromCollection}>
                <Text style={styles.actionButtonText}>Remove from Collection</Text>
             </TouchableOpacity>) : 
            (<TouchableOpacity style={styles.actionButton} onPress={addToCollection}>
                <Text style={styles.actionButtonText}>Add to Collection</Text>
             </TouchableOpacity>)
          }

          <TouchableOpacity onPress={goToGame} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Launch Game</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.specificationsTitle}>Specifications</Text>
        <View style={styles.specificationsContainer}>
          <Text style={styles.specificationItem}>Age Rating: <Text style={styles.specificationValue}>{game.age_rating}</Text></Text>
          <Text style={styles.specificationItem}>Price Type: <Text style={styles.specificationValue}>{game.price_type}</Text></Text>
          <Text style={styles.specificationItem}>Developer: <Text style={styles.specificationValue}>{game.organization}</Text></Text>
          <Text style={styles.specificationItem}>Support Email: <Text style={styles.specificationValue}>{game.support_email}</Text></Text>
          <Text style={styles.specificationItem}>Categories: <Text style={styles.specificationValue}>{game.categories.join(', ')}</Text></Text>
          <Text style={styles.specificationItem}>Platforms: <Text style={styles.specificationValue}>{Object.keys(game.platforms).filter(platform => game.platforms[platform]).join(', ')}</Text></Text>
        </View>
      </ScrollView>
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
  gameImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  gameName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  gameDescription: {
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
    marginTop: 20,
    marginBottom: 10,
    color: '#666',
  },
  specificationsContainer: {
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 20,
  },
  specificationItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  specificationValue: {
    fontWeight: 'normal',
    color: '#555',
  },
});

export default GameDetailsScreen; 