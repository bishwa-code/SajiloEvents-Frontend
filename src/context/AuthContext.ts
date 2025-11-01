import { createContext } from "react";
import type { User, UserRole } from "../types/user.types";

// Define a specific type for the login credentials
export interface LoginCredentials {
  email: string;
  password?: string;
}

// Define a specific type for the registration credentials
export interface RegisterCredentials {
  fullName: string;
  email: string;
  password?: string;
  interests?: string[];
}

// --- Types for our Auth Context
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
