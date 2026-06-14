// src/store/useAuthStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import authSlice from '@/slices/authSlice';

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Create a secure storage adapter for Zustand
const secureStorageAdapter = {
    getItem: async (name: string) => {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(name);
        } else {
            const value = await SecureStore.getItemAsync(name);
            return value ? value : null;
        }
    },
    setItem: async (name: string, value: string) => {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(name, value);
        } else {
            await SecureStore.setItemAsync(name, value);
        }
    },
    removeItem: async (name: string) => {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(name);
        } else {
            await SecureStore.deleteItemAsync(name);
        }
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
