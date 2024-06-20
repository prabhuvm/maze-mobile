import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const DetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { bot } = route.params;
  const showStartChat = bot.showStartChat; // Assume this value comes from the bot object

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/backi.png')} style={styles.icon} />
        </TouchableOpacity>
      <Image source={{ uri: bot.image }} style={styles.botImage} />
      <Text style={styles.botName}>{bot.name}</Text>
      <Text style={styles.botDescription}>{bot.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.actionButton, !showStartChat && styles.fullWidthButton]}>
          <Text style={styles.actionButtonText}>Add to Collection</Text>
        </TouchableOpacity>
        {showStartChat && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Start Chat</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.specificationsTitle}>Specifications</Text>
      <View style={styles.specificationsContainer}>
        {bot.specifications.map((spec, index) => (
          <View key={index} style={styles.specification}>
            <Text style={styles.specificationText}>{spec}</Text>
          </View>
        ))}
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
