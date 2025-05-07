import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';  // Install moment.js if needed
import { useNavigation } from '@react-navigation/native';
import { NativeModules } from 'react-native';

const TournamentsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await apiClient.get(`/events/`,  
        { headers: { 
          Authorization: `Bearer ${accessToken}` 
       }});
      
      console.log('Events : ', response.data);
      
      // Set the events based on the response
      const data = response.data.map(event => ({
        ...event,
        title: event.title.length > 24 ? `${event.title.substring(0, 24)}...` : event.title // Trimming title
      }));
      setEvents(data);
      
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (time) => {
    const eventTime = moment(time);
    const now = moment();
    
    const diffInSeconds = eventTime.diff(now, 'seconds');

    if (diffInSeconds < 60) {
      return `Starts in sometime`;
    }
    
    const diffInMinutes = eventTime.diff(now, 'minutes');
    if (diffInMinutes < 60) {
      return `Starts in ${diffInMinutes} minutes`;
    }

    const diffInHours = eventTime.diff(now, 'hours');
    if (diffInHours < 24) {
      return `Starts in ${diffInHours} hours`;
    }

    const diffInDays = eventTime.diff(now, 'days');
    return `Starts in ${diffInDays} days`;
  };

  const handleJoinEvent = async (event) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      
      // Fetch app details using the agent_id from event
      const response = await apiClient.get(`/games/${event.game_id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const appDetails = response.data;
      console.log('appDetails >>>>>', appDetails);
      // Handle launching the app
      if (appDetails.platforms.native) {
        // Navigate to GameScreen with both app and event details

        const gameDetails = {
          appId: appDetails.game_id,
          gameId: appDetails.id,
          event: event  // Pass the event ID to connect to the right game instance
        }
        console.log('gameDetails >>>>> ', gameDetails);
        navigation.navigate("GameScreen", gameDetails);
      } else {
        // For non-native apps, launch using deep link
        const { AppLauncher } = NativeModules;
        await AppLauncher.launchApp(appDetails.deep_link_url)
          .then(() => console.log('App opened successfully'))
          .catch(err => console.log('Error opening app: ', err));
      }
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  const renderTournament = ({ item }) => (
    <View style={styles.tournamentItem}>
      <View style={styles.tournamentInfo}>
        <View style={styles.trophyIcon} />
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.tournamentDay}>{item.title}</Text>
            {item.type === 'private' && (
              <Image source={require('../assets/icons/lockg.png')} style={styles.lockIcon} />
            )}
          </View>
           <View>
            <Text style={styles.startsIn}>{getRelativeTime(item.time)}</Text> 
          </View> 
        </View>
      </View>
      <TouchableOpacity 
        style={styles.joinButton}
        onPress={() => handleJoinEvent(item)}
      >
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournaments</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('Upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events} // Display fetched events
        renderItem={renderTournament}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
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
  listContainer: {
    paddingBottom: 80,
  },
  tournamentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tournamentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginRight: 10,
  },
  tournamentDay: {
    fontSize: 16,
    color: '#000',
  },
  lockIcon: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
  startsIn: {
    fontSize: 14,
    color: '#555',
  },
  joinButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 16,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TournamentsScreen;
