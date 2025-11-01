import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AxiosError } from "axios";
import type { User } from "../types/user.types.ts";
import {
  AuthContext,
  type LoginCredentials,
  type RegisterCredentials,
} from "./AuthContext.ts";
import toast from "react-hot-toast";

// --- Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Derive other values from the user state
  const isAuthenticated = !!user;
  const userRole = user ? user.role : null;

  // Function to load the user from the backend
  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status !== 401) {
        console.error("Error loading user from API:", error.message);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      if (res.data.success) {
        toast.success("Logged in successfully!");
        await loadUser();

        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Login failed.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred during login.");
      }
      throw error;
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    try {
      const res = await api.post("/auth/register", credentials);
      if (res.data.success) {
        toast.success("Registered successfully! You are now logged in.");
        await loadUser();

        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Registration failed.";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.get("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Logout failed:", error.message);
      } else {
        console.error("An unknown error occurred during logout.");
      }
      toast.error("Logout failed. Please try again.");
    }
  };

  // On component mount, try to load the user
  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    user,
    isAuthenticated,
    userRole,
    login,
    logout,
    register,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
