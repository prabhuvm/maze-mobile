import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import PostModal from './PostModal';
import EmailVerificationModal from './EmailVerificationModal';
import { useGlobalContext } from '../GlobalContext';
import { useTheme } from '../styles/ThemeContext';

const Footer = ({ navigation, addPost, homeFn }) => {
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [verifyVisible, setVerifyVisible] = useState(false);
  const { username } = useGlobalContext();
  const { theme } = useTheme();

  const togglePostModal = () => {
    setPostModalVisible(!postModalVisible);
  };

  const toggleVerifyModal = () => {
    setVerifyVisible(!verifyVisible);
  };

  const toggleModals = async () => {
    togglePostModal();
    // Uncomment the following code to enable verification check before user can post
    // const accessToken = await AsyncStorage.getItem('accessToken');
    // const response = await apiClient.get('/users/is-verified/', { headers: { Authorization: `Bearer ${accessToken}`} });
    // if(response.status === 200 && response.data.verified === true) {
    //     togglePostModal();
    // } else {
    //   toggleVerifyModal();
    // }
  };

  return (
    <>
      <View style={[styles.footerContainer, { backgroundColor: theme.background }]}>
        <TouchableOpacity style={styles.iconButton} onPress={homeFn}>
          <Image source={require('../assets/icons/home.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Store')}>
          <Image source={require('../assets/icons/store.png')} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.dummyIconButton}>
          <Image source={require('../assets/icons/plus.png')} style={[styles.icon, styles.invisibleIcon]} />
        </View>
        <View style={styles.centerIconWrapper}>
          <TouchableOpacity style={styles.centerIconButton} onPress={toggleModals}>
            <Image source={require('../assets/icons/plus.png')} style={styles.centerIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.dummyIconButton}>
          <Image source={require('../assets/icons/plus.png')} style={[styles.icon, styles.invisibleIcon]} />
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Message')}>
          <Image source={require('../assets/icons/message.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notification')}>
          <Image source={require('../assets/icons/bell.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <EmailVerificationModal visible={verifyVisible} onClose={toggleVerifyModal} username={username} navigation={navigation} />
      <PostModal visible={postModalVisible} onClose={togglePostModal} addPost={addPost} navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  dummyIconButton: {
    flex: 1,
    alignItems: 'center',
  },
  invisibleIcon: {
    opacity: 0,
  },
  centerIconWrapper: {
    position: 'absolute',
    bottom: 15,
    left: '50%',
    transform: [{ translateX: -30 }],
    zIndex: 10,
  },
  centerIconButton: {
    backgroundColor: '#000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  centerIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
});

export default Footer;
