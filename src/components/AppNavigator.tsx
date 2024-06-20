// AppNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Timeline from './Timeline';
import ProfileScreen from './ProfileScreen';
import CustomDrawerContent from './CustomDrawerContent'; // Import the custom drawer content component
import CustomDrawerHeader from './CustomDrawerHeader'; // Import the custom drawer header component
import UpdateProfileScreen from './UpdateProfileScreen';
import PaymentsScreen from './PaymentsScreen';
import { useGlobalContext } from '../GlobalContext';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  const { username: loginUsername } = useGlobalContext();
  return (

      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        <Drawer.Screen name="Coins" component={PaymentsScreen}  options={{ headerShown: false }}  />
        <Drawer.Screen name="Update Profile" component={UpdateProfileScreen} options={{ headerShown: false }}  />
      </Drawer.Navigator>

  );
};

export default AppNavigator;
