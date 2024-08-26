import React from 'react';
import { View, Text, Image, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ShoppingPage = () => {
  const popularItems = [
    { id: '1', name: 'Running Belt', price: '$24.99', image: require('../assets/images/store-images/running-belt.png') },
    { id: '2', name: 'Yoga Mat', price: '$34.99', image: require('../assets/images/store-images/yoga-mat.png') },
    { id: '3', name: 'Sports Water Bottle', price: '$14.99', image: require('../assets/images/store-images/water-bottle.png') },
  ];

  const categories = [
    { id: '1', name: 'Shoes', image: require('../assets/images/store-images/shoes.png') },
    { id: '2', name: 'Home Gym', image: require('../assets/images/store-images/home-gym.png') },
    { id: '3', name: 'Outdoor Gear', image: require('../assets/images/store-images/outdoor-gear.png') },
    { id: '4', name: 'Camping', image: require('../assets/images/store-images/camping.png') },
  ];

  const newArrivals = [
    { id: '1', name: 'Running Watch', price: '$149.99', image: require('../assets/images/store-images/running-watch.png') },
    { id: '2', name: 'Yoga Pants', price: '$54.99', image: require('../assets/images/store-images/yoga-pants.png') },
    { id: '3', name: 'Fitness Tracker', price: '$99.99', image: require('../assets/images/store-images/fitness-tracker.png') },
  ];

  const renderPopularItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryContainer}>
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderNewArrivalItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sports Accessories</Text>
      </View>

      <View style={styles.searchContainer}>
      <Image source={require('../assets/icons/search.png')} style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search for sports accessories" />
      </View>

      <Text style={styles.sectionTitle}>Popular Now</Text>
      <FlatList
        data={popularItems}
        renderItem={renderPopularItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <Text style={styles.sectionTitle}>Shop By Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <Text style={styles.sectionTitle}>New Arrivals</Text>
      <FlatList
        data={newArrivals}
        renderItem={renderNewArrivalItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginRight: 16,
    alignItems: 'center',
    width: 140,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryContainer: {
    marginRight: 16,
    alignItems: 'center',
    width: 140,
  },
  categoryImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
});

export default ShoppingPage;
