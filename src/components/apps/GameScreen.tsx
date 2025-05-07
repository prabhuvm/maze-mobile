import React from 'react';
import { SafeAreaView } from 'react-native';
import DynamicAppLoader from './DynamicAppLoaderRemote';

const GameScreen = ({ route }) => {
  const { appId, gameId, event } = route.params;

  console.log('event in GameScreen >>>>> ', { appId, gameId, event });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DynamicAppLoader appId={appId} gameId={gameId} event={event} />
    </SafeAreaView>
  );
};

export default GameScreen;