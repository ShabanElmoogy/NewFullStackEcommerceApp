import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { ColorScheme } from '@/constants/Colors';

export default function ThemeToggle() {
  const { colors, themePreference, setTheme } = useTheme();

  const handleThemeToggle = useCallback(() => {
    setTheme(themePreference === 'light' ? 'dark' : 'light');
  }, [themePreference, setTheme]);

  const ThemeIcon = themePreference === 'light' ? Sun : Moon;

  return (
    <Pressable onPress={handleThemeToggle} className="active:opacity-90">
      <View
        className="w-11 h-11 rounded-full items-center justify-center"
        style={{ backgroundColor: (colors.warning || '#F59E0B') + '20' }}
      >
        <ThemeIcon size={20} color={colors.warning || '#F59E0B'} />
      </View>
    </Pressable>
  );
}
