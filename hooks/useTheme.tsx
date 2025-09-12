/**
 * Theme Hook
 * Provides theme context and utilities for dark/light mode
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ColorScheme, ThemeColors } from '@/constants/Colors';

interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ColorScheme | 'system') => void;
  themePreference: ColorScheme | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_preference';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ColorScheme | 'system'>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Determine the actual color scheme based on preference
  const colorScheme: ColorScheme = 
    themePreference === 'system' 
      ? (systemColorScheme ?? 'light')
      : themePreference;

  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  const isLight = colorScheme === 'light';

  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemePreference(savedTheme as ColorScheme | 'system');
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference to storage
  const saveThemePreference = async (theme: ColorScheme | 'system') => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const setTheme = (theme: ColorScheme | 'system') => {
    setThemePreference(theme);
    saveThemePreference(theme);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    colorScheme,
    colors,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
    themePreference,
  };

  // Don't render children until theme is loaded
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility hook for getting colors directly
export function useColors(): ThemeColors {
  const { colors } = useTheme();
  return colors;
}