// SplashScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';

const SplashSignup = () => {
  const navigation = useNavigation();
  const opacity = useRef(new Animated.Value(1)).current; // Initial opacity value: 1 (fully visible)
  const [initialRoute, setInitialRoute] = useState('');
  const { setAvatars, setAvatarDict, setAvatarId } = useGlobalContext();

  const prepareAndLoadTimeline = () => {
    apiClient.get('/avatars/')
      .then(response => {
        setAvatarId(1);
        console.log("Avatars:", response.data); // Debugging line
        setAvatars(response.data);

        const avatarDictionary = response.data.reduce((acc, avatar) => {
          acc[avatar.id] = avatar;
          return acc;
        }, {});
        setAvatarDict(avatarDictionary); // Update avatarDict state
      })
      .catch(error => console.error(error));

    setInitialRoute('Timeline');
  }

  useEffect(() => {
    prepareAndLoadTimeline();
  }, []);

  useEffect(() => {
    // Animate logo, title, and message fade out together
    Animated.timing(opacity, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      // Navigate to the initial route after the animation
      setTimeout(() => navigation.navigate(initialRoute), 200);
    });
  }, [opacity, initialRoute, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity }}>
        <Image source={require('../assets/images/maze.jpeg')} style={styles.logo} />
        <Text style={styles.title}>MAZE</Text>
      </Animated.View>
      <Animated.View style={{ opacity }}>
        <Text style={styles.message}>Preparing... Excited to have you!</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    marginTop: 5,
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'Roboto',
    color: 'gray',
    textAlign: 'center',
  },
});

export default SplashSignup;
