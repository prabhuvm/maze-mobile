import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

const AvatarChatScreen = ({ route }) => {
  const [text, setText] = useState('');
  const [prev, setPrev] = useState('');
  const [style, setStyle] = useState('bartender');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', sender: 'user', text: "What's the price now?", style: 'user' },
    { id: '2', sender: 'bot', text: "$980, it's doing great.", style: 'bartender' },
  ]);
  const { bot } = route.params;
  const flatListRef = useRef();

  const stylesList = [
    { style: 'bartender', icon: require('../assets/images/human.jpeg') },
    { style: 'lawyer', icon: require('../assets/images/human.jpeg') },
    { style: 'doctor', icon: require('../assets/images/human.jpeg') },
    { style: 'teacher', icon: require('../assets/images/human.jpeg') },
    { style: 'chef', icon: require('../assets/images/human.jpeg') }
  ]; // Example styles with icons

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    const userMessage = { id: `${messages.length + 1}`, sender: 'user', text: text.trim(), style: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setText('');

    setLoading(true);

    const convoDict = {}

    const payload = {
      input: {
        text: text.trim(),
        prev: style in convoDict ? convoDict[style] : '',
        style: style,
      },
    };



    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.post(
        `/avatars/agents/${bot.agent_id}/chat/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const botMessage = { id: `${messages.length + 2}`, sender: 'bot', text: response.data.transformed_text, style: style };
        convoDict[style] = response.data.transformed_text;
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    flatListRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={item.sender === 'user' ? styles.userMessageText : styles.messageText}>{item.text}</Text>
      <View style={styles.messageMeta}>
        {item.sender === 'user' ? null : <Image source={stylesList.find(s => s.style === item.style).icon} style={styles.icon} />}
        <Text style={styles.messageStyle}>{item.style}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{bot.name}</Text>
        <Text>You are talking to {style}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}-${item.sender}`} // Ensure unique keys
        style={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Aa"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={toggleModal}>
        <Image source={require('../assets/icons/plus.png')} style={styles.sendIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSend} disabled={loading}>
        <Image source={require('../assets/icons/send.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          {stylesList.map((styleOption) => (
            <TouchableOpacity
              key={styleOption.style}
              style={styles.modalItem}
              onPress={() => {
                setStyle(styleOption.style);
                toggleModal();
              }}
            >
              <Image source={styleOption.icon} style={styles.modalIcon} />
              <Text style={styles.modalText}>{styleOption.style}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#FFDD00',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#000', // Changed to black for better readability for bot messages
  },
  userMessageText: {
    fontSize: 16,
    color: '#000', // White for user messages
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  messageStyle: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  plusButton: {
    marginLeft: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
    marginLeft: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  modalText: {
    fontSize: 18,
  },
});

export default AvatarChatScreen;
