import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { apiClient } from '../../api/client'; // Assuming apiClient is set up to make API requests

const CommunityDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('Updates'); // Toggle between Updates and Events
  const [updates, setUpdates] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch updates (posts) and events when the component mounts
  useEffect(() => {
    if (activeTab === 'Updates') {
      fetchUpdates();
    } else {
      fetchEvents();
    }
  }, [activeTab]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/communities/posts/');
      setUpdates(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load updates');
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/communities/events/');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load events');
      setLoading(false);
    }
  };

  const renderUpdateItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>by {item.author} · {item.time}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const renderEventItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.date_range}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/com-images/wow.png')} style={styles.communityImage} />
        <View style={styles.communityInfo}>
          <Text style={styles.communityTitle}>Call of Duty Mobile</Text>
          <Text style={styles.communityMembers}>3.5K members</Text>
          <Text style={styles.communityFollowers}>Followed by 1.2K</Text>
        </View>
      </View>

      {/* Follow & Message Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.buttonText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Updates' && styles.activeTab]}
          onPress={() => setActiveTab('Updates')}
        >
          <Text style={[styles.tabText, activeTab === 'Updates' && styles.activeTabText]}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Events' && styles.activeTab]}
          onPress={() => setActiveTab('Events')}
        >
          <Text style={[styles.tabText, activeTab === 'Events' && styles.activeTabText]}>Events</Text>
        </TouchableOpacity>
      </View>

      {/* Handle Loading State */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        /* Content based on active tab */
        activeTab === 'Updates' ? (
          <FlatList
            data={updates}
            renderItem={renderUpdateItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <FlatList
            data={events}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  communityImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  communityInfo: {
    flex: 1,
  },
  communityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  communityMembers: {
    fontSize: 16,
    color: '#777',
  },
  communityFollowers: {
    fontSize: 14,
    color: '#aaa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  followButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  messageButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomColor: '#000',
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Add space for footer navigation
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#777',
    marginVertical: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginVertical: 20,
    fontSize: 18,
  },
});

export default CommunityDetailsPage;
