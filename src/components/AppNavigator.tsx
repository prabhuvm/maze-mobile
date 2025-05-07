import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Timeline from './Timeline';
import ProfileScreen from './profile/ProfileScreen';
import CustomDrawerContent from './CustomDrawerContent'; // Import the custom drawer content component
import CustomDrawerHeader from './CustomDrawerHeader'; // Import the custom drawer header component
import UpdateProfileScreen from './profile/UpdateProfileScreen';
import PaymentsScreen from './PaymentsScreen';
import InviteModal from './InviteModal'; // Import the InviteModal component
import { useGlobalContext } from '../GlobalContext';

const Drawer = createDrawerNavigator();

const MainDrawer = ({ toggleInviteModal }) => {
  const { username: loginUsername } = useGlobalContext();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} toggleInviteModal={toggleInviteModal} />}
      screenOptions={{
        header: (props) => <CustomDrawerHeader {...props} />, // Set the custom header component
      }}
    >
      <Drawer.Screen name="Timeline" component={Timeline} />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ profileUsername: loginUsername }}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name="Coins" component={PaymentsScreen} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const toggleInviteModal = () => {
    setInviteModalVisible(!inviteModalVisible);
  };

  return (
    <>
      <MainDrawer toggleInviteModal={toggleInviteModal} />
      <InviteModal visible={inviteModalVisible} onClose={toggleInviteModal} />
    </>
  );
};

export default AppNavigator;
