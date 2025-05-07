import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AchievementBoard = ({ achievements }) => {
  return (
    <View style={styles.achievementContainer}>
      <Text style={styles.achievementTitle}>Achievements</Text>
      {achievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementItem}>
          <View style={styles.achievementInfo}>
            <Image source={{ uri: achievement.icon }} style={styles.achievementIcon} />
            <View>
              <Text style={styles.achievementName}>{achievement.name}</Text>
              <Text style={styles.achievementLevel}>Level {achievement.level}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.claimButton}>
            <Text style={styles.claimButtonText}>Claim</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  achievementContainer: {
    padding: 16,
    backgroundColor: '#FBFAF7',
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  achievementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  achievementLevel: {
    fontSize: 14,
    color: '#777',
  },
  claimButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  claimButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default AchievementBoard;
