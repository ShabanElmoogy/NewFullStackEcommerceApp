import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';

export function AppStatusBar() {
  const { colors, isDark } = useTheme();

  return (
    <StatusBar 
      style={isDark ? 'light' : 'dark'} 
      backgroundColor={colors.background} 
    />
  );
}