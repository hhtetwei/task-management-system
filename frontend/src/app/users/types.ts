import { TImage } from "../types/image";

export enum AccountStatus {
    OFFLINE = 'Offline',
    ONLINE = 'Online',
  }
  
  export enum UserType {
    ADMIN = 'Admin',
    USER = 'User'
  }
  

export type User = {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    accountStatus: AccountStatus;
    type: UserType;
    profileImage: TImage;
  };