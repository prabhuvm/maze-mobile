// SplashScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';
import { updateDeviceToken, getToken } from '../notificationSetup';
import { getDeviceToken } from 'react-native-device-info';

const SplashLogin = () => {
  const navigation = useNavigation();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const [initialRoute, setInitialRoute] = useState('');
  const { setAvatars, setAvatarDict, setAvatarId, setDeviceToken, deviceId, deviceToken } = useGlobalContext();

  const prepareAndLoadTimeline = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.get('/avatars/', { 
      headers: { 
        Authorization: `Bearer ${accessToken}` 
      }
    })
      .then(response => {
     //   setAvatarId(1);
        console.log("Avatars:", response.data); // Debugging line
        setAvatars(response.data);

        const avatarDictionary = response.data.reduce((acc, avatar) => {
          acc[avatar.id] = avatar;
          return acc;
        }, {});
        setAvatarDict(avatarDictionary); // Update avatarDict state
      })
      .catch(error => console.error(error));

      console.log("Timeline set in Login $$$$$$$")
    setInitialRoute('Timeline');
  }

  useEffect(() => {
    prepareAndLoadTimeline();
    getToken(setDeviceToken);
  }, []);

  useEffect(() => {
    const notificationSetup = async () => {
      updateDeviceToken(deviceId, deviceToken);
    };  
    notificationSetup();
  }, [deviceId, deviceToken]);

  useEffect(() => {
    // Animate logo opacity, scale, and text opacity
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 500,
        delay: 500, // Delay the fade-out to allow for loading animation
        useNativeDriver: true,
      })
    ]).start(() => {
      // Navigate to the initial route after the animation
      setTimeout(() => navigation.navigate(initialRoute), 200);
    });
  }, [opacity, scale, textOpacity, initialRoute, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: opacity, transform: [{ scale: scale }] }}>
        <Image source={require('../assets/images/maze.jpeg')} style={styles.logo} />
        <Text style={styles.title}>MAZE</Text>
      </Animated.View>
      <Animated.View style={{ opacity: textOpacity }}>
        <Text style={styles.loading}>Loading<Text style={styles.dotOne}>.</Text><Text style={styles.dotTwo}>.</Text><Text style={styles.dotThree}>.</Text></Text>
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
  loading: {
    marginTop: 1,
    fontSize: 16,
    fontFamily: 'Roboto',
    color: 'gray',
    textAlign: 'center',
  },
  dotOne: {
    animation: 'blink 1s infinite',
  },
  dotTwo: {
    animation: 'blink 1s infinite',
    animationDelay: '0.2s',
  },
  dotThree: {
    animation: 'blink 1s infinite',
    animationDelay: '0.4s',
  },
});

export default SplashLogin;
