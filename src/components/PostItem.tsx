import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { format, isToday, isThisYear, parseISO } from 'date-fns';

interface PostProps {
  isExpanded: boolean;
  toggleExpand: (id: number) => void;

  post: {
    postid: number;
    username: string;
    handle: string;
    date: string;
    content: string;
    images: string[];
    videos: string[];
    audios: string[];
    avatar: string;
    comments: number;
    likes: number;
    shares: number;
  }
}

const PostItem: React.FC<PostProps> = ({ post, isExpanded, toggleExpand }) => {
  const trimmedText = post.content.length > 200 ? `${post.content.substring(0, 200)}... ` : post.content;

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    if (isThisYear(date)) {
      return format(date, 'd MMM');
    }
    return format(date, 'd MMM yyyy');
  };

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
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image style={styles.avatar} source={require('../assets/images/robot.gif')} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.username}</Text>
          <Text style={styles.postDate}>{formatDate(post.date)}</Text>
        </View>
      </View>
      <Text style={styles.text}>
        {isExpanded ? post.content : trimmedText}
        {post.content.length > 200 && (
          <Text style={styles.moreLessText} onPress={() => toggleExpand(post.postid)}>
            {isExpanded ? 'less' : 'more'}
          </Text>
        )}
      </Text>
      {Array.isArray(post.images) && post.images.length > 0 && renderImages(post.images)}
      <View style={styles.postFooter}>
        <View style={styles.footerItem}>
          <Image source={require('../assets/icons/comment.png')} style={styles.footerIcon} />
          <Text style={styles.footerText}>{post.comments}</Text>
        </View>
        <View style={styles.footerItem}>
          <Image source={require('../assets/icons/share.png')} style={styles.footerIcon} />
          <Text style={styles.footerText}>{post.shares}</Text>
        </View>
        <View style={styles.footerItem}>
          <Image source={require('../assets/icons/like.png')} style={styles.footerIcon} />
          <Text style={styles.footerText}>{post.likes}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    color: '#000',
  },
  handle: {
    fontSize: 14,
    color: '#888',
  },
  postDate: {
    fontSize: 14,
    color: '#888',
  },
  text: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    marginBottom: 10,
    fontFamily: 'Roboto-Regular',  // Apply the Roboto Light font here
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
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
});

export default PostItem;
