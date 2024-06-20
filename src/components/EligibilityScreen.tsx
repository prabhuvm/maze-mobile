import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EligibilityScreen = () => {
  const [eligible, setEligible] = useState(null);
  const navigation = useNavigation();
  const {username} = useGlobalContext();

  useEffect(() => {

    const checkEligible = async() => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      apiClient.get(`/users/${username}/eligible`, 
            {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }}
      )
        .then(response => {
          setEligible(response.data.eligible);
        })
        .catch(error => console.error(error));
    }
    checkEligible();
    
  }, []);

  if (eligible === null) {
    return <Text>Loading...</Text>;
  }

  if (!(eligible === 1)) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Stay Tuned...</Text>
        <Text>Exciting Updates Coming Soon! Stay in the loop and be the first to know about our upcoming launch!!</Text>
      </View>
    );
  }
  navigation.navigate('Explore');
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white', // Add background color from the theme
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold', // Bold text as in the theme
  },
});

export default EligibilityScreen;
