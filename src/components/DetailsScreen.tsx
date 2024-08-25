import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { apiClient } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../GlobalContext';

const DetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { bot } = route.params;
  const {username} = useGlobalContext();
  const [botAdded, setBotAdded] = useState(false);  //ToDo : move this to common


  useEffect(() => {
    const fetchCollections = async() => { //TODO: Move this to common
      const accessToken = await AsyncStorage.getItem('accessToken');
      await apiClient.get(`/users/${username}/agents/`,  
        { headers: { 
          Authorization: `Bearer ${accessToken}` 
       }})
        .then(response => {
          console.log("## Agents recieved: ", response.data);
          console.log("## Current agent: ", bot.id)

          const botDictionary = response.data.reduce((acc, avatar) => {
            console.log("@@ Adding ", avatar.id);
            acc[avatar.id] = avatar;
            return acc;
          }, {});

          setBotAdded(bot.id in botDictionary);
        })
        .catch(error => {
          console.error('Error following:', error);
        });
    }
    fetchCollections();
  }, []);

  const gotToChat = (id : string) => {
    // console.log("Bot val: ", bot)
    // if(bot.chat == 1) {
    // navigation.navigate("AvatarChat", {bot : bot});
    // } else {
    navigation.navigate("GameScreen", {appId : bot.agent_id});

  }

  const addToCollection = async() => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.post(`/users/${username}/agents/`, {
        agent:bot.id
      }, { headers: { 
        Authorization: `Bearer ${accessToken}` 
     }})
      .then(response => {
        setBotAdded(true);
        console.log('Added successfully!'); //Todo: change button to Remove and also implement delete function.
      })
      .catch(error => {
        console.error('Error following:', error);
      });
  }


  const removeFromCollection = async() => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    await apiClient.delete(`/users/${username}/agents/${bot.id}`, 
      { headers: { 
        Authorization: `Bearer ${accessToken}` 
     }})
      .then(response => {
        setBotAdded(false);
        console.log('Removed successfully!'); //Todo: change button to Remove and also implement delete function.
      })
      .catch(error => {
        console.error('Error following:', error);
      });
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/backi.png')} style={styles.icon} />
        </TouchableOpacity>
      <Image source={{ uri: bot.app_screenshot_url }} style={styles.botImage} />
      <Text style={styles.botName}>{bot.name}</Text>
      <Text style={styles.botDescription}>{bot.description}</Text>
      <View style={styles.buttonContainer}>
        {botAdded == true ? 
        (<TouchableOpacity style={styles.actionButton} onPress={() => removeFromCollection()} >
            <Text style={styles.actionButtonText}>Remove from Collection</Text>
          </TouchableOpacity>) : 
          (<TouchableOpacity style={styles.actionButton} onPress={() => addToCollection()} >
          <Text style={styles.actionButtonText}>Add to Collection</Text>
        </TouchableOpacity>)}

        <TouchableOpacity onPress={gotToChat} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Run Application</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.specificationsTitle}>Specifications</Text>
      <View style={styles.specificationsContainer}>
        {/* {bot.specifications.map((spec, index) => (
          <View key={index} style={styles.specification}>
            <Text style={styles.specificationText}>{spec}</Text>
          </View>
        ))} */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
    padding: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  botImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  botName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  botDescription: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#000',
  },
  fullWidthButton: {
    flex: 0,
    width: '100%',
  },
  specificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  specificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specification: {
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  specificationText: {
    fontSize: 14,
    color: '#000',
  },
});

export default DetailsScreen;
