"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: User) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage on mount
    const savedUser = localStorage.getItem('currentUser');
    const authStatus = localStorage.getItem('isAuthenticated');

    if (savedUser && authStatus === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const usersJson = localStorage.getItem('users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    const foundUser = users.find(u => u.email === email);
    
    if (!foundUser) {
      return { success: false, error: 'User account not found' };
    }
    
    if (foundUser.password !== password) {
      return { success: false, error: 'Invalid security password' };
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('isAuthenticated', 'true');
    router.push('/dashboard');
    return { success: true };
  };

  const register = (userData: User) => {
    const usersJson = localStorage.getItem('users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User with this email already exists' };
    }
    
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = userData;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('isAuthenticated', 'true');
    router.push('/dashboard');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
