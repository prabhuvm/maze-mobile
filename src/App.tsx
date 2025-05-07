import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import SignupStep from './components/SignupStep';
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
import StreamScreen from './components/streams/StreamScreen-YT';
import CommunityDetailsPage from './components/community/CommunityDetailsPage';
import GameStoreScreen from './components/GameStoreScreen';
import {
  requestUserPermission,
  getToken,
  handleForegroundMessages,
  handleBackgroundMessages,
  handleNotificationOpenedApp,
  getInitialNotification,
} from './notificationSetup';
import TournamentsScreen from './components/TournamentsScreen';
import ShoppingPage from './components/bkp/ShoppingPage';
import SettingsScreen from './components/SettingsScreen';
import CommunitiesScreen from './components/community/CommunitiesScreen';
import LeaderboardScreen from './components/LeaderBoard';
import PremiumMembershipScreen from './components/PremiumPage';
import UpdateProfileScreen from './components/profile/UpdateProfileScreen';
import ApprovePage from './components/ApprovePage';
import AuthorizationScreen from './components/AuthorizationScreen';
import GameDetailsScreen from './components/GameDetailsScreen';

const navigationRef = React.createRef();

const App = () => {

  const Stack = createStackNavigator();
  const [initialRoute, setInitialRoute] = useState('SplashOpen'); // Default initial route

function Routes() {

  const handleDeepLink = (event) => {
    const { url } = event;
    if (url) {
        let path = url.split('://')[1]?.split('/')[1]?.split('?')[0];
        const params = url.split('://')[1]?.split('/')[1]?.split('?')[1];
        if (path === 'authorize') {
            navigationRef.current?.navigate('Authorization', { navigationRef, params });
        } 
        
        path = url.split('://')[1]?.split('/')[0];
        if (path === 'approve') {
            navigationRef.current?.navigate('Approve');
        }
    }
};

useEffect(() => {
    Linking.getInitialURL().then((url) => {
        if (url) {
            const path = url.split('://')[1]?.split('/')[1]?.split('?')[0];
            if (path === 'authorize') {
                setInitialRoute('Authorization');
            } else if (path === 'approve') {
                setInitialRoute('Approve');
            }
        }
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
        subscription.remove();
    };
}, []);



  return(
    <Stack.Navigator initialRouteName={initialRoute}>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SignupStep" component={SignupStep} options={{ headerShown: false }} />
    <Stack.Screen name="Eligibility" component={EligibilityScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Interests" component={InterestsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Timeline" component={AppNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="SplashOpen" component={SplashOpen} options={{ headerShown: false }} />
    <Stack.Screen name="SplashLogin" component={SplashLogin} options={{ headerShown: false }} />
    <Stack.Screen name="SplashLogout" component={SplashLogout} options={{ headerShown: false }} />
    <Stack.Screen name="SplashSignup" component={SplashSignup} options={{ headerShown: false }} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ResetPasscode" component={ResetPasswordModal} options={{ headerShown: false }} />
    <Stack.Screen name="Update Profile" component={UpdateProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Store" component={StoreScreen} options={{ headerShown: false }} />
    <Stack.Screen name="GameStore" component={GameStoreScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="GameDetails" component={GameDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="GameScreen" component={GameScreen} options={{ headerShown: false }} />
    <Stack.Screen name="StreamScreen" component={StreamScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Tournaments" component={TournamentsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Payments" component={PaymentsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Shopping" component={ShoppingPage} options={{ headerShown: false }} />
    <Stack.Screen name="Explore" component={ExploreScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Message" component={MessageScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Connections" component={ConnectionsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Collections" component={CollectionsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Community" component={CommunitiesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CommunityDetails" component={CommunityDetailsPage} options={{ headerShown: false }} />
    <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Premium" component={PremiumMembershipScreen} options={{ headerShown: false }} />
    <Stack.Screen name="InviteModal" component={InviteModal} options={{ headerShown: false }}/>
    <Stack.Screen name="Approve" component={ApprovePage} options={{ headerShown: false }}/>
    <Stack.Screen name="Authorization" component={AuthorizationScreen} options={{ headerShown: false }} />
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
        <NavigationContainer ref={navigationRef}>
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
