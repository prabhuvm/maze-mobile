import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Linking } from 'react-native';

const AuthorizationScreen = ({ navigation, params }) => {
  const handleApprove = () => {
    // Generate an authorization code
    const authCode = 'OAUTH_AUTH_CODE_123'; // Generate this dynamically
    // Redirect back to the third-party app with the authorization code
    Linking.openURL(`myandroidapp://oauth_callback?code=${authCode}`);
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authorize Third-Party App</Text>
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

export default AuthorizationScreen;
