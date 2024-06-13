import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';

const UpdateProfileScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const navigation = useNavigation();
  const username = 'username'; // Replace with actual username from context or state

  const handleSaveChanges = () => {
    // Implement the save changes logic here
    // Example API call:
    apiClient.post('/update-profile', { name, description, city, phoneNumber, email, website, instagramUsername })
      .then(response => {
        setStatusMessage('Profile updated successfully.');
      })
      .catch(error => {
        setStatusMessage('Error updating profile. Please try again.');
        console.error('Error updating profile:', error);
      });
  };

  const handleVerifyEmail = () => {
    // Implement the email verification logic here
    // Example API call:
    apiClient.post('/send-verification-code', { email })
      .then(response => {
        setStatusMessage('Verification code sent to your email.');
      })
      .catch(error => {
        setStatusMessage('Error sending verification code. Please try again.');
        console.error('Error sending verification code:', error);
      });
  };

  const handleProfilePicChange = () => {
    // Implement the logic for changing the profile picture
    // Example: open image picker and update profilePic state
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/white-back-arrow.png')} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSaveChanges}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profilePicContainer}>
        <Image source={profilePic || require('../assets/images/human.jpeg')} style={styles.profilePic} />
        <TouchableOpacity onPress={handleProfilePicChange} style={styles.cameraIconContainer}>
          <Text style={styles.editProfileText}>Edit Profile Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={username}
            editable={false}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.multiLineInput]}
            placeholder="Enter bio"
            value={description}
            onChangeText={text => {
              if (text.length <= 180) setDescription(text);
            }}
            multiline={true}
            maxLength={180}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={city}
            onChangeText={setCity}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.emailContainer}>
            <TextInput
              style={[styles.input, styles.emailInput]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyEmail}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Link to Website</Text>
          <TextInput
            style={styles.input}
            placeholder="Website"
            value={website}
            onChangeText={setWebsite}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Instagram Username</Text>
          <TextInput
            style={styles.input}
            placeholder="@username"
            value={instagramUsername}
            onChangeText={setInstagramUsername}
          />
        </View>
      </View>

      {statusMessage ? (
        <Text style={styles.statusMessage}>{statusMessage}</Text>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backArrow: {
    width: 30,
    height: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  saveButton: {
    fontSize: 16,
    color: '#fff',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  cameraIconContainer: {
    marginTop: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    color: '#fff',
    backgroundColor: 'transparent',
  },
  multiLineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: 'transparent',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailInput: {
    flex: 1,
  },
  verifyButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 10,
  },
  verifyButtonText: {
    color: 'black',
    fontSize: 16,
  },
  statusMessage: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
});

export default UpdateProfileScreen;
