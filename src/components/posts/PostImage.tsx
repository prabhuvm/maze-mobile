import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PostImageModal from './PostImageModal';

interface PostImageProps {
  images: string[];
  username: string;
  avatar: string;
}

const PostImage: React.FC<PostImageProps> = ({ images, username, avatar }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImagePress = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  const renderImages = (images: string[]) => {
    if (images.length === 1) {
      return (
        <TouchableOpacity onPress={handleImagePress}>
          <Image source={{ uri: images[0] }} style={styles.singleImage} />
        </TouchableOpacity>
      );
    }
    if (images.length === 2) {
      return (
        <View style={styles.twoImagesContainer}>
          {images.map((image, index) => (
            <TouchableOpacity key={index} onPress={handleImagePress}>
              <Image source={{ uri: image }} style={styles.twoImage} />
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    if (images.length >= 3) {
      return (
        <View style={styles.threeImagesContainer}>
          <View style={styles.horizontalContainer}>
            <TouchableOpacity onPress={handleImagePress}>
              <Image source={{ uri: images[0] }} style={styles.mainImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.verticalImagesContainer}>
            <TouchableOpacity onPress={handleImagePress}>
              <Image source={{ uri: images[1] }} style={styles.secondaryImage} />
            </TouchableOpacity>
            <View style={styles.additionalImagesContainer}>
              <TouchableOpacity onPress={handleImagePress}>
                <Image source={{ uri: images[2] }} style={styles.secondaryImage} />
              </TouchableOpacity>
              {images.length > 3 && (
                <View style={styles.moreImagesOverlay}>
                  <Text style={styles.moreImagesText}>+{images.length - 3}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View>
      {renderImages(images)}
      <PostImageModal
        images={images}
        isVisible={isExpanded}
        onClose={handleClose}
        username={username}
        avatar={avatar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  singleImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  twoImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  twoImage: {
    width: '48%',
    height: 200,
    borderRadius: 5,
  },
  threeImagesContainer: {
    flexDirection: 'row',
  },
  horizontalContainer: {
    width: '50%',
  },
  verticalImagesContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '50%',
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 5,
  },
  secondaryImage: {
    width: '100%',
    height: 97,
    borderRadius: 5,
    marginBottom: 5,
  },
  additionalImagesContainer: {
    position: 'relative',
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  moreImagesText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PostImage;
