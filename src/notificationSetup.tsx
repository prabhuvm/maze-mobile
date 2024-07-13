// notificationSetup.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { apiClient } from './api/client';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

export const getToken = async (setDeviceToken) => {
  try {
    const token = await messaging().getToken();
    setDeviceToken(token);
    console.log('Device FCM Token:', token);
    // Send this token to your server to register the device
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export const handleForegroundMessages = (setNotifications, setMessages, selectedChatRef, setChatMessages) => {
  return messaging().onMessage(async remoteMessage => {
    try {
    console.log('FCM message arrived! - Foreground', JSON.stringify(remoteMessage));
    const messageType = remoteMessage.data?.type;
    if (messageType === 'notification') {
      setNotifications(prevNotifications => [
        ...prevNotifications,
        remoteMessage.notification,
      ]);
     // Alert.alert('Notification', remoteMessage.notification.body);
    } else if (messageType === 'message') {
      const message = JSON.parse(remoteMessage.notification.body);

      setMessages(prevMessages => {
        const existingMessage = prevMessages[message.username];
        // Check if the message should be updated based on the id
        if (!existingMessage || existingMessage.id <= message.id) {
          return {
            ...prevMessages,
            [message.username]: message,
          };
        }
        // Return the previous state if no update is needed
        return prevMessages;
      });

      console.log("Selected Chat set to ##$ ", selectedChatRef);
      
      if(selectedChatRef.current.trim() == message.username) {
        console.log("New arrived message: ", message);
        setChatMessages(prevMessages => [
          ...prevMessages,
          message,
        ]);
      }
      //Alert.alert('Message', remoteMessage.notification.body);
    }
  }catch(error) {
    console.error('Error handling FCM message:', error);
  }
  });
};

export const handleBackgroundMessages = (setNotifications, setMessages, selectedChatRef, setChatMessages) => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('FCM message arrived! - background', JSON.stringify(remoteMessage));
    const messageType = remoteMessage.data?.type;
    if (messageType === 'notification') {
      setNotifications(prevNotifications => [
        ...prevNotifications,
        remoteMessage.notification,
      ]);
    } else if (messageType === 'message') {
      const message = JSON.parse(remoteMessage.notification.body);

      setMessages(prevMessages => {
        const existingMessage = prevMessages[message.username];
        // Check if the message should be updated based on the id
        if (!existingMessage || existingMessage.id <= message.id) {
          return {
            ...prevMessages,
            [message.username]: message,
          };
        }
        // Return the previous state if no update is needed
        return prevMessages;
      });
      
      if(selectedChatRef.current.trim()  == message.username) {
        console.log("New arrived message: ", message);
        setChatMessages(prevMessages => [
          ...prevMessages,
          message,
        ]);
      }
    }
  });
};

export const handleNotificationOpenedApp = (setNotifications, setMessages, selectedChatRef, setChatMessages) => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('FCM message arrived! - Opened App', JSON.stringify(remoteMessage));
    const messageType = remoteMessage.data?.type;
    if (messageType === 'notification') {
      setNotifications(prevNotifications => [
        ...prevNotifications,
        remoteMessage.notification,
      ]);
    } else if (messageType === 'message') {
      const message = JSON.parse(remoteMessage.notification.body);

      setMessages(prevMessages => {
        const existingMessage = prevMessages[message.username];
        // Check if the message should be updated based on the id
        if (!existingMessage || existingMessage.id <= message.id) {
          return {
            ...prevMessages,
            [message.username]: message,
          };
        }
        // Return the previous state if no update is needed
        return prevMessages;
      });
      
      if(selectedChatRef.current.trim() == message.username) {
        console.log("New arrived message: ", message);
        setChatMessages(prevMessages => [
          ...prevMessages,
          message,
        ]);
      }
    }
  });
};

export const getInitialNotification = async (setNotifications, setMessages, selectedChatRef, setChatMessages) => {
  const initialNotification = await messaging().getInitialNotification();
  if (initialNotification) {
    console.log('FCM message arrived! - Notification caused app to open from quit state:', initialNotification);
    const messageType = initialNotification.data?.type;
    if (messageType === 'notification') {
      setNotifications(prevNotifications => [
        ...prevNotifications,
        initialNotification.notification,
      ]);
    } else if (messageType === 'message') {
      const message = JSON.parse(remoteMessage.notification.body);

      setMessages(prevMessages => {
        const existingMessage = prevMessages[message.username];
        // Check if the message should be updated based on the id
        if (!existingMessage || existingMessage.id <= message.id) {
          return {
            ...prevMessages,
            [message.username]: message,
          };
        }
        // Return the previous state if no update is needed
        return prevMessages;
      });

      
      if(selectedChatRef.current.trim()  == message.username) {
        console.log("New arrived message: ", message);
        setChatMessages(prevMessages => [
          ...prevMessages,
          message,
        ]);
      }
    }
  }
};

export const updateDeviceToken = async (deviceId, deviceToken) => {
  console.log("Updating ", deviceId, " and ", deviceToken)
  if (deviceId && deviceId.trim() !== "" && deviceToken && deviceToken.trim() !== "") {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log("##$#$#$#$#$# Calling device updated with ", accessToken, " for device_token: ", deviceToken);
      const response = await apiClient.post(`/notifications/update-device-token/`,
        { deviceId, device_token: deviceToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error('Error in updating device token:', error);
    }
  }
};

export const sampleNotifications = async () => { 
  const accessToken = await AsyncStorage.getItem("accessToken");
console.log("#################### Calling post notificaitions with ", accessToken);
const response = await apiClient.post(`/notifications/`,
{
  title: 'Opened Notification', 
  body: 'Notification screen opened', 
},
{
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  }
}
);
console.log("Response for notification: ", response.data);
} 