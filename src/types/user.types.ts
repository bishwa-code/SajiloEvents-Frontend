// Define a union type for user roles that matches the backend
export type UserRole = "student" | "admin";

// Define the structure of a User object, matching the backend's key fields
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  interests: string[];
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
