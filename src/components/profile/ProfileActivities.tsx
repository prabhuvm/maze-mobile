import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileActivities = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No activities available</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#777',
  },
});

export default ProfileActivities;
