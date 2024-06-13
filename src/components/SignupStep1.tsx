import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';

const SignupStep1 = () => {
  const [name, setName] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const [verifyError, setVerifyError] = useState(false);
  const [verifyErrMessage, setVerifyErrMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const validateFields = () => {
    let valid = true;
    let errors = {};

    if (!name) {
      errors.name = 'Name is required';
      valid = false;
    }
    if (!dobMonth || !dobDay || !dobYear) {
      errors.dob = 'Date of birth is required';
      valid = false;
    }
    if (!gender) {
      errors.gender = 'Gender is required';
      valid = false;
    }
    if (!email) {
      errors.email = 'Email is required';
      valid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        errors.email = 'Invalid email address';
        valid = false;
      }
    }

    setErrors(errors);
    return valid;
  };

  const handleNext = () => {
    if (validateFields()) {
      const dateOfBirth = `${dobYear}-${dobMonth}-${dobDay}`;
      setStatusMessage("Processing...");
      apiClient.post('/users/initiate-sign-up/', {
        name,
        email,
        gender,
        date_of_birth: dateOfBirth,
      })
        .then(response => {
          console.log('##################### Login Response: ', response.status, "::",response.data);
          if (response.status === 201) {
            navigation.navigate('SignupStep2', {
              name,
              dobMonth,
              dobDay,
              dobYear,
              gender,
              email,
            });
          } else {
            setVerifyErrMessage("Signup initiation failed.");
            setVerifyError(true);
          }
        })
        .catch(error => {
          console.error(error);
          setVerifyErrMessage("Signup initiation failed.");
          setVerifyError(true);
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/maze.jpeg')} style={styles.logo} />

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={[styles.input, errors.name && styles.errorInput]}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={[styles.input, errors.email && styles.errorInput]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Gender:</Text>
        <View style={styles.radioContainer}>
          <TouchableWithoutFeedback onPress={() => setGender('M')}>
            <View style={styles.radioButton}>
              <View style={gender === 'M' ? styles.radioButtonSelected : styles.radioButtonUnselected} />
              <Text style={styles.radioLabel}>M</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setGender('F')}>
            <View style={styles.radioButton}>
              <View style={gender === 'F' ? styles.radioButtonSelected : styles.radioButtonUnselected} />
              <Text style={styles.radioLabel}>F</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setGender('O')}>
            <View style={styles.radioButton}>
              <View style={gender === 'O' ? styles.radioButtonSelected : styles.radioButtonUnselected} />
              <Text style={styles.radioLabel}>Other</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Date of Birth:</Text>
        <View style={styles.dobContainer}>
          <TextInput
            style={[styles.input, styles.dobInput, errors.dob && styles.errorInput]}
            placeholder="MM"
            value={dobMonth}
            onChangeText={setDobMonth}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.dobInput, errors.dob && styles.errorInput]}
            placeholder="DD"
            value={dobDay}
            onChangeText={setDobDay}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.dobInput, errors.dob && styles.errorInput]}
            placeholder="YYYY"
            value={dobYear}
            onChangeText={setDobYear}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      {!verifyError && <Text style={styles.statusMessage}>{statusMessage}</Text>}
      {verifyError && <Text style={styles.verifyErrMessage}>{verifyErrMessage}</Text>}
      {Object.keys(errors).map((key) => (
        <Text key={key} style={styles.errorText}>{errors[key]}</Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginRight: 5,
    width: 80,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 20,
  },
  dobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  dobInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'black',
    marginRight: 5,
  },
  radioButtonUnselected: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 5,
  },
  radioLabel: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  verifyErrMessage: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
},
statusMessage: {
  color: 'blue',
  textAlign: 'center',
  fontSize: 14,
  marginTop: 5,
},
});

export default SignupStep1;
