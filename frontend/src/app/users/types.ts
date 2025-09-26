
export enum UserType {
  ADMIN = 'Admin',
  USER = 'User',
}


export type Users = {
  id: number;
  name: string;
  email: string;
  type: UserType;
};

export type GetUsersResponse = { data: Users[]; count: number };

export type GetUsersDto = {
  skip?: number;
  limit?: number;
  search?: string;
};
