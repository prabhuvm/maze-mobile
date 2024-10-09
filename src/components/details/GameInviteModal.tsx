import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import DatePicker from 'react-native-date-picker';  // Import the new date picker
import axios from 'axios';  // Axios for making the POST request

const GameInviteModal = ({ visible, onClose, botId, username, botName }) => {
  const [participants, setParticipants] = useState('');
  const [schedule, setSchedule] = useState('now');
  const [showDatePicker, setShowDatePicker] = useState(false);  // Controls visibility of DatePicker
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Generate the title as @username-@botname-datetime
    const currentDate = schedule === 'later' ? selectedDate : new Date(); // Use selectedDate for 'later', or current date for 'now'
    const formattedDate = currentDate.toISOString().split('T')[0];  // Get only date part
    const formattedTime = currentDate.toTimeString().split(' ')[0]; // Get time part
    setTitle(`${botName}-@${username}-${formattedDate}-${formattedTime}`);
  }, [selectedDate, username, botName, schedule]);

  // Handle sending invite
  const handleSendInvite = () => {
    const scheduleTime = schedule === 'later' ? selectedDate : new Date();  // Use current date-time for 'now'
    const data = {
      title: title,
      participants: participants.split(',').map(user => user.trim()),  
      schedule_time: scheduleTime,
    };

    console.log("Scheduling: ", data);
    // POST request to the server
    axios.post('/schedule', data)
      .then(response => {
        console.log('Successfully scheduled:', response.data);
        onClose();
      })
      .catch(error => {
        console.error('Error scheduling:', error);
      });
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
          <Text style={styles.modalTitle}>Invite To Play</Text>

          {/* Title */}
          <Text style={styles.generatedTitle}>{title}</Text>

          {/* Participants Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter participant emails, separated by commas"
            value={participants}
            onChangeText={setParticipants}
          />

          {/* Schedule Option */}
          <Text style={styles.scheduleTitle}>Schedule:</Text>
          <View style={styles.scheduleOptions}>
            {/* "Now" Button */}
            <TouchableOpacity
              style={schedule === 'now' ? styles.selectedOption : styles.option}
              onPress={() => {
                setSchedule('now');
                setShowDatePicker(false);  // Hide date picker when "Now" is selected
              }}
            >
              <Text>Now</Text>
            </TouchableOpacity>

            {/* "Later" Button */}
            <TouchableOpacity
              style={schedule === 'later' ? styles.selectedOption : styles.option}
              onPress={() => {
                setSchedule('later');
                setShowDatePicker(true);  // Show date picker when "Later" is selected
              }}
            >
              <Text>Later</Text>
            </TouchableOpacity>
          </View>

          {/* Inline DatePicker below buttons, only visible when "Later" is selected */}
          {schedule === 'later' && showDatePicker && (
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}  // Handle date change
              mode="datetime"  // Can be "date", "time", or "datetime"
              style={styles.datePicker}  // Optional, add styling
            />
          )}

          {/* Send Invite and Cancel Buttons */}
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
  generatedTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
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
  datePicker: {
    marginTop: 10,  // Adds spacing around DatePicker
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
