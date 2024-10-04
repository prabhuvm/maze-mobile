import React, { useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width: screenWidth } = Dimensions.get('window');

const VideoPlayerCarousel = ({ videos }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const onScrollEnd = (e) => {
    const index = Math.floor(e.nativeEvent.contentOffset.x / screenWidth);
    setCurrentVideoIndex(index);
  };

  const renderVideoItem = ({ item }) => (
    <View style={styles.videoContainer}>
      <YoutubePlayer
        height={250}
        play={currentVideoIndex === videos.indexOf(item)} // Play only the current video
        videoId={item.videoId}
        webViewProps={{ allowsFullscreenVideo: false }}
      />
    </View>
  );

  return (
    <>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        snapToInterval={screenWidth} // Ensure snapping to full-screen video
        decelerationRate="fast" // Ensures smooth snapping
        snapToAlignment="center" // Align to center when snapping
        onMomentumScrollEnd={onScrollEnd}
      />

      <View style={styles.pagination}>
        {videos.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentVideoIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: screenWidth, // Make the video container span the entire screen width
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'blue', // Change this based on the theme
  },
  inactiveDot: {
    backgroundColor: '#444',
  },
});

export default VideoPlayerCarousel;
