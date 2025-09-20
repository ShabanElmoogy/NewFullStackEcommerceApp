/**
 * Theme Hook
 * Provides theme context and utilities for dark/light mode
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ColorScheme, ThemeColors } from '@/constants/Colors';

interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ColorScheme) => void;
  themePreference: ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_preference';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themePreference, setThemePreference] = useState<ColorScheme>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  const colorScheme = themePreference;
  const colors = useMemo(() => Colors[colorScheme], [colorScheme]);
  const isDark = useMemo(() => colorScheme === 'dark', [colorScheme]);
  const isLight = useMemo(() => colorScheme === 'light', [colorScheme]);

  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          setThemePreference(savedTheme as ColorScheme);
        } else {
          // Default to light if no preference is saved
          setThemePreference('light');
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
        // Fallback to light theme on error
        setThemePreference('light');
      } finally {
        setIsLoaded(true);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference to storage
  const saveThemePreference = async (theme: ColorScheme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const setTheme = useCallback((theme: ColorScheme) => {
    setThemePreference(theme);
    saveThemePreference(theme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  }, [isDark, setTheme]);

  const value: ThemeContextType = useMemo(() => ({
    colorScheme,
    colors,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
    themePreference,
  }), [colorScheme, colors, isDark, isLight, toggleTheme, setTheme, themePreference]);

  // Don't render until theme preference is loaded
  if (!isLoaded) {
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
