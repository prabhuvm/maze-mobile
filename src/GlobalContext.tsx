// src/GlobalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Avatar } from './types';

interface GlobalContextProps {
  username: string;
  setUsername: (username: string) => void;
  deviceId: string;
  setDeviceId: (deviceId: string) => void;
  accessToken: string;
  setAccessToken: (token: string) => void;
  refreshToken: string;
  setRefreshToken: (token: string) => void;
  email: string;
  setEmail: (email: string) => void;
  avatarId: number;
  setAvatarId: (avatarId: number) => void;
  avatars: Avatar[];
  setAvatars: (avatars: Avatar[]) => void;
  avatarDict: { [key: number]: Avatar };
  setAvatarDict: (avatarDict: { [key: number]: Avatar } | ((prevDict: { [key: number]: Avatar }) => { [key: number]: Avatar })) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [email, setEmail] = useState('');
  const [avatarId, setAvatarId] = useState(1); //Set default avatarId here.
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [avatarDict, setAvatarDict] = useState<{ [key: number]: Avatar}>({});

  return (
    <GlobalContext.Provider value={{ username, setUsername, deviceId, setDeviceId, 
      accessToken, setAccessToken, refreshToken, setRefreshToken, 
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
