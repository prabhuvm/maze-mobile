import { useNavigation, useRoute } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Modal, ScrollView, Keyboard } from 'react-native';
import { apiClient } from '../api/client';
import { useGlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types';
import { handleForegroundMessages } from '../notificationSetup';

const MessageScreen = () => {
    const navigation = useNavigation();
    const [newMessage, setNewMessage] = useState('');
    const {messages, setMessages, selectedChat, setSelectedChat, selectedChatRef, chatMessages, setChatMessages, username, setNotifications} = useGlobalContext();
    const [otherUser, setOtherUser] = useState('');
    const [messageList, setMessageList] = useState<Message[]>([])

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

    const route = useRoute();
    const flatListRef = useRef(null);
    const {fusername} = route.params

  useEffect(() => {
    console.log("Triggered useEffect")
    if(username != fusername) {
      // setOtherUser(fusername);
      setChatOpen(fusername);
    } else {
      setChatClose();
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    const unsubscribeOnMessage = handleForegroundMessages(setNotifications, setMessages, selectedChatRef, setChatMessages);

    // Clean up the subscription on unmount
    return () => unsubscribeOnMessage();
  }, [selectedChatRef]); //TODO: move ref to value itself as trigger point is on value which should be available.

  const toMessageList = () => { 
    setMessageList(Object.values(messages));
  }

  useEffect(() => {
    console.log("Triggered useEffect - messages")
    toMessageList();
  }, [messages]);

  // Scroll to end when modal opens
  useEffect(() => {
    console.log("Triggered useEffect - selectedChat")
    if (selectedChat && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [selectedChat]);

  // Scroll to end when a new message is added
  useEffect(() => {
    console.log("Triggered useEffect - chatMessages ")
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);



  const handleSearch = async () => {
    console.log("Handling search for ", searchQuery);
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.get(`/users/search/`, 
    { 
      params: { keywords:searchQuery }, 
      headers: { 
        Authorization: `Bearer ${accessToken}` 
      } 
    }).then(response => {
      console.log("Chat Search results: ", response.data);
      const filteredResults = response.data.filter(item => item.username !== username);
      setSearchResults(filteredResults);
      setSearchQuery('');
      setIsSearchModalVisible(true);
    })
    .catch(error => console.error('Error fetching people:', error));
  };

  const handleSelectName = (name) => {
    setChatOpen(name);
    setIsSearchModalVisible(false);
    // Open chat window logic here
    console.log(`Chat window opened for ${name}`);
  };


  const fetchChatMessages = async (name) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await apiClient.get(`/notifications/messages/${name}`, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      console.log("Chat Messages fetched: ", response.data);
      setChatMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchMessages = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await apiClient.get('/notifications/messages/', 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      console.log("Messages fetched: ", response.data);

      const messageDictionary = response.data.reduce((acc, message) => {
        if (!acc[message.username] || acc[message.username].id <= message.id) {
          acc[message.username] = message;
        }
        return acc;
      }, {});
      setMessages(messageDictionary);

    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await apiClient.post('/notifications/messages/send/', {
        receiver: otherUser, 
        content: newMessage,
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setNewMessage('');

      const messageToUpdate = 
      {avatar: "", 
        id: messages[otherUser] ? messages[otherUser].id + 1 : 1, 
        message: newMessage, 
        name: messages[otherUser] ? messages[otherUser].name : otherUser, 
        sender: username, 
        time: "0m", 
        username: otherUser
      }


      setMessages(prevMessages => {
        const existingMessage = prevMessages[messageToUpdate.username];
        // Check if the message should be updated based on the id
        if (!existingMessage || existingMessage.id <= messageToUpdate.id) {
          return {
            ...prevMessages,
            [messageToUpdate.username]: messageToUpdate,
          };
        }
        // Return the previous state if no update is needed
        return prevMessages;
      });

      
      if(selectedChat.trim() == messageToUpdate.username) {
        console.log("New arrived message: ", messageToUpdate);
        setChatMessages(prevMessages => [
          ...prevMessages,
          messageToUpdate,
        ]);
      }


     // fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error(error);
    }
  };

  const setChatClose = () => {
    console.log("Closing chat screen for ###$ ", selectedChat)
    setOtherUser('');
    setSelectedChat('');
    setChatMessages([]);
  };

  const setChatOpen = async (name) => {
    console.log("Opening chat screen for ###$ ", name); //TODO: Strange removing this causing issue.
    setOtherUser(name);
    setSelectedChat(name);
    fetchChatMessages(name);
  };

  const closeMessageScreen = () => {
    console.log("Closing message screen")
    setChatClose();
    navigation.goBack();
  }


  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={styles.messageItem} onPress={() => setChatOpen(item.username)}>
      <Image source={item.avatar ? { uri: item.avatar } :require('../assets/images/human.jpeg')} style={styles.messageAvatar} />
      <View style={styles.messageTextContainer}>
        <Text style={styles.messageName}>{item.name}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  const renderChatMessageItem = ({ item }) => (
    <View style={[styles.chatMessageItem, item.sender === username ? styles.sentMessage : styles.receivedMessage]}>
      {item.image && <Image source={item.image} style={styles.chatImage} />}
      <Text style={[styles.chatMessageText, item.sender === username ? styles.sentMessageText : styles.receivedMessageText]}>{item.message}</Text>
      <Text style={styles.chatMessageTime}>{item.time}</Text>
      <Image source={item.senderAvatar ? { uri: item.senderAvatar } : require('../assets/images/human.jpeg')} style={styles.chatMessageAvatar} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{selectedChat ? 'Chat' : 'Messages'}</Text>
        <TouchableOpacity onPress={() => closeMessageScreen()}>
            <Text style={styles.modalCloseButton}>Close</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Find People"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={styles.goButton} onPress={handleSearch}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={messageList}
        keyExtractor={(item) => item.username}
        renderItem={renderMessageItem}
        style={styles.messagesList}
      />
      {selectedChat && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedChat}
          onRequestClose={setChatClose}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={setChatClose}>
                  <Text style={styles.modalCloseButton}>Close</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Chat with {otherUser}</Text>
              </View>
              <FlatList
                ref={flatListRef}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSearchModalVisible}
        onRequestClose={() => setIsSearchModalVisible(false)}
      >
        <View style={styles.searchModalBackground}>
          <View style={styles.searchModalContainer}>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.username}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectName(item.username)}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setIsSearchModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1, 
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },

  goButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  goButtonText: {
    color: '#fff',
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
    height: '95%',
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
  sentMessageText: {
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  receivedMessageText: {
  },
  chatImage: {
    width: 200,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  chatMessageText: {
    padding:10,
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

  searchModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  resultItem: {
    padding: 10,
  },
  closeButton: {
    marginTop: 10,
    textAlign: 'center',
    color: 'blue',
  },
});

export default MessageScreen;
