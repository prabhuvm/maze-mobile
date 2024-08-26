import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const TournamentsScreen = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const upcomingTournaments = [
    { id: '1', day: 'Day 1', name: 'Clash Royale', startsIn: 'Starts in 3 days' },
    { id: '2', day: 'Day 1', name: 'PUBG Mobile', startsIn: 'Starts in 5 days' },
    { id: '3', day: 'Day 1', name: 'Brawl Stars', startsIn: 'Starts in 7 days' },
    { id: '4', day: 'Day 1', name: 'Free Fire', startsIn: 'Starts in 10 days' },
  ];

  const completedTournaments = [
    { id: '1', day: 'Day 1', name: 'Valorant', startsIn: 'Completed 2 days ago' },
    { id: '2', day: 'Day 1', name: 'League of Legends', startsIn: 'Completed 5 days ago' },
    { id: '3', day: 'Day 1', name: 'CS:GO', startsIn: 'Completed 7 days ago' },
  ];

  const renderTournament = ({ item }) => (
    <View style={styles.tournamentItem}>
      <View style={styles.tournamentInfo}>
        <View style={styles.trophyIcon} />
        <View>
          <Text style={styles.tournamentDay}>{item.day}: {item.name}</Text>
          <Text style={styles.startsIn}>{item.startsIn}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

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
        data={activeTab === 'Upcoming' ? upcomingTournaments : completedTournaments}
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
    paddingBottom: 80, // Ensures the content isn't cut off by any footer or other elements
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
});

export default TournamentsScreen;
