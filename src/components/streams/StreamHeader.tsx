import React from 'react';
import { View, Text, TouchableOpacity, Image, Switch, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StreamHeader = ({ isDarkTheme, toggleTheme }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={
            isDarkTheme
              ? require('../../assets/icons/backw.png')
              : require('../../assets/icons/backt.png')
          }
          style={styles.backButton}
        />
      </TouchableOpacity>
      <Text style={[styles.title, { color: isDarkTheme ? '#FFFFFF' : '#000000' }]}>Maze TV</Text>
      <Switch
        value={isDarkTheme}
        onValueChange={toggleTheme}
        style={styles.themeSwitch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  themeSwitch: {
    marginRight: 10,
  },
});

export default StreamHeader;
