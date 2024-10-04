import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const TrendingSection = ({ trendingData, openModal, themeStyles }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>Trending</Text>
      <FlatList
        data={trendingData}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trendingItem} onPress={() => openModal(item.video_id)}>
            <Image source={{ uri: item.image_url }} style={styles.trendingImage} />
            <Text style={[styles.trendingTitle, themeStyles.text]}>{item.title}</Text>
            <Text style={[styles.trendingWatching, themeStyles.text]}>{item.watching} watching</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingList}
        snapToInterval={screenWidth * 0.6} // Snap effect for 60% width
        decelerationRate="fast" // Smooth snapping
        pagingEnabled={false} // No full-page snapping
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  trendingList: {
    paddingBottom: 16,
  },
  trendingItem: {
    width: screenWidth * 0.6, // Each item occupies 60% of screen width
    marginRight: 16, // Add margin for next item preview
  },
  trendingImage: {
    width: '100%',
    height: 160, // Proportionally increased height
    borderRadius: 8,
  },
  trendingTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  trendingWatching: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
});

export default TrendingSection;
