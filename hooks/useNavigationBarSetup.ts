import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useTheme } from './useTheme';

export function useNavigationBarSetup() {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      const setupNavigationBar = async () => {
        try {
          await NavigationBar.setBackgroundColorAsync(colors.background);
          // Dark theme → light buttons (white), Light theme → dark buttons (black)
          await NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
        } catch (error) {
          // Silently handle navigation bar setup errors
          console.warn('Navigation bar setup failed:', error);
        }
      };

      setupNavigationBar();
    }
  }, [colors.background, isDark]);
}