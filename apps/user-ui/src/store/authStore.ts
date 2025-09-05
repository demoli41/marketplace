import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  setLoggedIn: (value: boolean) => void;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  setLoggedIn: (value) => set({ isLoggedIn: value }),
  setUser: (user) => set({ user, isLoggedIn: !!user }),
}));
