import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';

const bots = [
  { id: '1', name: 'Art Bot', description: 'Create art with AI', price: 'Free', image: 'path-to-art-bot-image' },
  { id: '2', name: 'Music Bot', description: 'Create music with AI', price: 'Free', image: 'path-to-music-bot-image' },
  { id: '3', name: 'Video Bot', description: 'Create videos with AI', price: 'Free', image: 'path-to-video-bot-image' },
  { id: '4', name: 'T-Shirt Bot', description: 'Create t-shirt designs with AI', price: 'Free', image: 'path-to-tshirt-bot-image' },
  { id: '5', name: 'Logo Bot', description: 'Create logos with AI', price: 'Free', image: 'path-to-logo-bot-image' },
  { id: '6', name: 'Book Cover Bot', description: 'Create book covers with AI', price: 'Free', image: 'path-to-bookcover-bot-image' },
];

const params = [
  {
    name: 'Space Explorer',
    description: 'A bot designed to provide users with the latest news and updates on all things space.',
    image: 'https://example.com/path-to-space-explorer-image.jpg', // Replace with a valid image URL
    showStartChat: true, // Set to false if "Start Chat" button should not be displayed
    specifications: ['Astronomy', 'Telescope', 'Spacecraft', 'Exoplanets', 'Galaxies']
  },
  {
    name: 'Space Explorer',
    description: 'A bot designed to provide users with the latest news and updates on all things space.',
    image: 'https://example.com/path-to-space-explorer-image.jpg', // Replace with a valid image URL
    showStartChat: false, // Set to false if "Start Chat" button should not be displayed
    specifications: ['Astronomy', 'Telescope', 'Spacecraft', 'Exoplanets', 'Galaxies']
  }
]


const StoreScreen = () => {
  const navigation = useNavigation();

  const showDetails = (id : string) => {
    const idx = +id % 2;
    navigation.navigate("Details", {bot : params[idx]});
  }
  const renderBot = ({ item }) => (
    <View style={styles.botContainer}>
      <TouchableOpacity onPress={() => showDetails(item.id)}>
        <Image source={{ uri: item.image }} style={styles.botImage} />
      </TouchableOpacity>
      
      <View style={styles.botDetails}>
        <TouchableOpacity onPress={() => showDetails(item.id)}>
          <Text style={styles.botName}>{item.name}</Text>
        </TouchableOpacity> 
        <Text style={styles.botDescription}>{item.description}</Text>
        <View style={styles.priceAndButtonContainer}>
          <Text style={styles.botPrice}>{item.price}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/back.png')} style={styles.icon} />
        </TouchableOpacity>
      <Text style={styles.title}>AI Bot Collections</Text>
      <FlatList
        data={bots}
        keyExtractor={(item) => item.id}
        renderItem={renderBot}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.downloadAllButton}>
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
  icon: {
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
