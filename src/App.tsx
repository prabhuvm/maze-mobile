import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect,useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import SignupStep1 from './components/SignupStep1';
import SignupStep2 from './components/SignupStep2';
import EligibilityScreen from './components/EligibilityScreen';
import InterestsScreen from './components/InterestsScreen';
import { GlobalProvider, useGlobalContext } from './GlobalContext';
import AppNavigator from './components/AppNavigator';
import SplashOpen from './components/SplashOpen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import ResetPasswordModal from './components/ResetPasswordModal';
import SearchScreen from './components/SearchScreen'
import StoreScreen from './components/AvatarStoreScreen';
import DetailsScreen from './components/DetailsScreen';
import PaymentsScreen from './components/PaymentsScreen';
import { ThemeProvider } from './styles/ThemeContext';
import SplashLogin from './components/SplashLogin';
import SplashLogout from './components/SplashLogout';
import SplashSignup from './components/SplashSignup'; 
import ExploreScreen from './components/ExploreScreen';
import NotificationScreen from './components/NotificationScreen';
import MessageScreen from './components/MessageScreen';
import ConnectionsScreen from './components/ConnectionsScreen';
import CollectionsScreen from './components/AvatarCollectionsScreen';
import InviteModal from './components/InviteModal';
import GameScreen from './components/apps/GameScreen';

import {
  requestUserPermission,
  getToken,
  handleForegroundMessages,
  handleBackgroundMessages,
  handleNotificationOpenedApp,
  getInitialNotification,
} from './notificationSetup';

const App = () => {

  const Stack = createStackNavigator();

function Routes() {
  return(
    <Stack.Navigator initialRouteName="SplashOpen">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SignupStep1" component={SignupStep1} options={{ headerShown: false }} />
    <Stack.Screen name="SignupStep2" component={SignupStep2} options={{ headerShown: false }} />
    <Stack.Screen name="Eligibility" component={EligibilityScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Interests" component={InterestsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Timeline" component={AppNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="SplashOpen" component={SplashOpen} options={{ headerShown: false }} />
    <Stack.Screen name="SplashLogin" component={SplashLogin} options={{ headerShown: false }} />
    <Stack.Screen name="SplashLogout" component={SplashLogout} options={{ headerShown: false }} />
    <Stack.Screen name="SplashSignup" component={SplashSignup} options={{ headerShown: false }} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ResetPasscode" component={ResetPasswordModal} options={{ headerShown: false }} />
    <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Store" component={StoreScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="GameScreen" component={GameScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Payments" component={PaymentsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Explore" component={ExploreScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Message" component={MessageScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Connections" component={ConnectionsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Collections" component={CollectionsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="InviteModal" component={InviteModal} options={{ headerShown: false }}/>
  </Stack.Navigator>
  );
} 
const {setDeviceToken, setMessages, setNotifications, selectedChat, setChatMessages} = useGlobalContext();

useEffect(() => {
  requestUserPermission();
  getToken(setDeviceToken);

//  const unsubscribeOnMessage = handleForegroundMessages(setNotifications, setMessages, selectedChat, setChatMessages);
  handleBackgroundMessages(setNotifications, setMessages, selectedChat, setChatMessages);
  handleNotificationOpenedApp(setNotifications, setMessages, selectedChat, setChatMessages);
  getInitialNotification(setNotifications, setMessages, selectedChat, setChatMessages);

  // Listen for token refresh
  const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(token => {
    console.log('New Device FCM Token:', token);
    setDeviceToken(token);
  });

  return () => {
 //   unsubscribeOnMessage();
    unsubscribeOnTokenRefresh();
  };
}, []);

  return (
    <GlobalProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Routes/>
        </NavigationContainer>
      </ThemeProvider>
    </GlobalProvider>
  );
};

const AppWrapper = () => (
  <GlobalProvider>
    <App />
  </GlobalProvider>
);

export default AppWrapper;
