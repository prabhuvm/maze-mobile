import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

// Mock comments data
const commentsData = [
  { id: '1', user: 'Joe Finn', comment: 'I normally click like before watching. The show is always so good.', time: '21min ago', likes: 8, replies: 2, userImage: 'https://via.placeholder.com/50' },
  { id: '2', user: 'Carley Davlin', comment: "I'm from Ireland and I'm dying to eat all the amazing food you've tried!", time: '10min ago', likes: 4, replies: 1, userImage: 'https://via.placeholder.com/50' },
  { id: '3', user: 'Jason Keith', comment: 'Your videos are awesome and you deserve so many more subscribers.', time: '30min ago', likes: 6, replies: 2, userImage: 'https://via.placeholder.com/50' },
];

const VideoModal = ({ visible, onClose, videoId, theme }) => {
  // Define theme-based styles
  const themeStyles = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, themeStyles.modalContent]}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={[styles.closeButtonText, themeStyles.closeButtonText]}>Close</Text>
          </TouchableOpacity>

          {/* YouTube Player */}
          <YoutubePlayer 
            height={250} 
            play={true} 
            videoId={videoId} 
            webViewProps={{ allowsFullscreenVideo: false }}
          />

          {/* Comments Section */}
          <ScrollView style={styles.commentsContainer}>
            <Text style={[styles.commentsTitle, themeStyles.text]}>Comments</Text>
            {commentsData.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Image source={{ uri: comment.userImage }} style={styles.commentUserImage} />
                <View style={styles.commentContent}>
                  <Text style={[styles.commentUser, themeStyles.text]}>
                    {comment.user} <Text style={[styles.commentTime, themeStyles.subText]}>{comment.time}</Text>
                  </Text>
                  <Text style={[styles.commentText, themeStyles.text]}>{comment.comment}</Text>
                  <View style={styles.commentActions}>
                    <Text style={[styles.likeCount, themeStyles.subText]}>👍 {comment.likes}</Text>
                    <Text style={[styles.replyCount, themeStyles.subText]}>💬 {comment.replies}</Text>
                  </View>
                </View>
              </View>
            ))}
            {/* Add Comment Section */}
            <View style={[styles.addCommentContainer, themeStyles.addCommentContainer]}>
              <TextInput style={[styles.addCommentInput, themeStyles.addCommentInput]} placeholder="Add a comment" placeholderTextColor={theme === 'dark' ? '#888' : '#AAA'} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Define Light and Dark Theme Styles
const lightTheme = StyleSheet.create({
  modalContent: {
    backgroundColor: '#FFF',
  },
  closeButtonText: {
    color: '#333',
  },
  text: {
    color: '#333',
  },
  subText: {
    color: '#777',
  },
  addCommentContainer: {
    backgroundColor: '#F0F0F0',
  },
  addCommentInput: {
    color: '#333',
  },
});

const darkTheme = StyleSheet.create({
  modalContent: {
    backgroundColor: '#1C1C1C',
  },
  closeButtonText: {
    color: '#FFF',
  },
  text: {
    color: '#FFF',
  },
  subText: {
    color: '#888',
  },
  addCommentContainer: {
    backgroundColor: '#333',
  },
  addCommentInput: {
    color: '#FFF',
  },
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  commentsContainer: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 12,
  },
  commentText: {
    marginVertical: 4,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginRight: 16,
  },
  replyCount: {},
  addCommentContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addCommentInput: {
    flex: 1,
  },
});

export default VideoModal;
