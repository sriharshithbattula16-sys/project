import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "faculty" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "faculty@exam.com": {
    password: "faculty123",
    user: { id: "f1", name: "Dr. Sarah Mitchell", email: "faculty@exam.com", role: "faculty" },
  },
  "student@exam.com": {
    password: "student123",
    user: { id: "s1", name: "Alex Johnson", email: "student@exam.com", role: "student" },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("exam_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS[email];
    if (found && found.password === password && found.user.role === role) {
      setUser(found.user);
      sessionStorage.setItem("exam_user", JSON.stringify(found.user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("exam_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
