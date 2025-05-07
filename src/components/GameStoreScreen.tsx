import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { apiClient } from '../api/client';

const GameStoreScreen = () => {
  const navigation = useNavigation();
  const [games, setGames] = useState([]);
  const [gameDict, setGameDict] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      
      try {
        const response = await apiClient.get('/games/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        console.log("Games:", response.data); // Debugging line
        setGames(response.data);

        const gameDictionary = response.data.reduce((acc, game) => {
          acc[game.id] = game;
          return acc;
        }, {});
        setGameDict(gameDictionary);

      } catch (error) {
        console.error("Error fetching games:", error);
      }
    }

    fetchGames();
  }, []);

  const showDetails = (id: string) => {
    navigation.navigate("GameDetails", { game: gameDict[id] });
  }

  const renderHorizontalGame = ({ item }) => (
    <TouchableOpacity
      onPress={() => showDetails(item.id)}
      style={styles.horizontalGameContainer}
    >
      <Image source={{ uri: item.app_icon_url }} style={styles.horizontalGameImage} />
      <View style={styles.horizontalGameTextContainer}>
        <Text style={styles.horizontalGameName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.horizontalGameSummary} numberOfLines={2}>{item.short_description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderVerticalGame = ({ item }) => (
    <TouchableOpacity
      onPress={() => showDetails(item.id)}
      style={styles.verticalGameContainer}
    >
      <Image source={{ uri: item.app_icon_url }} style={styles.verticalGameImage} />
      <View style={styles.verticalGameTextContainer}>
        <Text style={styles.verticalGameName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.verticalGameSummary} numberOfLines={2}>{item.short_description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/icons/backi.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Game Store</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.sectionContainer, styles.nativeGamesSection]}>
          <Text style={styles.sectionTitle}>Native Games</Text>
          <FlatList
            data={games.filter(game => game.platforms.native)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderHorizontalGame}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContainer}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured Games</Text>
          <FlatList
            data={games.filter(game => game.status === 'LIVE')} // Assuming 'LIVE' status for featured
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderHorizontalGame}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContainer}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>All Games</Text>
          <FlatList
            data={games}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderVerticalGame}
            contentContainerStyle={styles.verticalListContainer}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.collectionsButton} onPress={() => navigation.navigate('Collections')}>
        <Text style={styles.collectionsButtonText}>Your Collections</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
    color: '#333',
  },
  horizontalListContainer: {
    paddingLeft: 16,
  },
  horizontalGameContainer: {
    width: 180,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  horizontalGameImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  horizontalGameTextContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  horizontalGameName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  horizontalGameSummary: {
    fontSize: 14,
    color: '#666',
  },
  verticalListContainer: {
    paddingHorizontal: 16,
  },
  verticalGameContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  verticalGameImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  verticalGameTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  verticalGameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  verticalGameSummary: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  collectionsButton: {
    backgroundColor: '#FFD700',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  collectionsButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nativeGamesSection: {
    backgroundColor: '#F0F8FF', // Light blue background for native games section
    paddingVertical: 16,
    marginTop: 0, // Remove top margin as we're adding padding
  },
});

export default GameStoreScreen; 