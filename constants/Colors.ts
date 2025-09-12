/**
 * Colors
 * Comprehensive color system with light and dark mode support
 */

export const Colors = {
  light: {
    // Primary colors
    primary: '#007AFF',
    primaryLight: '#4DA3FF',
    primaryDark: '#0056CC',
    
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F1F3F4',
    
    // Surface colors
    surface: '#FFFFFF',
    surfaceSecondary: '#F8F9FA',
    surfaceTertiary: '#E9ECEF',
    
    // Text colors
    text: '#1C1C1E',
    textSecondary: '#3C3C43',
    textTertiary: '#8E8E93',
    textInverse: '#FFFFFF',
    
    // Border colors
    border: '#E5E5EA',
    borderSecondary: '#D1D1D6',
    
    // Status colors
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    
    // Card colors
    card: '#FFFFFF',
    cardSecondary: '#F8F9FA',
    
    // Tab colors
    tabBackground: '#FFFFFF',
    tabActive: '#007AFF',
    tabInactive: '#8E8E93',
    
    // Shadow
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
  },
  dark: {
    // Primary colors
    primary: '#0A84FF',
    primaryLight: '#4DA3FF',
    primaryDark: '#0056CC',
    
    // Background colors
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',
    
    // Surface colors
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    surfaceTertiary: '#3A3A3C',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',
    textInverse: '#000000',
    
    // Border colors
    border: '#38383A',
    borderSecondary: '#48484A',
    
    // Status colors
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
    
    // Card colors
    card: '#1C1C1E',
    cardSecondary: '#2C2C2E',
    
    // Tab colors
    tabBackground: '#1C1C1E',
    tabActive: '#0A84FF',
    tabInactive: '#8E8E93',
    
    // Shadow
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
  },
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;