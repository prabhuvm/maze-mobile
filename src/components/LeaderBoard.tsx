import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const statistics = [
  { id: '1', title: 'Day streak', value: '7' },
  { id: '2', title: 'Total credits', value: '228' },
  { id: '3', title: 'Current league', value: 'Bronze' },
  { id: '4', title: 'Top 3 finishes', value: '23' },
];

const gameHistory = [
  {
    id: '1',
    game: 'Warzone - Plunder',
    rank: '10th',
    image: require('../assets/images/lead/warzone.png'),
  },
  {
    id: '2',
    game: 'Warzone - Plunder',
    rank: '13th',
    image: require('../assets/images/lead/warzone.png'),
  },
  {
    id: '3',
    game: 'Warzone - Plunder',
    rank: '8th',
    image: require('../assets/images/lead/warzone.png'),
  },
  {
    id: '4',
    game: 'Warzone - Plunder',
    rank: '5th',
    image: require('../assets/images/lead/warzone.png'),
  },
];

const achievements = [
  {
    id: '1',
    title: 'Champion',
    level: 'Level 2',
    image: require('../assets/images/lead/champion.png'),
    claimable: true,
  },
  {
    id: '2',
    title: 'Photogenic',
    level: 'Level 1',
    image: require('../assets/images/lead/photogenic.png'),
    claimable: true,
  },
  {
    id: '3',
    title: 'Sage',
    level: 'Level 2',
    image: require('../assets/images/lead/sage.png'),
    claimable: true,
  },
];

const LeaderboardScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>Helen Johnson</Text>
        <Text style={styles.profileHandle}>helen_johnson</Text>
        <Text style={styles.profileJoined}>Joined May 2015</Text>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Statistics</Text>
      <View style={styles.statisticsContainer}>
        {statistics.map((stat) => (
          <View key={stat.id} style={styles.statBox}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Game History</Text>
      <FlatList
        data={gameHistory}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Image source={item.image} style={styles.historyImage} />
            <View style={styles.historyInfo}>
              <Text style={styles.historyGame}>{item.game}</Text>
              <Text style={styles.historyRank}>{item.rank}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.sectionTitle}>Achievements</Text>
      <FlatList
        data={achievements}
        renderItem={({ item }) => (
          <View style={styles.achievementItem}>
            <Image source={item.image} style={styles.achievementImage} />
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{item.title}</Text>
              <Text style={styles.achievementLevel}>{item.level}</Text>
            </View>
            {item.claimable && (
              <TouchableOpacity style={styles.claimButton}>
                <Text style={styles.claimButtonText}>Claim</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileHandle: {
    color: '#666',
    marginTop: 5,
  },
  profileJoined: {
    color: '#666',
    marginTop: 5,
  },
  followButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
  },
  followButtonText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    color: '#888',
    marginTop: 5,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  historyInfo: {
    flex: 1,
  },
  historyGame: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyRank: {
    color: '#666',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementLevel: {
    color: '#666',
  },
  claimButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  claimButtonText: {
    color: '#000',
  },
});

export default LeaderboardScreen;
