import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Linking } from 'react-native';

const ApprovePage = ({ navigation }) => {
  const handleApprove = () => {
    const token = 'sample_token_123'; // Token to send back
    Linking.openURL(`myandroidapp://callback?token=${token}`);
    navigation.goBack(); // Close the page after approval
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approve the Request</Text>
      <Button title="Approve" onPress={handleApprove} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ApprovePage;
