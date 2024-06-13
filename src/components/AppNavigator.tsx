// AppNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Timeline from './Timeline';
import ProfileScreen from './ProfileScreen';
import CustomDrawerContent from './CustomDrawerContent'; // Import the custom drawer content component
import CustomDrawerHeader from './CustomDrawerHeader'; // Import the custom drawer header component
import UpdateProfileScreen from './UpdateProfileScreen';
import PaymentsScreen from './PaymentsScreen';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (

      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          header: (props) => <CustomDrawerHeader {...props} />, // Set the custom header component
        }}
      >
        <Drawer.Screen name="Timeline" component={Timeline} />
        <Drawer.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}  />
        <Drawer.Screen name="Coins" component={PaymentsScreen} options={{ headerShown: false }}  />
        <Drawer.Screen name="UpdateProfile" component={UpdateProfileScreen} options={{ headerShown: false }}  />
      </Drawer.Navigator>

  );
};

export default AppNavigator;
