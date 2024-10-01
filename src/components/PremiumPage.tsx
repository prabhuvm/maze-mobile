import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';

const PremiumMembershipScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/close.png')} style={styles.closeIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Premium</Text>
      </View>

      <Image source={require('../assets/images/premium_page.png')} style={styles.bannerImage} />

      <Text style={styles.heading}>Get more from your gaming membership</Text>

      <View style={styles.featuresContainer}>
        <View style={styles.featureBox}>
          <Image source={require('../assets/icons/controller.png')} style={styles.featureIcon} />
          <Text style={styles.featureTitle}>New Games</Text>
          <Text style={styles.featureSubtitle}>Unlimited access to new games</Text>
        </View>
        <View style={styles.featureBox}>
          <Image source={require('../assets/icons/discounts.png')} style={styles.featureIcon} />
          <Text style={styles.featureTitle}>Discounts</Text>
          <Text style={styles.featureSubtitle}>Exclusive discounts</Text>
        </View>
      </View>

      <View style={styles.planContainer}>
        <TouchableOpacity
          style={[
            styles.planBox,
            selectedPlan === 'monthly' && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <Text style={styles.planTitle}>Monthly plan</Text>
          <Text style={styles.planPrice}>$14.99</Text>
          <Text style={styles.planSubtitle}>Cancel anytime</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.planBox,
            selectedPlan === 'yearly' && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan('yearly')}
        >
          <Text style={styles.planTitle}>Yearly plan</Text>
          <Text style={styles.planPrice}>$149.99</Text>
          <Text style={styles.planSubtitle}>Best value</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.planBox,
            selectedPlan === 'lifetime' && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan('lifetime')}
        >
          <Text style={styles.planTitle}>Lifetime plan</Text>
          <Text style={styles.planPrice}>
            $349.99 <Text style={styles.discountTag}>Save 30%</Text>
          </Text>
          <Text style={styles.planSubtitle}>One-time payment</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Credit card number"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />

      <View style={styles.paymentInfo}>
        <Image source={require('../assets/icons/lock.png')} style={styles.paymentIcon} />
        <Text style={styles.paymentText}>Secure payments</Text>
      </View>

      <TouchableOpacity style={styles.trialButton}>
        <Text style={styles.trialButtonText}>Start my free trial now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  closeIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureBox: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featureSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  planContainer: {
    marginBottom: 20,
  },
  planBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: '#6200EE',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  discountTag: {
    backgroundColor: '#FFCC00',
    color: '#000',
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  planSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  input: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  paymentText: {
    fontSize: 16,
    color: '#666',
  },
  trialButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  trialButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PremiumMembershipScreen;
