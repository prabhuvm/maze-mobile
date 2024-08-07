import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { format, isToday, isThisYear, parseISO } from 'date-fns';

interface PostHeaderProps {
  username: string;
  date: string;
  avatar: string;
  creator?: {
    username: string;
    profile_img: string;
  };
  participants?: Array<{
    username: string;
    profile_img: string;
  }>;
}

const ParticipantsStack: React.FC<{ creator?: any; participants?: any[] }> = ({ creator, participants = [] }) => {
  const maxVisibleParticipants = 4;
  const displayedParticipants = participants.slice(0, maxVisibleParticipants);
  const extraParticipants = participants.length - maxVisibleParticipants;

  return (
    <View style={styles.stackContainer}>
      <Image
        source={{ uri: creator.profile_img }}
        style={[styles.participantImage, { left: 0, zIndex: displayedParticipants.length + 1 }]}
      />
      {displayedParticipants.map((user, index) => (
        <Image
          key={index}
          source={{ uri: user.profile_img }}
          style={[styles.participantImage, { left: (index + 1) * 15, zIndex: displayedParticipants.length - index }]}
        />
      ))}
      {extraParticipants > 0 && (
        <View style={[styles.extraParticipants, { left: (displayedParticipants.length + 1) * 15, zIndex: 0 }]}>
          <Text style={styles.extraParticipantsText}>+{extraParticipants}</Text>
        </View>
      )}
    </View>
  );
};

const PostHeader: React.FC<PostHeaderProps> = ({ username, date, avatar, creator, participants = [] }) => {
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    if (isThisYear(date)) {
      return format(date, 'd MMM');
    }
    return format(date, 'd MMM yyyy');
  };

  const hasCreatorOrParticipants = creator || (participants && participants.length > 0);

  return (
    <View style={styles.postHeader}>
      <Image style={styles.avatar} source={require('../../assets/images/robot.gif')} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{username}</Text>
        <Text style={styles.postDate}>{formatDate(date)}</Text>
      </View>
      {hasCreatorOrParticipants && (
        <View style={styles.participantsContainer}>
          <Text style={styles.withText}>with</Text>
          <ParticipantsStack creator={creator} participants={participants} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    color: '#000',
  },
  postDate: {
    fontSize: 14,
    color: '#888',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 40,
    paddingRight: 20,
  },
  withText: {
    fontStyle: 'italic',
    marginRight: 5,
  },
  stackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
  },
  extraParticipants: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraParticipantsText: {
    color: '#555',
    fontWeight: 'bold',
  },
});

export default PostHeader;
