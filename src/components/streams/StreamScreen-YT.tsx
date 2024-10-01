import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To get the token
import VideoModal from './VideoModal';  // Import the VideoModal component
import { apiClient } from '../../api/client'; // Assume you have this set up for API requests

const StreamScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [trendingData, setTrendingData] = useState([]);
  const [streamData, setStreamData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Render a single item in the trending section
  const renderTrendingItem = ({ item }) => (
    <TouchableOpacity style={styles.trendingItem} onPress={() => openModal(item.video_id)}>
      <Image source={{ uri: item.image_url }} style={styles.trendingImage} />
      <Text style={styles.trendingTitle}>{item.title}</Text>
      <Text style={styles.trendingPlatform}>{item.platform}</Text>
    </TouchableOpacity>
  );

  // Render a single item in the stream/timeline section
  const renderStreamItem = ({ item }) => (
    <TouchableOpacity style={styles.streamItem} onPress={() => openModal(item.video_id)}>
      <Image source={{ uri: item.image_url }} style={styles.streamImage} />
      <View style={styles.streamTextContainer}>
        <Text style={styles.streamTitle}>{item.title}</Text>
        <Text style={styles.streamSubtitle}>{item.views} · {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Trending</Text>
      <FlatList
        data={trendingData}
        renderItem={renderTrendingItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingList}
      />

      <Text style={styles.sectionTitle}>Streams</Text>
      <FlatList
        data={streamData}
        renderItem={renderStreamItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.streamList}
      />

      {/* Video modal */}
      {selectedVideo && (
        <VideoModal visible={modalVisible} onClose={closeModal} videoId={selectedVideo} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light background
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333', // Dark text color
    marginBottom: 12,
  },
  trendingList: {
    paddingBottom: 16,
  },
  trendingItem: {
    marginRight: 16,
    width: 150,
  },
  trendingImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  trendingTitle: {
    color: '#333', // Dark text color
    marginTop: 8,
    fontWeight: 'bold',
  },
  trendingPlatform: {
    color: '#555', // Subtle dark color for platform
    fontSize: 12,
  },
  streamList: {
    paddingBottom: 16,
  },
  streamItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  streamImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  streamTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  streamTitle: {
    color: '#333', // Dark text color
    fontWeight: 'bold',
  },
  streamSubtitle: {
    color: '#555', // Subtle dark text for subtitle
    marginTop: 4,
  },
});

export default StreamScreen;
