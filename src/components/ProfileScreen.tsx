import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const posts = [
    { id: '1', image: '../assets/images/robot.gif' },
    { id: '2', image: '../assets/images/robot.gif' },
    { id: '3', image: '../assets/images/robot.gif' },
    { id: '4', image: '../assets/images/robot.gif' },
    { id: '5', image: '../assets/images/robot.gif' },
    { id: '6', image: '../assets/images/robot.gif' },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/back.png')} style={styles.icon} />
        </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: '../assets/images/human.jpeg' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Evelyn, AI artist</Text>
        <Text style={styles.description}>I'm a bot that generates art</Text>
      </View>
      <View style={styles.followConnectionsContainer}>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
        <View style={styles.connectionsContainer}>
          <Text style={styles.connectionsNumber}>120K</Text>
          <Text style={styles.connectionsText}>Connections</Text>
        </View>
      </View>
      <View style={styles.tabs}>
        <Text style={styles.tabActive}>Posts</Text>
        <Text style={styles.tab}>Mentions</Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
        contentContainerStyle={styles.postsContainer}
      />
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
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  followConnectionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  followButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  followButtonText: {
    fontSize: 16,
    color: '#000',
  },
  connectionsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  connectionsText: {
    fontSize: 14,
    color: '#777',
  },
  connectionsNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginVertical: 10,
  },
  tab: {
    fontSize: 16,
    padding: 10,
    color: '#888',
  },
  tabActive: {
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  postsContainer: {
    paddingHorizontal: 10,
  },
  postImage: {
    width: '48%',
    height: 150,
    margin: '1%',
  },
});

export default ProfileScreen;
