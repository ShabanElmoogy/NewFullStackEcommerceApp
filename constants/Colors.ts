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
    
    // Category colors - Optimized for UI/UX
    categoryColors: {
      mobiles: {
        primary: '#6366F1', // Modern indigo
        secondary: '#EEF2FF',
        accent: '#4F46E5',
      },
      fashion: {
        primary: '#EC4899', // Vibrant pink
        secondary: '#FDF2F8',
        accent: '#DB2777',
      },
      home: {
        primary: '#059669', // Fresh emerald
        secondary: '#ECFDF5',
        accent: '#047857',
      },
      sports: {
        primary: '#F59E0B', // Energetic amber
        secondary: '#FFFBEB',
        accent: '#D97706',
      },
      books: {
        primary: '#7C3AED', // Rich violet
        secondary: '#F3E8FF',
        accent: '#6D28D9',
      },
      gaming: {
        primary: '#EF4444', // Bold red
        secondary: '#FEF2F2',
        accent: '#DC2626',
      },
      electronics: {
        primary: '#0891B2', // Tech cyan
        secondary: '#F0F9FF',
        accent: '#0E7490',
      },
      beauty: {
        primary: '#F97316', // Warm orange
        secondary: '#FFF7ED',
        accent: '#EA580C',
      },
      food: {
        primary: '#65A30D', // Natural lime
        secondary: '#F7FEE7',
        accent: '#4D7C0F',
      },
      automotive: {
        primary: '#374151', // Professional gray
        secondary: '#F9FAFB',
        accent: '#1F2937',
      },
      default: {
        primary: '#6B7280', // Neutral gray
        secondary: '#F3F4F6',
        accent: '#4B5563',
      },
    },
    
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
    
    // Category colors - Dark mode optimized
    categoryColors: {
      mobiles: {
        primary: '#818CF8', // Lighter indigo for dark mode
        secondary: '#312E81',
        accent: '#6366F1',
      },
      fashion: {
        primary: '#F472B6', // Lighter pink for dark mode
        secondary: '#831843',
        accent: '#EC4899',
      },
      home: {
        primary: '#34D399', // Lighter emerald for dark mode
        secondary: '#064E3B',
        accent: '#059669',
      },
      sports: {
        primary: '#FBBF24', // Lighter amber for dark mode
        secondary: '#78350F',
        accent: '#F59E0B',
      },
      books: {
        primary: '#A78BFA', // Lighter violet for dark mode
        secondary: '#4C1D95',
        accent: '#7C3AED',
      },
      gaming: {
        primary: '#F87171', // Lighter red for dark mode
        secondary: '#7F1D1D',
        accent: '#EF4444',
      },
      electronics: {
        primary: '#22D3EE', // Lighter cyan for dark mode
        secondary: '#164E63',
        accent: '#0891B2',
      },
      beauty: {
        primary: '#FB923C', // Lighter orange for dark mode
        secondary: '#9A3412',
        accent: '#F97316',
      },
      food: {
        primary: '#84CC16', // Lighter lime for dark mode
        secondary: '#365314',
        accent: '#65A30D',
      },
      automotive: {
        primary: '#9CA3AF', // Lighter gray for dark mode
        secondary: '#374151',
        accent: '#6B7280',
      },
      default: {
        primary: '#9CA3AF', // Lighter neutral gray for dark mode
        secondary: '#374151',
        accent: '#6B7280',
      },
    },
    
    // Shadow
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
  },
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;