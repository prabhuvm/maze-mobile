import React from 'react';
import { SafeAreaView } from 'react-native';
import DynamicAppLoader from './DynamicAppLoaderWebView';

const GameScreen = ({ route }) => {
  const { appId } = route.params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DynamicAppLoader appId={appId} />
    </SafeAreaView>
  );
};

export default GameScreen;