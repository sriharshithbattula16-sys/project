import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'faculty@exam.com': {
    password: 'faculty123',
    user: { id: '1', name: 'Dr. Sarah Johnson', username: 'dr.sarah', email: 'faculty@exam.com', role: 'faculty' },
  },
  'student@exam.com': {
    password: 'student123',
    user: { id: '2', name: 'Alex Chen', username: 'alexchen', email: 'student@exam.com', role: 'student' },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('exam_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    await new Promise((r) => setTimeout(r, 800));
    const entry = MOCK_USERS[email];
    if (!entry || entry.password !== password || entry.user.role !== role) {
      throw new Error('Invalid credentials or role mismatch');
    }
    setUser(entry.user);
    sessionStorage.setItem('exam_user', JSON.stringify(entry.user));
  }, []);

  const signup = useCallback(async (name: string, username: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    if (MOCK_USERS[email]) throw new Error('An account with this email already exists');
    const usernameTaken = Object.values(MOCK_USERS).some(
      (entry) => entry.user.username.toLowerCase() === username.toLowerCase()
    );
    if (usernameTaken) throw new Error('This username is already taken');
    const newUser: User = { id: crypto.randomUUID(), name, username, email, role: 'student' };
    MOCK_USERS[email] = { password, user: newUser };
    setUser(newUser);
    sessionStorage.setItem('exam_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('exam_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
