// Footer.tsx
import React, { useState }  from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import PostModal from './PostModal';
import EmailVerificationModal from './EmailVerificationModal';
import { useGlobalContext } from '../GlobalContext';
import { useTheme } from '../styles/ThemeContext';


const Footer = ({navigation, addPost, homeFn}) => {

  const [postModalVisible, setPostModalVisible] = useState(false);
  const [verifyVisible, setVerifyVisible] = useState(false);
  const {username} = useGlobalContext();
  const { theme } = useTheme();

  const togglePostModal = () => {
    setPostModalVisible(!postModalVisible);
  };

  const toggleVerifyModal = () => {
    setVerifyVisible(!verifyVisible);
  };

  const toggleModals = async () => {

    togglePostModal();
    // TODO : Enable following code to do completion of verification check before user is able to post.
    // const accessToken = await AsyncStorage.getItem('accessToken');
    // console.log("########################  isVerifieid access token: ", accessToken);
    //   const response = await apiClient.get('/users/is-verified/', { headers: { Authorization: `Bearer ${accessToken}`} });
    //   console.log("########################  isVerifieid response: ", response.data);

    //   if(response.status === 200 && response.data.verified === true) {
    //       togglePostModal();
    //   } else {
    //     toggleVerifyModal();
    //   }
  }

  const FooterComponent =
    <>
    <View style={[styles.footerContainer, {backgroundColor: theme.background}]}>
      <TouchableOpacity style={styles.iconButton} onPress={homeFn}>
        <Image source={require('../assets/icons/home.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Store')}>
        <Image source={require('../assets/icons/store.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={toggleModals}>
      <Image source={require('../assets/icons/plus.png')} style={styles.icon} />
        </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Chat')}>
        <Image source={require('../assets/icons/bell.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Events')}>
        <Image source={require('../assets/icons/message.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
    <EmailVerificationModal visible={verifyVisible} onClose={toggleVerifyModal} username={username} navigation={navigation} />
    <PostModal visible={postModalVisible} onClose={togglePostModal} addPost={addPost} navigation={navigation} />
    </>
    //console.log("############# Footer Component::: ", FooterComponent)
  return(FooterComponent);
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  iconButton: {
    marginHorizontal: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default Footer;
