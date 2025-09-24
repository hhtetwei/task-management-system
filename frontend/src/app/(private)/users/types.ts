

export type Users = {
  id: number;
  name: string;
  email: string;
};

export type GetUsersResponse = { data: Users[]; count: number };

export type GetUsersDto = {
  skip?: number;
  limit?: number;
  search?: string;
};
