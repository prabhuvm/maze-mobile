import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
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

  const renderHorizontalBot = ({ item, section }) => (
    <TouchableOpacity 
      onPress={() => showDetails(item.id)} 
      style={[
        styles.horizontalBotContainer
      ]}
    >
      <Image source={{ uri: item.app_screenshot_url }} style={styles.horizontalBotImage} />
      <View style={styles.horizontalBotTextContainer}>
        <Text style={styles.horizontalBotName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.horizontalBotSummary} numberOfLines={2}>{item.summary}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderVerticalBot = ({ item }) => (
    <TouchableOpacity
      onPress={() => showDetails(item.id)}
      style={styles.verticalBotContainer}
    >
      <Image source={{ uri: item.app_screenshot_url }} style={styles.verticalBotImage} />
      <View style={styles.verticalBotTextContainer}>
        <Text style={styles.verticalBotName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.verticalBotSummary} numberOfLines={2}>{item.summary}</Text>
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
            data={bots}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderHorizontalBot({ item, section: 'native' })}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContainer}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured Games</Text>
          <FlatList
            data={bots}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderHorizontalBot({ item, section: 'featured' })}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContainer}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>All Games</Text>
          <FlatList
            data={bots}
            keyExtractor={(item) => item.id}
            renderItem={renderVerticalBot}
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
  horizontalBotContainer: {
    width: 180,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  horizontalBotImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  horizontalBotTextContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  horizontalBotName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  horizontalBotSummary: {
    fontSize: 14,
    color: '#666',
  },
  verticalListContainer: {
    paddingHorizontal: 16,
  },
  verticalBotContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  verticalBotImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  verticalBotTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  verticalBotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  verticalBotSummary: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  detailsButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
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

export default StoreScreen;
