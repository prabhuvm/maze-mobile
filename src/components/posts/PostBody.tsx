import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface PostBodyProps {
  content: string;
  images: string[];
  isExpanded: boolean;
  toggleExpand: (id: number) => void;
  postid: number;
}

const PostBody: React.FC<PostBodyProps> = ({ content, images, isExpanded, toggleExpand, postid }) => {
  const trimmedText = content.length > 200 ? `${content.substring(0, 200)}... ` : content;

  const renderImages = (images: string[]) => {
    if (images.length === 1) {
      return <Image source={{ uri: images[0] }} style={styles.singleImage} />;
    }
    if (images.length === 2) {
      return (
        <View style={styles.twoImagesContainer}>
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.twoImage} />
          ))}
        </View>
      );
    }
    if (images.length >= 3) {
      return (
        <View style={styles.threeImagesContainer}>
          <View style={styles.horizontalContainer}>
            <Image source={{ uri: images[0] }} style={styles.mainImage} />
          </View>
          <View style={styles.verticalImagesContainer}>
            <Image source={{ uri: images[1] }} style={styles.secondaryImage} />
            <View style={styles.additionalImagesContainer}>
              <Image source={{ uri: images[2] }} style={styles.secondaryImage} />
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
      <Text style={styles.text}>
        {isExpanded ? content : trimmedText}
        {content.length > 200 && (
          <Text style={styles.moreLessText} onPress={() => toggleExpand(postid)}>
            {isExpanded ? 'less' : 'more'}
          </Text>
        )}
      </Text>
      {Array.isArray(images) && images.length > 0 && renderImages(images)}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    marginBottom: 10,
    fontFamily: 'Roboto-Regular',
  },
  moreLessText: {
    color: 'blue',
    fontWeight: 'bold',
  },
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

export default PostBody;
