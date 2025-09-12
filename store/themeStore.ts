/**
 * Theme Store
 * Global state management for theme preferences
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorScheme } from '@/constants/Colors';

interface ThemeState {
  themePreference: ColorScheme | 'system';
  setThemePreference: (theme: ColorScheme | 'system') => void;
  toggleTheme: (currentScheme: ColorScheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themePreference: 'system',
      
      setThemePreference: (theme) => {
        set({ themePreference: theme });
      },
      
      toggleTheme: (currentScheme) => {
        const newTheme = currentScheme === 'dark' ? 'light' : 'dark';
        set({ themePreference: newTheme });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);