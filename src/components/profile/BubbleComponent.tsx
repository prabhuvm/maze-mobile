import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';

// Bubble Component
const BubbleComponent = ({ text, onClose }) => {
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.bubbleContainer}>
        <Text style={styles.bubbleText}>{text}</Text>
        <View style={styles.bubbleTail}></View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styles for the bubble
const styles = StyleSheet.create({
  bubbleContainer: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    position: 'absolute',
    top: -40, // Adjust positioning above the info icon
    right: 30, // Adjust positioning relative to the info icon
    zIndex: 10, // Ensure it appears above other elements
  },
  bubbleText: {
    color: '#fff',
    fontSize: 14,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#333', // Same as bubble background color
  },
});

export default BubbleComponent;
