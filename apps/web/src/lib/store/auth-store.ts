import { create } from 'zustand';
import { UserDTO } from '@tools-website/shared-types';

interface AuthState {
  user: UserDTO | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserDTO, accessToken: string, refreshToken?: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize state from localStorage in browser context
  const getInitialState = () => {
    if (typeof window === 'undefined') return { user: null, accessToken: null, isAuthenticated: false };
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    return {
      user: userStr ? JSON.parse(userStr) : null,
      accessToken: token,
      isAuthenticated: !!token,
    };
  };

  return {
    ...getInitialState(),
    isLoading: false,
    setAuth: (user, accessToken, refreshToken) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      set({ user, accessToken, isAuthenticated: true });
    },
    clearAuth: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, accessToken: null, isAuthenticated: false });
    },
    setLoading: (loading) => set({ isLoading: loading }),
  };
});
