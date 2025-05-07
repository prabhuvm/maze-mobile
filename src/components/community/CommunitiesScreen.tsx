import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { apiClient } from '../../api/client'; // Assuming apiClient is configured to make API calls

const CommunitiesScreen = () => {
  const [activeTab, setActiveTab] = useState('Discover');
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Fetch Discover and My Communities on component mount
  useEffect(() => {
    fetchCommunities();
    fetchMyCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/communities/');  // Make sure your API endpoint is correct
      setCommunities(response.data); // Assume response.data contains an array of communities
    } catch (error) {
      setError('Failed to load communities.');
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCommunities = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/communities/');  // Endpoint for "My Communities"
      setMyCommunities(response.data);  // Assume response.data contains an array of user's communities
    } catch (error) {
      setError('Failed to load my communities.');
      console.error('Error fetching my communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCommunityItem = ({ item }) => (
    <View style={styles.communityItem}>
      <Image source={{ uri: item.image_url }} style={styles.communityImage} />
      <View style={styles.communityInfo}>
        <TouchableOpacity onPress={() => navigation.navigate('CommunityDetails')}>
          <Text style={styles.communityName}>{item.name}</Text>
        </TouchableOpacity>
        <Text style={styles.communityMembers}>{item.members}</Text>
        <Text style={styles.communityDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const renderMyCommunityItem = ({ item }) => (
    <View style={styles.myCommunityItem}>
      <Image source={{ uri: item.image_url }} style={styles.communityImage} />
      <View style={styles.communityInfo}>
        <TouchableOpacity onPress={() => navigation.navigate('CommunityDetails')}>
          <Text style={styles.communityName}>{item.name}</Text>
        </TouchableOpacity>
        <Text style={styles.communityDescription}>{item.description}</Text>
        <View style={styles.communityActions}>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.inviteButtonText}>Invite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Communities</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for communities"
          placeholderTextColor="#888"
        />
      </View>

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
      </View>

      {activeTab === 'Discover' && (
        <>
          <Text style={styles.sectionTitle}>Featured Communities</Text>
          <FlatList
            data={communities}  // Display the first 3 as "Featured"
            renderItem={renderCommunityItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <Text style={styles.sectionTitle}>Recommended Communities</Text>
          <FlatList
            data={communities}  // Display the rest as "Recommended"
            renderItem={renderCommunityItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
      )}

      {activeTab === 'My Communities' && (
        <FlatList
          data={myCommunities}
          renderItem={renderMyCommunityItem}
          keyExtractor={(item) => item.id.toString()}
        />
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
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
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
    color: '#000',
  },
  communityItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff',
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
    color: '#000',
    marginBottom: 5,
  },
  communityMembers: {
    fontSize: 14,
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
  inviteButton: {
    backgroundColor: '#888',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  inviteButtonText: {
    color: '#FFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default CommunitiesScreen;
