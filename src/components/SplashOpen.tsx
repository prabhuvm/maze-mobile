// SplashScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client'; // Import your API client
import Svg, { Path } from 'react-native-svg';
import { useGlobalContext } from '../GlobalContext';
import DeviceInfo from 'react-native-device-info';

const SplashOpen = () => {
  const navigation = useNavigation();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const svgDashOffset = useRef(new Animated.Value(1)).current;
  const svgOpacity = useRef(new Animated.Value(1)).current;
  const [initialRoute, setInitialRoute] = useState('');
  const {deviceId, setDeviceId, setAccessToken, setRefreshToken, setUsername, setAvatars, setAvatarDict, setAvatarId} = useGlobalContext();

  useEffect(() => {
    const fetchDeviceInfo = async () => {
   // Get the device name
   DeviceInfo.getUniqueId().then((id) => {
    console.log("##### Setting deviceId: ", id);
     setDeviceId(id);
   });
  }
  fetchDeviceInfo();
}, []);

  const prepareAndLoadTimeline = async() => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.get('/avatars/', { 
      headers: { 
        Authorization: `Bearer ${accessToken}` 
      }
    }).then(response => {
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
    const checkAuth = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log('##################### access token exist: ', accessToken)
      if (accessToken) {
        try {
          const response = await apiClient.post('/users/verify-token/', {deviceId}, { headers: { Authorization: `Bearer ${accessToken}` } });
          console.log('##################### Verify token: ', response.data,"  ",  response.status)
          if(response.status === 200) {
            console.log("Setting username: ", response.data.username)
            setUsername(response.data.username)
            prepareAndLoadTimeline();
          }
        } catch (error) {
          console.error('##################### Verify Token Error: ', error)
          if (refreshToken) {
            const response = await refreshAccessToken(refreshToken);
            if (response) {
              prepareAndLoadTimeline();
            } else {
              setInitialRoute('Login');
            }
          } else {
            setInitialRoute('Login');
          }
        }
      } else {
        setInitialRoute('Login');
      }
    };

    const refreshAccessToken = async (refreshToken) => {
      try {
        const response = await apiClient.post('/users/refresh-token/', { refresh: refreshToken, deviceId });
        if (response.status === 200) {
          console.log('##################### Refresh token: ', response.data)
          const { accessToken, refreshToken, userName } = response.data;
          AsyncStorage.setItem('accessToken', accessToken);
          AsyncStorage.setItem('refreshToken', refreshToken);
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          setUsername(userName);
          return true;
        }
      } catch (error) {
        console.error('Failed to refresh token', error);
      }
      return false;
    };

    if (deviceId) {
      checkAuth();
    }
  }, [deviceId]);

  useEffect(() => {
    // Animate the maze drawing
    Animated.timing(svgDashOffset, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      // Fade out the maze
      Animated.timing(svgOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Animate logo opacity and scale
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
      ]).start(() => {
        // Navigate to the initial route after the animation
        setTimeout(() => navigation.navigate(initialRoute), 200);
      });
    });
  }, [opacity, scale, svgDashOffset, svgOpacity, initialRoute, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: svgOpacity }}>
        <Svg height="150" width="150" viewBox="0 0 100 100">
          <Path
            d="M 10,10 L 90,10 L 90,90 L 10,90 Z M 30,30 L 70,30 L 70,70 L 30,70 Z"
            stroke="lightgray"
            strokeWidth="2"
            fill="none"
            strokeDasharray="100"
            strokeDashoffset={svgDashOffset}
          />
        </Svg>
      </Animated.View>
      <Animated.View style={{ opacity: opacity, transform: [{ scale: scale }] }}>
        <Image source={require('../assets/images/maze.jpeg')} style={styles.logo} />
        <Text style={styles.title}>MAZE</Text>
        <Text style={styles.website}>visit maze.social</Text>
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
    color:'#000',
  },
  website: {
    marginTop: 1,
    fontSize: 16,
    fontFamily: 'Roboto',
    color: 'gray',
    textAlign: 'center',
  },
});

export default SplashOpen;
