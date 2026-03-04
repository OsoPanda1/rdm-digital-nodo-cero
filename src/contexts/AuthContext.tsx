import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'tourist' | 'business_owner' | 'admin';
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; avatarUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('rdm_token');
    const storedUser = localStorage.getItem('rdm_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const { user: userData, token: authToken } = response.data;

    localStorage.setItem('rdm_token', authToken);
    localStorage.setItem('rdm_user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
  };

  const signup = async (name: string, email: string, password: string, role?: string) => {
    const response = await authApi.signup({ name, email, password, role });
    const { user: userData, token: authToken } = response.data;

    localStorage.setItem('rdm_token', authToken);
    localStorage.setItem('rdm_user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    }

    localStorage.removeItem('rdm_token');
    localStorage.removeItem('rdm_user');

    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: { name?: string; avatarUrl?: string }) => {
    const response = await authApi.updateProfile(data);
    const updatedUser = response.data;

    localStorage.setItem('rdm_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
