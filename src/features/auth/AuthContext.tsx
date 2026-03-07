import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';

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
      const response = await authApi.me();
      if (response.success && response.data) {
        setState({
          user: response.data as User,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch {
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    if (!response.success || !response.data) {
      throw new Error('Login failed');
    }
    const { user, token, refreshToken } = response.data;
    sessionStorage.setItem(TOKEN_KEY, token);
    if (refreshToken) sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    setState({ user: user as User, isAuthenticated: true, isLoading: false });
  }, []);

  const register = useCallback(async (
    name: string, email: string, password: string, role: UserRole = 'tourist'
  ) => {
    const response = await authApi.signup({ name, email, password, role });
    if (!response.success || !response.data) {
      throw new Error('Registration failed');
    }
    const { user, token } = response.data;
    sessionStorage.setItem(TOKEN_KEY, token);
    setState({ user: user as User, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
    queryClient.clear();
  }, [queryClient]);

  const refreshTokenFn = useCallback(async () => {
    const rt = sessionStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!rt) throw new Error('No refresh token');
    const response = await authApi.refresh(rt);
    if (!response.success || !response.data) {
      logout();
      throw new Error('Token refresh failed');
    }
    sessionStorage.setItem(TOKEN_KEY, response.data.token);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
    setState(prev => ({ ...prev, user: response.data!.user as User }));
  }, [logout]);

  const requestPasswordReset = useCallback(async (email: string) => {
    const response = await authApi.forgotPassword(email);
    if (!response.success) throw new Error('Failed to request password reset');
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    const response = await authApi.resetPassword(token, password);
    if (!response.success) throw new Error('Failed to reset password');
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const response = await authApi.updateProfile(data as any);
    if (!response.success || !response.data) throw new Error('Failed to update profile');
    setState(prev => ({ ...prev, user: response.data as User }));
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
    refreshToken: refreshTokenFn,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    hasRole,
    isAdmin: state.user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function ProtectedRoute({ 
  children, roles, fallback = '/auth' 
}: { children: ReactNode; roles?: UserRole[]; fallback?: string }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) { window.location.href = fallback; return null; }
  if (roles && user && !roles.includes(user.role)) { window.location.href = '/'; return null; }
  return <>{children}</>;
}

export default AuthContext;
