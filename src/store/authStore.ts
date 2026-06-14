// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import authSlice from '@/slices/authSlice';

// 1. Create a secure storage adapter for Zustand
const secureStorageAdapter = {
    getItem: async (name: string) => {
        const value = await SecureStore.getItemAsync(name);
        return value ? value : null;
    },
    setItem: async (name: string, value: string) => {
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name: string) => {
        await SecureStore.deleteItemAsync(name);
    },
};

export const useAuthStore: any = create(
    persist(
        (set) => ({
            ...authSlice(set),
        }),
        {
            name: 'metromatch-auth-storage',
            storage: createJSONStorage(() => secureStorageAdapter),
            // Optional: Only persist the token, leave user profile to normal state
            //   partialize: (state) => ({ token: state.token }), 
        }
    )
);
