import React from 'react';
import { FlatList, TouchableOpacity, Image, View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const StreamsSection = ({ streamData, openModal, themeStyles }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.streamItem} onPress={() => openModal(item.video_id)}>
      <Image source={{ uri: item.image_url }} style={styles.streamImage} />
      <Text style={[styles.streamTitle, themeStyles.text]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>All Streams</Text>
      <FlatList
        data={streamData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.streamList}
        numColumns={3} // 3 items per row
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
  streamList: {
    paddingBottom: 16,
    paddingHorizontal: 5, // Reduced padding for both sides to fit items better
  },
  streamItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    width: (screenWidth - 30) / 3, // Adjusted width to fit 3 items with more gap
    paddingHorizontal: 6, // Increased gap between items slightly
  },
  streamImage: {
    width: 100, // Icon/image size
    height: 100, // Icon/image size
    marginBottom: 8,
  },
  streamTitle: {
    textAlign: 'center',
    fontSize: 14, // Font size for title
  },
});

export default StreamsSection;
