import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authSlice from '../slices/authSlice';
import deviceInfoSlice from '../slices/deviceInfoSlice';

export const useWorkBuddyStore: any = create(
  persist(
    (set) => ({
      // ...authSlice(set),
      // ...deviceInfoSlice(set),
    }),
    {
      name: 'metromatch-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  ),
)

export default useWorkBuddyStore;
