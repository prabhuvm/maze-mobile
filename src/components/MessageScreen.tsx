import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Modal, ScrollView } from 'react-native';
import { apiClient } from '../api/client';

const messagesList = [
    {
      id: '1',
      name: 'Elon Musk',
      message: 'Hey, did you see the latest SpaceX launch?',
      time: '2h',
      avatar: require('../assets/test/avatar-jeffery.png'),
    },
    {
      id: '2',
      name: 'Jeff Bezos',
      message: 'Hello, have you checked the latest Amazon stock price?',
      time: '1d',
      avatar: require('../assets/test/avatar-irene.png'),
    },
    {
      id: '3',
      name: 'Bill Gates',
      message: 'Hi, do you want to join our charity event?',
      time: '3d',
      avatar: require('../assets/test/avatar-alyssa.png'),
    },
    {
      id: '4',
      name: 'Mark Zuckerberg',
      message: 'Hey, let’s catch up over a VR coffee',
      time: '1w',
      avatar: require('../assets/test/bot-elonmusk.png'),
    },
    {
      id: '5',
      name: 'Sundar Pichai',
      message: 'Hello, have you tried the latest Google Pixel phone?',
      time: '2w',
      avatar: require('../assets/test/bot-drphil.png'),
    },
  ];
  
  const chatMessages = [
    {
      id: '1',
      sender: 'Francis',
      text: 'Hey',
      image: require('../assets/test/bot-drphil.png'),
      time: '9:30 AM',
      senderAvatar: require('../assets/test/avatar-jeffery.png'),
    },
    {
      id: '2',
      sender: 'Sarah',
      text: 'For sure!',
      time: '9:31 AM',
      senderAvatar: require('../assets/test/avatar-jeffery.png'),
    },
    {
      id: '3',
      sender: 'Sarah',
      text: "Don't forget to bring the documents.",
      time: '9:32 AM',
      senderAvatar: require('../assets/test/avatar-jeffery.png'),
    },
    {
      id: '4',
      sender: 'Francis',
      text: 'Good',
      time: '9:33 AM',
      senderAvatar: require('../assets/test/avatar-jeffery.png'),
    },
  ];

const ChatScreen = () => {
    const navigation = useNavigation();
  const [selectedChat, setSelectedChat] = useState(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new message arrived!', remoteMessage);
      fetchMessages(); // Refresh messages when a new message arrives
    });

    return unsubscribe;
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await apiClient.get('/notifications/messages/');
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await apiClient.post('/notifications/messages/send/', {
        receiver: 'receiver_username', // Replace with dynamic receiver
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error(error);
    }
  };


  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={styles.messageItem} onPress={() => setSelectedChat(item)}>
      <Image source={item.avatar} style={styles.messageAvatar} />
      <View style={styles.messageTextContainer}>
        <Text style={styles.messageName}>{item.name}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  const renderChatMessageItem = ({ item }) => (
    <View style={[styles.chatMessageItem, item.sender === 'Francis' ? styles.sentMessage : styles.receivedMessage]}>
      {item.image && <Image source={item.image} style={styles.chatImage} />}
      <Text style={styles.chatMessageText}>{item.text}</Text>
      <Text style={styles.chatMessageTime}>{item.time}</Text>
      <Image source={item.senderAvatar} style={styles.chatMessageAvatar} />
    </View>
  );

  const closeModal = () => {
    setSelectedChat(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{selectedChat ? 'Chat' : 'Messages'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.modalCloseButton}>Close</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
      </View>
      <FlatList
        data={messagesList}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        style={styles.messagesList}
      />
      {selectedChat && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedChat}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.modalCloseButton}>Close</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Chat with {selectedChat.name}</Text>
              </View>
              <FlatList
                data={chatMessages}
                keyExtractor={(item) => item.id}
                renderItem={renderChatMessageItem}
                style={styles.chatMessages}
              />
              <View style={styles.inputContainer}>
                <TextInput style={styles.input} 
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message" />
                <TouchableOpacity onPress={sendMessage}>
                  <Image source={require('../assets/icons/send.png')} style={styles.sendIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  closeText: {
    fontSize: 18,
    color: '#333',
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  messagesList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageTextContainer: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  messageText: {
    fontSize: 14,
    color: '#888',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FBFAF7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    height: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  modalCloseButton: {
    fontSize: 18,
    color: '#000',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  chatMessages: {
    flex: 1,
  },
  chatMessageItem: {
    marginBottom: 10,
  },
  sentMessage: {
    alignItems: 'flex-end',
  },
  receivedMessage: {
    alignItems: 'flex-start',
  },
  chatImage: {
    width: 200,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  chatMessageText: {
    fontSize: 16,
    color: '#000',
  },
  chatMessageTime: {
    fontSize: 12,
    color: '#888',
  },
  chatMessageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
    marginLeft: 10,
  },
});

export default ChatScreen;
