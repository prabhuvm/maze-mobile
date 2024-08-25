import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';

interface PostUsersModalProps {
  visible: boolean;
  onClose: () => void;
  creator: {
    username: string;
    profile_img: string;
  };
  participants: Array<{
    username: string;
    profile_img: string;
  }>;
}

const PostUsersModal: React.FC<PostUsersModalProps> = ({ visible, onClose, creator, participants }) => {
  const navigation = useNavigation();
  const hasCreatorOrParticipants = creator || (participants && participants.length > 0);

  const hasParticipants = (participants && participants.length > 0)

  const handleUserPress = (username: string) => {
    console.log("Navigating to ", username);
    onClose();
    navigation.navigate('Profile', { profileUsername: username });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Image source={require('../../assets/icons/close.png')} style={styles.closeIcon} />
          </TouchableOpacity>

          {hasCreatorOrParticipants && (
            <>
              <Text style={styles.modalTitle}>Created By:</Text>
              <TouchableOpacity onPress={() => handleUserPress(creator.username)} style={styles.userCard}>
                <Image style={styles.modalAvatar} source={{ uri: creator.profile_img }} />
                <Text style={styles.modalUserName}>{creator.username}</Text>
              </TouchableOpacity>
              { hasParticipants && 
              <><Text style={styles.modalTitle}>Participants:</Text>
                <ScrollView contentContainerStyle={styles.participantsList}>
                  {participants.map((participant, index) => (
                    <TouchableOpacity key={index} onPress={() => handleUserPress(participant.username)} style={styles.userCard}>
                      <Image style={styles.modalAvatar} source={{ uri: participant.profile_img }} />
                      <Text style={styles.modalUserName}>{participant.username}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView> 
              </>}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  userCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    width: '30%',
  },
  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  modalUserName: {
    fontSize: 16,
    textAlign: 'center',
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

export default PostUsersModal;
