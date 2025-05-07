import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EligibilityScreen = () => {
  // Stores user's eligibility status (null=loading, 1=eligible)
  const [eligible, setEligible] = useState(null);
  const navigation = useNavigation();
  const {username} = useGlobalContext();
  // Tracks if user completed onboarding to determine navigation flow
  const [onboarding, setOnboarding] = useState(false);
  // Flag to prevent multiple API calls and trigger navigation
  const [checked, setChecked] = useState(false);

  useEffect(() => {

    const checkEligible = async() => {
      console.log("@@@@@@@@@@@@@ Fetching eligibility")
      const accessToken = await AsyncStorage.getItem('accessToken');
      apiClient.get(`/users/${username}/eligible`, 
            {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }}
      )
        .then(response => {
          const {onboarding, eligible} = response.data;
          setEligible(eligible);
          setOnboarding(onboarding);
          setChecked(true);
        })
        .catch(error => console.error(error));
    }
    if(!checked) {
    checkEligible();
    }

  }, []);

  useEffect(() => {
    if(checked) {
      console.log("%%%%%%%%%%%%%%  Checking eligibility: ", onboarding)
    if(onboarding) {
      console.log("############################ Navigating explore   $$$$$$$$$$$$$$$$$")
      navigation.navigate('Explore', {skip:true});
    } else {
      console.log("$$$$$$$$$$$$$$$$$ Splashscreen explore ")
      console.log("Setting Splashlogin as initial route #####")
      navigation.navigate('SplashLogin');
    }
  }
  }, [checked]);

  if (eligible === null) {
    return <Text>Loading...</Text>;
  }

  if (!(eligible === 1)) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Stay Tuned...</Text>
          <Text style={styles.description}>
            Exciting Updates Coming Soon! Stay connected to be first to get access to our upcoming launch!!
          </Text>
          <Text style={styles.meanwhile}>Meanwhile:</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('GameStore')}
          >
            <Text style={styles.buttonText}>VISIT GAME STORE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  meanwhile: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: 'black', // Material Design blue
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default EligibilityScreen;
