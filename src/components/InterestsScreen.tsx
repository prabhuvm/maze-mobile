import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../GlobalContext';

const InterestsScreen = () => {
  const [interestsData, setInterestsData] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigation = useNavigation();
  const {username} = useGlobalContext();

  useEffect(() => {
    apiClient.get('/interests')
      .then(response => setInterestsData(response.data))
      .catch(error => console.error(error));
  }, []);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const saveInterests = () => {
    console.log("########## Selected Interests: ", selectedInterests)
    const accessToken = AsyncStorage.getItem('accessToken');
    const modifiedInterests = selectedInterests.map(item => ({ interest: item.id })) 
    apiClient.post(`/interests/${username}/`, modifiedInterests 
    // ,{
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`
    //   }}
    )
      .then(response => {
        if (response.status === 201) {
          navigation.navigate('Eligibility');
        } else {
          alert('Failed to save interests');
        }
      })
      .catch(error => console.error(error));
  };

  const renderInterest = (interest) => (
    <TouchableOpacity
      key={interest}
      style={[styles.interestTag, selectedInterests.includes(interest) && styles.selectedInterestTag]}
      onPress={() => toggleInterest(interest)}
    >
      <Text style={styles.interestText}>{interest.name}</Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <View key={item.category} style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.icon} {item.name}</Text>
      <View style={styles.interestsContainer}>
        {item.interests.map(interest => renderInterest(interest))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={interestsData}
          renderItem={renderCategory}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.flatListContent}
        />
      </ScrollView>
      <TouchableOpacity style={styles.nextButton} onPress={saveInterests}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 70, // To ensure content is not hidden behind the button
  },
  flatListContent: {
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  selectedInterestTag: {
    backgroundColor: '#d0e0ff',
  },
  interestText: {
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default InterestsScreen;
