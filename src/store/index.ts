import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import profileSlice from '@/slices/profileSlice';
import onboardingStepsSlice from '@/slices/onboardingStepsSlice';

const storageAdapter = {
  getItem: async (name: string) => {
    return await AsyncStorage.getItem(name);
  },
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useMetromatchStore: any = create(
  persist(
    (set, get) => ({
      ...profileSlice(set),
      ...onboardingStepsSlice(set, get)
    }),
    {
      name: 'metromatch-store',
      storage: createJSONStorage(() => storageAdapter),
    }
  ),
)

export default useMetromatchStore;
