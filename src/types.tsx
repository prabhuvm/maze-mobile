export interface Avatar {
    id: number;
    username: string;
    avatar: string;
  };

  export interface User {
    name: string;
    username: string;
    following: boolean;
    profile_pic: string;
  };

  export interface Message {
    id: number;
    username: string;
    avatar: string;
  };

  export interface Chat {
    id: number;
    username: string;
    avatar: string;
  };

  export interface Notification {
    id: number;
    username: string;
    avatar: string;
  };
