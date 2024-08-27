import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, TextInput } from 'react-native';

const communities = [
  {
    id: '1',
    name: 'World of Warcraft',
    members: '325K members',
    description: 'Explore the worlds of World of Warcraft, and join a community of players from around the world.',
    image: require('../assets/images/com-images/wow.png'),
  },
  {
    id: '2',
    name: 'League of Legends',
    members: '125K members',
    description: 'Join the League of Legends community and discuss the latest updates and events.',
    image: require('../assets/images/com-images/lol.png'),
  },
  {
    id: '3',
    name: 'Fortnite',
    members: '230K members',
    description: 'Connect with other Fortnite fans and stay updated on the latest news.',
    image: require('../assets/images/com-images/fortnite.png'),
  },
  {
    id: '4',
    name: 'Minecraft',
    members: '150K members',
    description: 'Discuss the latest updates, share your creations, and make friends in the Minecraft community.',
    image: require('../assets/images/com-images/minecraft.png'),
  },
  {
    id: '5',
    name: 'Call of Duty',
    members: '90K members',
    description: 'Stay updated on the latest Call of Duty news and connect with other players.',
    image: require('../assets/images/com-images/cod.png'),
  },
];

const MyCommunities = [
  {
    id: '1',
    name: 'Fortnite Fans',
    description: 'Welcome to the Fortnite community! Join us to find teammates, share your best plays, and get the latest game updates.',
    image: require('../assets/images/com-images/fortnite.png'),
  },
  {
    id: '2',
    name: 'Minecraft Masters',
    description: 'Join the Minecraft community! Share your builds, make friends, and learn new tips and tricks.',
    image: require('../assets/images/com-images/minecraft.png'),
  },
];

const CommunitiesScreen = () => {
  const [activeTab, setActiveTab] = useState('Discover');

  const renderCommunityItem = ({ item }) => (
    <View style={styles.communityItem}>
      <Image source={item.image} style={styles.communityImage} />
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>{item.name}</Text>
        <Text style={styles.communityMembers}>{item.members}</Text>
        <Text style={styles.communityDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const renderMyCommunityItem = ({ item }) => (
    <View style={styles.myCommunityItem}>
      <Image source={item.image} style={styles.communityImage} />
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>{item.name}</Text>
        <Text style={styles.communityDescription}>{item.description}</Text>
        <View style={styles.communityActions}>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>Invite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Communities</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for communities"
        placeholderTextColor="#888"
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Discover' && styles.activeTab]}
          onPress={() => setActiveTab('Discover')}
        >
          <Text style={[styles.tabText, activeTab === 'Discover' && styles.activeTabText]}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'My Communities' && styles.activeTab]}
          onPress={() => setActiveTab('My Communities')}
        >
          <Text style={[styles.tabText, activeTab === 'My Communities' && styles.activeTabText]}>My Communities</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Create' && styles.activeTab]}
          onPress={() => setActiveTab('Create')}
        >
          <Text style={[styles.tabText, activeTab === 'Create' && styles.activeTabText]}>Create</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Discover' && (
        <>
          <Text style={styles.sectionTitle}>Featured Communities</Text>
          <FlatList
            data={communities.slice(0, 3)}
            renderItem={renderCommunityItem}
            keyExtractor={(item) => item.id}
          />
          <Text style={styles.sectionTitle}>Recommended Communities</Text>
          <FlatList
            data={communities.slice(3)}
            renderItem={renderCommunityItem}
            keyExtractor={(item) => item.id}
          />
        </>
      )}

      {activeTab === 'My Communities' && (
        <FlatList
          data={MyCommunities}
          renderItem={renderMyCommunityItem}
          keyExtractor={(item) => item.id}
        />
      )}

      {activeTab === 'Create' && (
        <View style={styles.createContainer}>
          <Text style={styles.createText}>Create a new community!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  searchInput: {
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  communityItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  communityImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  communityMembers: {
    color: '#888',
    marginBottom: 5,
  },
  communityDescription: {
    fontSize: 14,
    color: '#666',
  },
  myCommunityItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  communityActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  joinButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  joinButtonText: {
    color: '#FFF',
  },
  inviteButton: {
    backgroundColor: '#888',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  inviteButtonText: {
    color: '#FFF',
  },
  createContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createText: {
    fontSize: 18,
    color: '#888',
  },
});

export default CommunitiesScreen;
