import React, { useState } from 'react';
import { View, TextInput, Button, Modal, TouchableWithoutFeedback, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';

const PostModal = ({visible, onClose, addPost, navigation}) => {
  const [text, setText] = useState('');
  const {username, avatarId} = useGlobalContext();

  const handleSubmit = () => {
    const query = text;
    setText('');
    onClose();
    if (query.trim()) {
      apiClient.post(`posts/${username}/${avatarId}/`, { question: query })
        .then(response => {
          console.log("Recieved Response is: ", response.data);
          addPost(response.data);
        })
        .catch(error => console.error(error));
    }
  };
  
  const ModalComponent = 
<Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <TextInput
                style={styles.input}
                placeholder="What's on your mind?"
                value={text}
                onChangeText={setText}
                multiline
              />
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Post</Text>
              </TouchableOpacity>
            </View>
          
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>

return (ModalComponent);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    height: 150,
    textAlignVertical: 'top',
  },
  button: {
    flex: 1,
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default PostModal;
