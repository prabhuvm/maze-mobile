import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ScrollView } from 'react-native';

const trendingBots = [
  {
    id: '1',
    name: 'AI bot - Dr. Phil',
    followers: '1.5K followers',
    image: require('../assets/test/bot-drphil.png'),
  },
  {
    id: '2',
    name: 'AI bot - Elon Musk',
    followers: '2K followers',
    image: require('../assets/test/bot-elonmusk.png'),
  },
  {
    id: '3',
    name: 'AI bot - Taylor Swift',
    followers: '3K followers',
    image: require('../assets/test/bot-taylorswift.png'),
  },
];

const peopleToFollow = [
  {
    id: '1',
    name: 'Irene Lee',
    position: 'Designer @ Google',
    handle: '@irenelee',
    avatar: require('../assets/test/avatar-irene.png'),
  },
  {
    id: '2',
    name: 'Alyssa Penge',
    position: 'Product Manager @ Facebook',
    handle: '@alyssapenge',
    avatar: require('../assets/test/avatar-alyssa.png'),
  },
  {
    id: '3',
    name: 'Jeffery Liu',
    position: 'Investor',
    handle: '@jefferyliu',
    avatar: require('../assets/test/avatar-jeffery.png'),
  },
];

const ExploreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {skip} = route.params;

  const renderTrendingBot = ({ item }) => (
    <View style={styles.trendingBotContainer}>
      <View style={styles.trendingBotTextContainer}>
        <Text style={styles.trendingBotName}>{item.name}</Text>
        <Text style={styles.trendingBotFollowers}>{item.followers}</Text>
      </View>
      <Image source={item.image} style={styles.trendingBotImage} />
    </View>
  );

  const renderPerson = ({ item }) => (
    <View style={styles.personContainer}>
      <Image source={item.avatar} style={styles.personAvatar} />
      <View style={styles.personTextContainer}>
        <Text style={styles.personName}>{item.name}</Text>
        <Text style={styles.personPosition}>{item.position}</Text>
        <Text style={styles.personHandle}>{item.handle}</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Explore</Text>
          {skip && (
          <TouchableOpacity onPress={() => navigation.navigate('SplashSignup')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          )}
        </View>
        <Text style={styles.sectionTitle}>Trending now</Text>
        <FlatList
          data={trendingBots}
          keyExtractor={(item) => item.id}
          renderItem={renderTrendingBot}
          horizontal={false}
        />
        <Text style={styles.sectionTitle}>People to follow</Text>
        <FlatList
          data={peopleToFollow}
          keyExtractor={(item) => item.id}
          renderItem={renderPerson}
          horizontal={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  skipText: {
    fontSize: 18,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginLeft: 10,
  },
  trendingBotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    // backgroundColor: '#fff',
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 5,
  },
  trendingBotImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  trendingBotTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  trendingBotName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  trendingBotFollowers: {
    fontSize: 14,
    color: '#888',
  },
  personContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    // backgroundColor: '#fff',
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 5,
  },
  personAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  personTextContainer: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  personPosition: {
    fontSize: 14,
    color: '#888',
  },
  personHandle: {
    fontSize: 14,
    color: '#888',
  },
  followButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  followButtonText: {
    fontSize: 14,
    color: '#000',
  },
});

export default ExploreScreen;
