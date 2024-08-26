import React, { useEffect, useState, useRef } from 'react';
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
  const [editableField, setEditableField] = useState(null); // Track which field is editable
  const { username } = useGlobalContext();

  const navigation = useNavigation();

  // Refs for the TextInput components
  const nameInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const dobDayInputRef = useRef(null);
  const dobMonthInputRef = useRef(null);
  const dobYearInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneNumberInputRef = useRef(null);
  const websiteInputRef = useRef(null);

  useEffect(() => {
    fetchProfilePic();
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.get(`/users/${username}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setName(response.data.name);
      setDescription(response.data.description);
      setCity(response.data.place);
      setEmail(response.data.email);
      setPhoneNumber(response.data.phone_number);

      let date_of_birth = response.data.date_of_birth;
      const dob = date_of_birth.split("-");
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
      const response = await apiClient.get(`/users/${username}/user_pic/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Success', 'Profile picture updated successfully');
      fetchProfilePic(); // Fetch the updated profile picture
    } catch (error) {
      console.error('Upload error', error);
      console.log('Upload failed', 'There was an error uploading the photo');
    }
  };

  const handleSaveChanges = async () => {
    const dateOfBirth = `${dobYear}-${dobMonth}-${dobDay}`;
    const accessToken = await AsyncStorage.getItem('accessToken');
    apiClient
      .post(
        `/users/${username}/`,
        { name, description, place: city, phone_number: phoneNumber, email, date_of_birth: dateOfBirth },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        setStatusMessage('Profile updated successfully.');
        navigation.goBack();
      })
      .catch((error) => {
        setStatusMessage('Error updating profile. Please try again.');
        console.error('Error updating profile:', error);
      });
  };

  const handleVerifyEmail = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient
      .post('/users/send-email-code/', { email }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setStatusMessage(response.data.detail);
      })
      .catch((error) => {
        setStatusMessage('Error sending verification code. Please try again.');
        console.error('Error sending verification code:', error);
      });
  };

  const handleFieldEdit = (field, ref) => {
    setEditableField(field);
    setTimeout(() => {
      ref.current.focus();
    }, 100); // Focus the corresponding TextInput
  };

  const handleFieldBlur = (field) => {
    setEditableField(null);
  };

  const handleDateFieldBlur = () => {
    // Only reset editable state for date fields when all have lost focus
    if (
      dobDayInputRef.current.isFocused() ||
      dobMonthInputRef.current.isFocused() ||
      dobYearInputRef.current.isFocused()
    ) {
      return;
    }
    setEditableField(null);
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
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Username</Text>
            <TouchableOpacity onPress={() => handleFieldEdit('username', nameInputRef)}>
              <Image source={require('../assets/icons/pencil.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TextInput
            ref={nameInputRef}
            style={[
              styles.input,
              styles.disabledInput,
              editableField === 'username' ? styles.editableInput : null,
            ]}
            value={username}
            editable={editableField === 'username'}
            onBlur={() => handleFieldBlur('username')}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TouchableOpacity onPress={() => handleFieldEdit('name', nameInputRef)}>
              <Image source={require('../assets/icons/pencil.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TextInput
            ref={nameInputRef}
            style={[
              styles.input,
              editableField === 'name' ? styles.editableInput : null,
            ]}
            placeholder="Full Name"
            value={name}
            editable={editableField === 'name'}
            onChangeText={setName}
            onBlur={() => handleFieldBlur('name')}
          />
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Bio</Text>
            <TouchableOpacity onPress={() => handleFieldEdit('description', descriptionInputRef)}>
              <Image source={require('../assets/icons/pencil.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TextInput
            ref={descriptionInputRef}
            style={[
              styles.input,
              styles.multiLineInput,
              editableField === 'description' ? styles.editableInput : null,
            ]}
            placeholder="Enter bio"
            value={description}
            editable={editableField === 'description'}
            onChangeText={(text) => {
              if (text.length <= 180) setDescription(text);
            }}
            multiline={true}
            maxLength={180}
            onBlur={() => handleFieldBlur('description')}
          />
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Location</Text>
            <TouchableOpacity onPress={() => handleFieldEdit('city', cityInputRef)}>
              <Image source={require('../assets/icons/pencil.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TextInput
            ref={cityInputRef}
            style={[
              styles.input,
              editableField === 'city' ? styles.editableInput : null,
            ]}
            placeholder="Location"
            value={city}
            editable={editableField === 'city'}
            onChangeText={setCity}
            onBlur={() => handleFieldBlur('city')}
          />
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => handleFieldEdit('dob', dobDayInputRef)}>
              <Image source={require('../assets/icons/pencil.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.dobContainer}>
            <TextInput
              ref={dobDayInputRef}
              style={[
                styles.input,
                styles.dobInput,
                editableField === 'dob' ? styles.editableInput : null,
              ]}
              placeholder="DD"
              value={dobDay}
              editable={editableField === 'dob'}
              onChangeText={setDobDay}
              maxLength={2}
              keyboardType="numeric"
              onBlur={handleDateFieldBlur}
            />
            <TextInput
              ref={dobMonthInputRef}
              style={[
                styles.input,
                styles.dobInput,
                editableField === 'dob' ? styles.editableInput : null,
              ]}
              placeholder="MM"
              value={dobMonth}
              editable={editableField === 'dob'}
              onChangeText={setDobMonth}
              maxLength={2}
              keyboardType="numeric"
              onBlur={handleDateFieldBlur}
            />
            <TextInput
              ref={dobYearInputRef}
              style={[
                styles.input,
                styles.dobInput,
                editableField === 'dob' ? styles.editableInput : null,
              ]}
              placeholder="YYYY"
              value={dobYear}
              editable={editableField === 'dob'}
              onChangeText={setDobYear}
              maxLength={4}
              keyboardType="numeric"
              onBlur={handleDateFieldBlur}
            />
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Email</Text>
            <TouchableOpacity onPress={() => handleFieldEdit('email', emailInputRef)}>
              <Image source={require('../assets/icons/pencil.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.emailContainer}>
            <TextInput
              ref={emailInputRef}
              style={[
                styles.input,
                styles.emailInput,
                editableField === 'email' ? styles.editableInput : null,
              ]}
              placeholder="Email"
              value={email}
              editable={editableField === 'email'}
              onChangeText={setEmail}
              onBlur={() => handleFieldBlur('email')}
            />
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyEmail}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TouchableOpacity onPress={() => handleFieldEdit('phoneNumber', phoneNumberInputRef)}>
              <Image source={require('../assets/icons/pencil.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TextInput
            ref={phoneNumberInputRef}
            style={[
              styles.input,
              editableField === 'phoneNumber' ? styles.editableInput : null,
            ]}
            placeholder="Phone Number"
            value={phoneNumber}
            editable={editableField === 'phoneNumber'}
            onChangeText={setPhoneNumber}
            onBlur={() => handleFieldBlur('phoneNumber')}
          />
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Link to Website</Text>
            <TouchableOpacity onPress={() => handleFieldEdit('website', websiteInputRef)}>
              <Image source={require('../assets/icons/pencil.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TextInput
            ref={websiteInputRef}
            style={[
              styles.input,
              editableField === 'website' ? styles.editableInput : null,
            ]}
            placeholder="Website"
            value={website}
            editable={editableField === 'website'}
            onChangeText={setWebsite}
            onBlur={() => handleFieldBlur('website')}
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  icon: {
    width: 16,
    height: 16,
    marginLeft: 5,
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
  editableInput: {
    backgroundColor: '#E0E0E0', //'#e6f7ff', // Light blue color indicating the field is editable
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
