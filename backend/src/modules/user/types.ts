import { User } from './user.entity';

export enum UserType {
  ADMIN = 'Admin',
  USER = 'User',
}

export enum AccountStatus {
  OFFLINE = 'Offline',
  ONLINE = 'Online',
}

export type GetUsersResponse = { data: User[]; count: number };
