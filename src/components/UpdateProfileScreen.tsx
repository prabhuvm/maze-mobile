import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';
import { ImageLibraryOptions, MediaType, launchImageLibrary } from 'react-native-image-picker';
import { useGlobalContext } from '../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateProfileScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [photo, setPhoto] = useState(null);
  const {username} = useGlobalContext();

  const navigation = useNavigation();

  useEffect(() => {
    // Fetch the current profile picture when the component mounts
    fetchProfilePic();
    fetchUserDetails();
    
  }, []);

  const fetchUserDetails = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.get(`/users/${username}/`, 
      { headers: { 
        Authorization: `Bearer ${accessToken}` 
      } });
      setName(response.data.name);
      setDescription(response.data.description);
      setCity(response.data.place);
      setEmail(response.data.email);
      setPhoneNumber(response.data.phone_number);

      let date_of_birth = response.data.date_of_birth;
      console.log("Date of birth: ", date_of_birth);
      const dob = date_of_birth.split("-");
      console.log("Date of birth: ", dob);

      setDobYear(dob[0]);
      setDobMonth(dob[1]);
      setDobDay(dob[2]);

    } catch (error) {
      console.error('Failed to fetch user details', error);
    }
  };

  const fetchProfilePic = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.get(`/users/${username}/user_pic/`, 
      { headers: { 
        Authorization: `Bearer ${accessToken}` 
      } }
      );
      setProfilePic({ uri: response.data.url });
    } catch (error) {
      console.error('Failed to fetch profile picture', error);
    }
  };

  const handleProfilePicChange = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setPhoto(source);
        uploadPhoto(source);
      }
    });
  };

  const uploadPhoto = async (photo) => {
    const formData = new FormData();
    formData.append('user_pic', {
      uri: photo.uri,
      type: 'image/jpeg',
      name: 'profile_pic.jpg',
    });

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.post(`/users/${username}/user_pic/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}` 
        },
      });
      console.log('Success', 'Profile picture updated successfully');
      fetchProfilePic(); // Fetch the updated profile picture
    } catch (error) {
      console.error('Upload error', error);
      console.log('Upload failed', 'There was an error uploading the photo');
    }
  };

  const handleSaveChanges = async() => {
    // Implement the save changes logic here
    // Example API call:
    const dateOfBirth = `${dobYear}-${dobMonth}-${dobDay}`;
    const accessToken = await AsyncStorage.getItem('accessToken');
    apiClient.post(`/users/${username}/`, { name, description, place:city, phone_number:phoneNumber, email,  date_of_birth: dateOfBirth},
    { headers: { 
      Authorization: `Bearer ${accessToken}` 
    } }
    )
      .then(response => {
        setStatusMessage('Profile updated successfully.');
        navigation.goBack();
      })
      .catch(error => {
        setStatusMessage('Error updating profile. Please try again.');
        console.error('Error updating profile:', error);
      });
  };

  const handleVerifyEmail = async () => {
 
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.post('/users/send-email-code/', { email }, 
    { headers: { 
      Authorization: `Bearer ${accessToken}` 
    } }
    )
      .then(response => {
        setStatusMessage(response.data.detail);
      })
      .catch(error => {
        setStatusMessage('Error sending verification code. Please try again.');
        console.error('Error sending verification code:', error);
      });
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/backi.png')} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSaveChanges}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profilePicContainer}>
        <Image source={profilePic || require('../assets/images/human.jpeg')} style={styles.profilePic} />
        <TouchableOpacity onPress={handleProfilePicChange} style={styles.editProfileButton}>
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

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.dobContainer}>
            <TextInput
              style={[styles.input, styles.dobInput]}
              placeholder="DD"
              value={dobDay}
              onChangeText={setDobDay}
              maxLength={2}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.dobInput]}
              placeholder="MM"
              value={dobMonth}
              onChangeText={setDobMonth}
              maxLength={2}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.dobInput]}
              placeholder="YYYY"
              value={dobYear}
              onChangeText={setDobYear}
              maxLength={4}
              keyboardType="numeric"
            />
          </View>
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
    backgroundColor: '#FBFAF7',
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
    color: '#000',
  },
  saveButton: {
    fontSize: 16,
    color: '#000',
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
  editProfileButton: {
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
    color: '#000',
    marginBottom: 10,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    color: '#000',
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
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 10,
  },
  verifyButtonText: {
    color: '#000',
    fontSize: 16,
  },
  statusMessage: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
  dobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dobInput: {
    width: '30%',
  },
});

export default UpdateProfileScreen;
