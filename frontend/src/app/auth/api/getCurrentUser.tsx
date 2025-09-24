import { api } from "@/app/libs/axios";
import type { User } from "@/app/users/types";

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await api.get<User>("/auth/me").then(res => res.data);
    return user ?? null;
  } catch {
    return null;
  }
};