import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../GlobalContext';

interface AvatarListProps {
  onAvatarPress: (id: number) => void;
  onAddPress: () => void;
  handleExpand: () => void;
  isExpanded: boolean;
}

const AvatarList: React.FC<AvatarListProps> = ({ onAvatarPress, onAddPress, isExpanded, handleExpand }) => {
  const { avatarId, avatars, avatarDict } = useGlobalContext();

  const renderCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => onAvatarPress(category.id)}
      style={[
        styles.category,
        avatarId === category.id && styles.selectedCategory
      ]}
    >
      <Image source={require(`../assets/images/robot.gif`)} style={styles.categoryIcon} />
      <Text style={[
        styles.categoryText,
        avatarId === category.id && styles.selectedCategoryText
      ]}>
        {category.username}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.pinnedContainer}>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Image source={require('../assets/icons/bplus.png')} style={styles.addIcon} />
      </TouchableOpacity>
      {!isExpanded && (
        <TouchableOpacity style={[styles.category, styles.selectedCategory]} onPress={handleExpand}>
          <Image source={require(`../assets/images/robot.gif`)} style={styles.categoryIcon} />
          <Text style={[styles.categoryText, styles.selectedCategoryText]}>
            {avatarId && avatarDict[avatarId]?.username ? avatarDict[avatarId].username : 'No-Avatar'}
          </Text>
        </TouchableOpacity>
      )}
      {isExpanded && (
        <ScrollView horizontal style={styles.categoryContainer} showsHorizontalScrollIndicator={false}>
          {avatars.map(renderCategory)}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  pinnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  addIcon: {
    width: 36,
    height: 36,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingRight: 15,
    paddingLeft: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: '#333',
  },
  categoryIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 10,
  },
  categoryText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAvatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#dcdcdc',
  },
  selectedAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: 'blue',
    borderWidth: 3,
  },
  halo: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
  },
  username: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  addAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AvatarList;
