import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const GameInviteModal = ({ visible, onClose, botId }) => {
  const [participants, setParticipants] = useState('');
  const [schedule, setSchedule] = useState('now');

  const handleSendInvite = () => {
    console.log(`Sending invite for botId: ${botId} to participants: ${participants} scheduled: ${schedule}`);
    onClose();
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
          <Text style={styles.modalTitle}>Invite Participants</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter participant emails"
            value={participants}
            onChangeText={setParticipants}
          />

          <Text style={styles.scheduleTitle}>Schedule:</Text>
          <View style={styles.scheduleOptions}>
            <TouchableOpacity
              style={schedule === 'now' ? styles.selectedOption : styles.option}
              onPress={() => setSchedule('now')}
            >
              <Text>Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={schedule === 'later' ? styles.selectedOption : styles.option}
              onPress={() => setSchedule('later')}
            >
              <Text>Later</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSendInvite}>
              <Text style={styles.buttonText}>Send Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scheduleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#FFD700',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default GameInviteModal;
