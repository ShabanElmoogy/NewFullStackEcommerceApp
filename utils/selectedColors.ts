/**
 * Selected Colors Utility
 * Provides beautiful colors for selected items with light/dark theme support
 */

import { Colors } from '@/constants/Colors';

export interface SelectedColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

/**
 * Get color for a specific selected item from an array
 * @param item - The specific item to get color for
 * @param selectedItems - Array of all selected items
 * @param isDark - Whether dark mode is active
 * @returns SelectedColorScheme object or null if item not selected
 */
export const getColorForSelectedItem = <T>(
  item: T,
  selectedItems: T[],
  isDark: boolean = false
): SelectedColorScheme | null => {
  const index = selectedItems.indexOf(item);
  if (index === -1) return null;
  
  const colors = isDark ? Colors.dark.selectedColors : Colors.light.selectedColors;
  const colorIndex = index % colors.length; // Cycle through colors if more items than colors
  return colors[colorIndex];
};