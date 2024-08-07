import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface PostFooterProps {
  comments: number;
  likes: number;
  shares: number;
}

const PostFooter: React.FC<PostFooterProps> = ({ comments, likes, shares }) => {
  return (
    <View style={styles.postFooter}>
      <View style={styles.footerItem}>
        <Image source={require('../../assets/icons/comment.png')} style={styles.footerIcon} />
        <Text style={styles.footerText}>{comments}</Text>
      </View>
      <View style={styles.footerItem}>
        <Image source={require('../../assets/icons/share.png')} style={styles.footerIcon} />
        <Text style={styles.footerText}>{shares}</Text>
      </View>
      <View style={styles.footerItem}>
        <Image source={require('../../assets/icons/like.png')} style={styles.footerIcon} />
        <Text style={styles.footerText}>{likes}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default PostFooter;
