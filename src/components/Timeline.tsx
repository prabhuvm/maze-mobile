import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { apiClient } from '../api/client';
import PostSummary from './posts/PostSummary';
import AvatarList from './AvatarList';
import Footer from './Footer';
import { useGlobalContext } from '../GlobalContext';
import { Avatar } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostModal from './PostModal';

const samplePost = {
  postid: 1,
  username: 'JohnDoe',
  handle: '@johndoe',
  date: '2023-08-06T14:48:00.000Z',
  content: 'This is a sample post content.',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  videos: [],
  audios: [],
  avatar: 'https://example.com/avatar.jpg',
  comments: 10,
  likes: 25,
  shares: 5,
  creator: {
    username: 'shilpa',
    profile_img: 'https://d391oeqqigkdbo.cloudfront.net/profile-pic/shilpa/shilpa_ipdgacAp.jpg',
  },
  participants: [
    { username: 'JaneDoe', profile_img: 'https://cdn.pixabay.com/photo/2024/02/15/13/55/ai-generated-8575453_1280.png' },
    { username: 'Alice', profile_img: 'https://picsum.photos/id/237/200/300' },
    { username: 'Bob', profile_img: 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ' },
    { username: 'Charlie', profile_img: 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ' },
    { username: 'David', profile_img: 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ' },
    { username: 'Eve', profile_img: 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ' },
    { username: 'Frank', profile_img: 'https://fastly.picsum.photos/id/103/2592/1936.jpg?hmac=aC1FT3vX9bCVMIT-KXjHLhP6vImAcsyGCH49vVkAjPQ' },
  ],
};

interface Post {
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

const HOME_AVATAR_ID = 37;

const TimelineScreen = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [mainScreen, setMainScreen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<{ [key: number]: boolean }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [availableAvatars, setAvailableAvatars] = useState<Avatar[]>([]);
  const { avatarId, setAvatarId, avatars, setAvatars, avatarDict, setAvatarDict, deviceToken } = useGlobalContext();


  const handleHomePress = async () => {
    setAvatarId(HOME_AVATAR_ID);
    console.log("################# Fetching posts for Home: ", avatarId); // Debugging line
  };

  useEffect(() => {
    apiClient.get('/available-avatars')
      .then(response => {
        console.log("Available avatars:", response.data); // Debugging line
        // Add the aggregate avatar at the start of the available avatars list
        setAvailableAvatars([response.data]);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const refreshPosts = async () => {
      setPosts([]); // Clear the posts list before fetching new posts

      const accessToken = await AsyncStorage.getItem('accessToken');
      if (avatarId == HOME_AVATAR_ID) { //TODO: Remove later - test with gemini for post ux
        setMainScreen(true);
        setPosts([samplePost])
        setIsExpanded(false);
        clearTimeout(timer);
      } else {
        setMainScreen(false);
        apiClient.get(`/posts/${avatarId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
          .then(response => {
            console.log("###################### Fetched posts:", response.data); // Debugging line
            setPosts(response.data);
            setIsExpanded(false);
            clearTimeout(timer);
          })
          .catch(error => console.error(error));
      }  
    }
    console.log("######### AvatarId: ", avatarId);
    refreshPosts();
  }, [avatarId]);

  const toggleExpand = (id: number) => {
    setExpandedPosts(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const togglePostModal = async () => {
    setPostModalVisible(!postModalVisible);
  };

  const handleAvatarPress = async (id: number) => {
    setAvatarId(id);
  };

  const handleAddPress = () => {
    navigation.navigate('Collections');
  };

  const addPost = (post) => {
    setPosts([post, ...posts]);
  };

  const handleAvatarSelect = async (avatar: Avatar) => {
    if (!avatars.some(a => a.id === avatar.id)) {
      setAvatars([avatar, ...avatars]);

      setAvatarDict(prevDict => ({
        ...prevDict,
        [avatar.id]: avatar,
      }));

      setAvatarId(avatar.id);
      setModalVisible(false);
    }
  };

  const renderAvailableAvatar = ({ item }: { item: Avatar }) => (
    <TouchableOpacity onPress={() => handleAvatarSelect(item)} style={[styles.avatarContainer, item.id === -1 && styles.aggregateAvatar]}>
      {item.id === -1 ? (
        <Text style={styles.aggregateAvatarText}>All</Text>
      ) : (
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
      )}
      <Text style={styles.username} numberOfLines={1}>{item.username}</Text>
    </TouchableOpacity>
  );

  const filterAvailableAvatars = () => {
    const existingIds = avatars.map(avatar => avatar.id);
    return availableAvatars.filter(avatar => !existingIds.includes(avatar.id));
  };

  const handleExpand = () => {
    console.log("######### Coming from expand: ", avatarId, " ", avatarDict, " ", avatarDict[avatarId], " ############## ", avatarDict[avatarId].username)
    if (isExpanded) {
      setIsExpanded(false);
      clearTimeout(timer);
    } else {
      setIsExpanded(true);
      const newTimer = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
      setTimer(newTimer);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostSummary
      post={item}
      isExpanded={!!expandedPosts[item.postid]}
      toggleExpand={toggleExpand}
    />
  );

  return (
    <View style={styles.container}>
      <AvatarList
        onAvatarPress={handleAvatarPress}
        onAddPress={handleAddPress}
        handleExpand={handleExpand}
        isExpanded={isExpanded}
      />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.postid.toString()}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={filterAvailableAvatars()}
            renderItem={renderAvailableAvatar}
            keyExtractor={item => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.modalList}
          />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {mainScreen && (
      <TouchableOpacity style={styles.fab} onPress={togglePostModal}>
        <Image source={require('../assets/icons/plus.png')} style={styles.fabIcon} />
      </TouchableOpacity>)}

      <Footer homePress={handleHomePress} navigation={navigation} />
      <PostModal visible={postModalVisible} onClose={togglePostModal} addPost={addPost} navigation={navigation} />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  avatarContainer: {
    alignItems: 'center',
    margin: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    marginTop: 5,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalList: {
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 80, // Adjust this value to move the FAB above the footer
    right: 20,
 //   backgroundColor: '#FFD700',
    backgroundColor: '#6200EE',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  aggregateAvatar: {
    backgroundColor: '#EFEFEF', // Set a background color for the aggregate avatar
    padding: 5,
    borderRadius: 50,
  },
  aggregateAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimelineScreen;
