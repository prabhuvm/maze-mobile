import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To get the token
import VideoModal from './VideoModal';  // Import the VideoModal component
import { apiClient } from '../../api/client';  // Assume you have this set up for API requests
import StreamHeader from './StreamHeader';
import VideoPlayerCarousel from './VideoPlayerCarousel';
import TrendingSection from './TrendingSection';
import StreamsSection from './StreamsSection';

const StreamScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [trendingData, setTrendingData] = useState([]);
  const [streamData, setStreamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);  // Theme state

  const videos = [
    { videoId: 'dQw4w9WgXcQ' }, // Mock video data
    { videoId: '3JZ_D3ELwOQ' },
    { videoId: 'L_jWHffIx5E' },
  ];

  // Function to fetch the data from API with Authorization
  const fetchStreamsData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');  // Retrieve the access token
      await apiClient.get(`/streams`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(response => {
        console.log("Streams received: ", response.data);
        
        // Assuming response has { trending: [...], streams: [...] }
        setTrendingData(response.data.trending);
        setStreamData(response.data.streams);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching streams:', error);
        setLoading(false);
      });
    } catch (error) {
      console.error('Error retrieving access token:', error);
      setLoading(false);
    }
  };

  // Fetch the data when the component mounts
  useEffect(() => {
    fetchStreamsData();
  }, []);

  const openModal = (videoId) => {
    console.log("Opening the video: ", videoId);
    setSelectedVideo(videoId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVideo(null);
  };

  // Function to toggle theme
  const toggleTheme = () => {
    setIsDarkTheme(previousState => !previousState);
  };

  const themeStyles = isDarkTheme ? darkTheme : lightTheme;

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
      {/* Header Component */}
      <StreamHeader isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} />

      {/* Full-Screen Video Player Carousel */}
      <VideoPlayerCarousel videos={videos} />

      {/* Trending Section */}
      <TrendingSection trendingData={trendingData} openModal={openModal} themeStyles={themeStyles} />

      {/* Streams Section */}
      <StreamsSection streamData={streamData} openModal={openModal} themeStyles={themeStyles} />

      {/* Video modal */}
      {selectedVideo && (
        <VideoModal visible={modalVisible} onClose={closeModal} videoId={selectedVideo} theme={isDarkTheme ? 'dark' : 'light'} />
      )}
    </ScrollView>
  );
};

// Define Light and Dark Theme Styles
const lightTheme = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
  },
  sectionTitle: {
    color: '#333',
  },
  text: {
    color: '#333',
  },
});

const darkTheme = StyleSheet.create({
  container: {
    backgroundColor: '#000000',  // Dark background
  },
  sectionTitle: {
    color: '#FFFFFF',
  },
  text: {
    color: '#FFFFFF',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default StreamScreen;
