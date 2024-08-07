import React from 'react';
import { View, StyleSheet } from 'react-native';
import PostHeader from './PostHeader';
import PostText from './PostText';
import PostImage from './PostImage';
import PostFooter from './PostFooter';


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
    creator?: {
      username: string;
      profile_img: string;
    };
    participants?: Array<{
      username: string;
      profile_img: string;
    }>;
  };
}

const PostSummary: React.FC<PostProps> = ({ post, isExpanded, toggleExpand }) => {
  return (
    <View style={styles.postContainer}>
      <PostHeader
        username={post.username}
        date={post.date}
        avatar={post.avatar}
        creator={post.creator}
        participants={post.participants}
      />
      <PostText
        content={post.content}
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        postid={post.postid}
      />
      {Array.isArray(post.images) && post.images.length > 0 && (
        <PostImage images={post.images} username={post.username} avatar={post.avatar} />
      )}
      <PostFooter comments={post.comments} likes={post.likes} shares={post.shares} />
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default PostSummary;
