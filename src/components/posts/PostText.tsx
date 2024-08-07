import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface PostTextProps {
  content: string;
  isExpanded: boolean;
  toggleExpand: (id: number) => void;
  postid: number;
}

const PostText: React.FC<PostTextProps> = ({ content, isExpanded, toggleExpand, postid }) => {
  const trimmedText = content.length > 200 ? `${content.substring(0, 200)}... ` : content;

  return (
    <Text style={styles.text}>
      {isExpanded ? content : trimmedText}
      {content.length > 200 && (
        <Text style={styles.moreLessText} onPress={() => toggleExpand(postid)}>
          {isExpanded ? 'less' : 'more'}
        </Text>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    marginBottom: 10,
    fontFamily: 'Roboto-Regular',
  },
  moreLessText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default PostText;
