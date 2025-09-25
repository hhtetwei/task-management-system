import { api } from "@/app/libs/axios";
import { Users } from "@/app/users/types";


export const getCurrentUser = async (): Promise<Users | null> => {
  try {
    const user = await api.get<Users>("/auth/me").then(res => res.data);
    return user ?? null;
  } catch {
    return null;
  }
};