import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setUser: (userLogin) => set({ user: userLogin }),
      setToken: (newToken) => set({ token: newToken }),
      clearToken: () => set({ token: null, user: null }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;