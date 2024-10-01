import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import VideoModal from './VideoModal';  // Import the VideoModal component

// Mock data for trending and streams
const trendingData = [
  { id: '1', title: 'The best of 2022', imageUrl: 'https://via.placeholder.com/150', platform: 'Netflix', videoId: 'dQw4w9WgXcQ' },
  { id: '2', title: 'The ultimate dance', imageUrl: 'https://via.placeholder.com/150', platform: 'Spotify', videoId: '3JZ_D3ELwOQ' },
  { id: '3', title: 'Another trending', imageUrl: 'https://via.placeholder.com/150', platform: 'YouTube', videoId: 'L_jWHffIx5E' },
];

const streamData = [
  { id: '1', title: 'Happier than ever', imageUrl: 'https://via.placeholder.com/150', views: '3.9M views', date: '5 days ago', videoId: 'rRQMpDOcjjg' },
  { id: '2', title: 'Spiderman: No Way Home', imageUrl: 'https://via.placeholder.com/150', views: '4.8M views', date: '1 week ago', videoId: '8ugaeA-nMTc' },
  { id: '3', title: 'New York City', imageUrl: 'https://via.placeholder.com/150', views: '1.2M views', date: '2 weeks ago', videoId: 'Tt-tkDs2zU0' },
];

const StreamScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

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
    <TouchableOpacity style={styles.trendingItem} onPress={() => openModal(item.videoId)}>
      <Image source={{ uri: item.imageUrl }} style={styles.trendingImage} />
      <Text style={styles.trendingTitle}>{item.title}</Text>
      <Text style={styles.trendingPlatform}>{item.platform}</Text>
    </TouchableOpacity>
  );

  // Render a single item in the stream/timeline section
  const renderStreamItem = ({ item }) => (
    <TouchableOpacity style={styles.streamItem} onPress={() => openModal(item.videoId)}>
      <Image source={{ uri: item.imageUrl }} style={styles.streamImage} />
      <View style={styles.streamTextContainer}>
        <Text style={styles.streamTitle}>{item.title}</Text>
        <Text style={styles.streamSubtitle}>{item.views} · {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

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
