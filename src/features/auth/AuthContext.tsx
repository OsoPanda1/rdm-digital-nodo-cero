import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiClient, queryKeys } from '@/lib/apiClient';
import { useQueryClient } from '@tanstack/react-query';

// Types
export type UserRole = 'tourist' | 'business_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'rdm_token';
const REFRESH_TOKEN_KEY = 'rdm_refresh_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const queryClient = useQueryClient();

  // Load user on mount
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (token) {
      loadUser();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await apiClient.get<{ data: User }>('/auth/me');
      if (response.success && response.data) {
        setState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      // Token invalid, clear storage
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.post<{ 
      data: { user: User; token: string; refreshToken?: string } 
    }>('/auth/login', { email, password });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Login failed');
    }

    const { user, token, refreshToken } = response.data;
    
    // Store tokens
    sessionStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }

    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const register = useCallback(async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = 'tourist'
  ) => {
    const response = await apiClient.post<{ 
      data: { user: User; token: string } 
    }>('/auth/signup', { name, email, password, role });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Registration failed');
    }

    const { user, token } = response.data;
    
    sessionStorage.setItem(TOKEN_KEY, token);

    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Clear React Query cache
    queryClient.clear();
  }, [queryClient]);

  const refreshToken = useCallback(async () => {
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await apiClient.post<{
      data: { token: string; refreshToken: string; user: User };
    }>('/auth/refresh', { refreshToken });

    if (!response.success || !response.data) {
      logout();
      throw new Error(response.error?.message || 'Token refresh failed');
    }

    const { token, refreshToken: newRefreshToken } = response.data;
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    
    setState(prev => ({
      ...prev,
      user: response.data!.user,
    }));
  }, [logout]);

  const requestPasswordReset = useCallback(async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to request password reset');
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to reset password');
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const response = await apiClient.put<{ data: User }>('/auth/profile', data);
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to update profile');
    }
    
    setState(prev => ({
      ...prev,
      user: response.data!,
    }));
  }, []);

  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!state.user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(state.user.role);
  }, [state.user]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    hasRole,
    isAdmin: state.user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected Route component
export function ProtectedRoute({ 
  children, 
  roles,
  fallback = '/auth' 
}: { 
  children: ReactNode;
  roles?: UserRole[];
  fallback?: string;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = fallback;
    return null;
  }

  if (roles && user && !roles.includes(user.role)) {
    window.location.href = '/';
    return null;
  }

  return <>{children}</>;
}

export default AuthContext;
