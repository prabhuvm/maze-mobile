// src/GlobalContext.tsx
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { Avatar, Chat, Message, Notification } from './types';

interface GlobalContextProps {
  username: string;
  setUsername: (username: string) => void;
  loginName: string;
  setLoginName: (loginName: string) => void;
  deviceId: string;
  setDeviceId: (deviceId: string) => void;
  deviceToken: string;
  setDeviceToken: (deviceId: string) => void;
  accessToken: string;
  setAccessToken: (token: string) => void;
  refreshToken: string;
  setRefreshToken: (token: string) => void;
  email: string;
  setEmail: (email: string) => void;
  loginPremium: boolean;
  setLoginPremium: (loginPremium: boolean) => void;
  avatarId: number;
  setAvatarId: (avatarId: number) => void;
  avatars: Avatar[];
  setAvatars: (avatars: Avatar[]) => void;
  avatarDict: { [key: number]: Avatar };
  setAvatarDict: (avatarDict: { [key: number]: Avatar } | ((prevDict: { [key: number]: Avatar }) => { [key: number]: Avatar })) => void;
  selectedChat: string; 
  setSelectedChat: (selectedChat: string) => void;
  selectedChatRef: React.MutableRefObject<string>;
  messages: { [key: string]: Message };
  setMessages: (messages: { [key: string]: Message } | ((prevDict: { [key: string]: Message }) => { [key: string]: Message })) => void;
  chatMessages: Chat[]; 
  setChatMessages: (chatMessages: Chat[]) => void; 
  notifications: Notification[]; 
  setNotifications: (notifications: Notification[]) => void; 
}

export const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [loginName, setLoginName] = useState('');
  const [email, setEmail] = useState('');
  const [loginPremium, setLoginPremium] = useState(false); 

  
  const [deviceId, setDeviceId] = useState('');
  
  const [deviceToken, setDeviceToken] = useState('');

  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const [avatarId, setAvatarId] = useState(37); //Set default avatarId here.
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [avatarDict, setAvatarDict] = useState<{ [key: number]: Avatar}>({});

  const [messages, setMessages] = useState<{ [key: string]: Message}>({});

  const [selectedChat, setSelectedChat] = useState('');
  const selectedChatRef = useRef(selectedChat);

  const [chatMessages, setChatMessages] = useState<Chat[]>([]);

  const[notifications, setNotifications] = useState<Notification[]>([]);

  React.useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);    // TODO: This might not be required

  return (
    <GlobalContext.Provider value={{ username, setUsername, loginName, setLoginName, deviceId, setDeviceId, deviceToken, setDeviceToken,
      accessToken, setAccessToken, refreshToken, setRefreshToken, messages, setMessages, selectedChat, setSelectedChat, selectedChatRef,
      chatMessages, setChatMessages, notifications, setNotifications, loginPremium, setLoginPremium,
      email, setEmail, avatarId, setAvatarId, avatars, setAvatars, avatarDict, setAvatarDict }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
