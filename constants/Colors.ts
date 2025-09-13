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
    tabBackground: '#FFFFFF', // Very white for light mode
    tabActive: '#007AFF',
    tabInactive: '#8E8E93',
    
    // Selected colors for dynamic selection states
    selectedColors: [
      { primary: '#6366F1', secondary: '#EEF2FF', accent: '#4F46E5' }, // Indigo
      { primary: '#EC4899', secondary: '#FDF2F8', accent: '#DB2777' }, // Pink
      { primary: '#059669', secondary: '#ECFDF5', accent: '#047857' }, // Emerald
      { primary: '#F59E0B', secondary: '#FFFBEB', accent: '#D97706' }, // Amber
      { primary: '#7C3AED', secondary: '#F3E8FF', accent: '#6D28D9' }, // Violet
      { primary: '#EF4444', secondary: '#FEF2F2', accent: '#DC2626' }, // Red
      { primary: '#0891B2', secondary: '#F0F9FF', accent: '#0E7490' }, // Cyan
      { primary: '#F97316', secondary: '#FFF7ED', accent: '#EA580C' }, // Orange
      { primary: '#65A30D', secondary: '#F7FEE7', accent: '#4D7C0F' }, // Lime
      { primary: '#8B5CF6', secondary: '#F5F3FF', accent: '#7C3AED' }, // Purple
      { primary: '#06B6D4', secondary: '#F0F9FF', accent: '#0891B2' }, // Sky
      { primary: '#84CC16', secondary: '#F7FEE7', accent: '#65A30D' }, // Lime Green
    ],
    
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
    tabBackground: '#000000', // Very dark for dark mode
    tabActive: '#0A84FF',
    tabInactive: '#8E8E93',
    
    // Selected colors for dynamic selection states - Dark mode optimized
    selectedColors: [
      { primary: '#818CF8', secondary: '#312E81', accent: '#6366F1' }, // Indigo
      { primary: '#F472B6', secondary: '#831843', accent: '#EC4899' }, // Pink
      { primary: '#34D399', secondary: '#064E3B', accent: '#059669' }, // Emerald
      { primary: '#FBBF24', secondary: '#78350F', accent: '#F59E0B' }, // Amber
      { primary: '#A78BFA', secondary: '#4C1D95', accent: '#7C3AED' }, // Violet
      { primary: '#F87171', secondary: '#7F1D1D', accent: '#EF4444' }, // Red
      { primary: '#22D3EE', secondary: '#164E63', accent: '#0891B2' }, // Cyan
      { primary: '#FB923C', secondary: '#9A3412', accent: '#F97316' }, // Orange
      { primary: '#84CC16', secondary: '#365314', accent: '#65A30D' }, // Lime
      { primary: '#A78BFA', secondary: '#4C1D95', accent: '#8B5CF6' }, // Purple
      { primary: '#67E8F9', secondary: '#164E63', accent: '#06B6D4' }, // Sky
      { primary: '#A3E635', secondary: '#365314', accent: '#84CC16' }, // Lime Green
    ],
    
    // Shadow
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
  },
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;