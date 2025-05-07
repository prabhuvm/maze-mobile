import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { apiClient } from '../api/client';

const PaymentsScreen = () => {
    const navigation = useNavigation();
  const [credits, setCredits] = useState();

  useEffect(() => {
    const getCredits = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await apiClient.get('/credits/', { 
        headers: { 
          Authorization: `Bearer ${accessToken}` 
        }
      }).then(response => {
          console.log("#### Credits:", response.data); // Debugging line
          setCredits(response.data.credits);
      });
    };
    getCredits();
  }, []);

//ToDo: Feed this from backend.
  const purchases = [
    { id: '1', name: 'In-App Purchases', range: '100 - 1,000 coins', image: 'path-to-blog-post-image' },
    { id: '2', name: 'Tournament Particpations', range: '500 - 5,000 coins', image: 'path-to-video-image' },
    { id: '3', name: 'Access Premium Games', range: '10 - 100 coins', image: 'path-to-tweet-image' },
  ];

  const waysToAddCredits = [
    { id: '1', name: 'Invite friends', credits: '+ 50 coins', icon: 'path-to-invite-icon' },
    { id: '2', name: 'Complete levels', credits: '+ 200 coins', icon: 'path-to-levels-icon' },
    { id: '3', name: 'Redeem coupon', credits: '+ 100 coins', icon: 'path-to-coupon-icon' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/backi.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Coins</Text>
        <TouchableOpacity style={styles.settingsButton}>
          {/* <Image source={require('../assets/icons/cog.png')} style={styles.icon} /> */}
        </TouchableOpacity>
      </View>

      <Text style={styles.credits}>You have {credits} coins</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add coins</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.getMoreButton}>
          <Text style={styles.getMoreButtonText}>Get More</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Use coins to purchase</Text>
      {purchases.map(purchase => (
        <View key={purchase.id} style={styles.purchaseContainer}>
          <Image source={{ uri: purchase.image }} style={styles.purchaseImage} />
          <View style={styles.purchaseDetails}>
            <Text style={styles.purchaseName}>{purchase.name}</Text>
            <Text style={styles.purchaseRange}>{purchase.range}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Ways to add coins</Text>
      {waysToAddCredits.map(way => (
        <View key={way.id} style={styles.wayContainer}>
          <Image source={{ uri: way.icon }} style={styles.wayIcon} />
          <View style={styles.wayDetails}>
            <Text style={styles.wayName}>{way.name}</Text>
            <Text style={styles.wayCredits}>{way.credits}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  settingsButton: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    alignSelf: 'center',
    color: '#000',
  },
  credits: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: '#000',
  },
  getMoreButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  getMoreButtonText: {
    fontSize: 18,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  purchaseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
  },
  purchaseImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  purchaseDetails: {
    flex: 1,
  },
  purchaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  purchaseRange: {
    fontSize: 14,
    color: '#888',
  },
  wayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
  },
  wayIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 15,
  },
  wayDetails: {
    flex: 1,
  },
  wayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  wayCredits: {
    fontSize: 14,
    color: '#888',
  },
});

export default PaymentsScreen;
