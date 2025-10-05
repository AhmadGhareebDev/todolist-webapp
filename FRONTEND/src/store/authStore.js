import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: { email: null }, 
  isAuthenticated: false,

  setAuth: (token, user) => set({
    accessToken: token,
    user: { email: user.email },
    isAuthenticated: true
  }),

  clearAuth: () => set({
    accessToken: null,
    user: { email: null }, 
    isAuthenticated: false
  }),

  getAccessToken: () => get().accessToken,
}));