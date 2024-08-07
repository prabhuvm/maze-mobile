import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';

interface PostImageModalProps {
  images: string[];
  isVisible: boolean;
  onClose: () => void;
  username: string;
  avatar: string;
}

const { width } = Dimensions.get('window');

const PostImageModal: React.FC<PostImageModalProps> = ({ images, isVisible, onClose, username, avatar }) => {
  return (
    <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Image source={require('../../assets/icons/backw.png')} style={styles.backArrow} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.username}>{username}</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.fullImageContainer}>
              <Image source={{ uri: image }} style={styles.fullImage} />
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
//    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
//    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  backButton: {
    padding: 10,
  },
  backArrow: {
    width: 24,
    height: 24,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingTop: 60, // Make sure content doesn't overlap the header
  },
  fullImageContainer: {
    width: width, // Full width of the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
});

export default PostImageModal;
