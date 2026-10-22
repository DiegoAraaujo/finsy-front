import { createContext } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isRestoring: boolean;
  accessToken: string | null;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
