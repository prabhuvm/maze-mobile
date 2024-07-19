import React, { useState } from 'react';
import { View, TextInput, Modal, StyleSheet, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostModal = ({ visible, onClose, addPost, navigation }) => {
  const [text, setText] = useState('');
  const { username, avatarId, avatarDict } = useGlobalContext();

  const handleSubmit = async() => {
    const query = text;
    setText('');
    console.log("POST: Executing query with ", `posts/${username}/${avatarId}/`, " for ", query);
    onClose();
    if (query.trim()) {
      const accessToken = await AsyncStorage.getItem('accessToken');
      apiClient.post(`posts/${username}/${avatarId}/`, { question: query }, 
        { headers: { 
          Authorization: `Bearer ${accessToken}` 
       }}
      )
        .then(response => {
          console.log("Received Response is: ", response.data);
          addPost(response.data);
        })
        .catch(error => console.error(error));
    }
  };

  const samplePosts = [
    "What's your favorite book and why?",
    "What's the best piece of advice you've ever received?",
    "What's your favorite place to visit?",
  ];

  const ModalComponent =
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.modalBackground}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onClose}>
              <Image source={require('../assets/icons/close.png')} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ask {avatarDict[avatarId].username}</Text>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.postButton}>Ask</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContainer}>
            <View style={styles.inputContainer}>
              <Image source={require('../assets/images/human.jpeg')} style={styles.userAvatar} />
              <TextInput
                style={styles.input}
                placeholder="Ask me anything"
                value={text}
                onChangeText={setText}
                multiline
              />
              <View style={styles.iconContainer}>
                <TouchableOpacity>
                  <Image source={require('../assets/icons/camera.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={require('../assets/icons/video.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={require('../assets/icons/image.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={require('../assets/icons/user.png')} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView style={styles.samplePostsContainer}>
              <Text style={styles.samplePostsTitle}>Sample Queries</Text>
              {samplePosts.map((postItem, index) => (
                <TouchableOpacity key={index} style={styles.samplePost} onPress={() => setText(postItem)}>
                  <Image source={require('../assets/icons/comment.png')} style={styles.samplePostIcon} />
                  <Text style={styles.samplePostText}>{postItem}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>

  return (ModalComponent);
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  closeButton: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  postButton: {
    fontSize: 18,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    height: 200, // Set a fixed height instead of percentage
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    flex: 1,
    textAlignVertical: 'top',
    width: '100%',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 1,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#333',
    marginRight: 10,
  },
  samplePostsContainer: {
    marginTop: 20,
  },
  samplePostsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  samplePost: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  samplePostIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  samplePostText: {
    fontSize: 14,
    color: '#333',
  },
});

export default PostModal;
