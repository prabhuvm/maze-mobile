import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import SettingsModal from './SettingsModal';
import { useTheme } from '../styles/ThemeContext';

const CustomDrawerHeader = ({ navigation }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [keywords, setKeywords] = useState('');
  const {theme} = useTheme();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSearch = () => {
    navigation.navigate("Search", { keywords });
  };

  return (
    <>
      <View style={[styles.headerContainer, {backgroundColor: theme.background}]}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.openDrawer()}>
            <Image source={require('../assets/icons/human.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.middleSection}>
          {searchVisible ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                onBlur={() => setSearchVisible(false)}
                value={keywords}
                onChangeText={setKeywords}
              />
              <TouchableOpacity style={styles.goButton} onPress={handleSearch}>
                <Text style={styles.goButtonText}>Go</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setSearchVisible(true)}>
              <Text style={styles.searchPlaceholder}>Search...</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleModal}>
            <Image source={require('../assets/icons/cog.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <SettingsModal visible={modalVisible} onClose={toggleModal} navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 50, // Set a fixed height for the header
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  middleSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 5,
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginLeft: 15,
    flex: 1,
  },
  searchPlaceholder: {
    color: '#aaa',
  },
  icon: {
    width: 20,
    height: 20,
  },
  goButton: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 25,
  },
  goButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CustomDrawerHeader;
