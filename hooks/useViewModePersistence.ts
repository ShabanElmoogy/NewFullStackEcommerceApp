import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VIEW_MODE_STORAGE_KEY = 'product_view_mode';

export type ViewMode = 'grid' | 'list';

const defaultViewMode: ViewMode = 'grid';

export function useViewModePersistence() {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load view mode from storage on mount
  useEffect(() => {
    loadViewMode();
  }, []);

  // Save view mode to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveViewMode(viewMode);
    }
  }, [viewMode, isLoaded]);

  const loadViewMode = async () => {
    try {
      const savedViewMode = await AsyncStorage.getItem(VIEW_MODE_STORAGE_KEY);
      if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'list')) {
        setViewMode(savedViewMode as ViewMode);
      }
    } catch (error) {
      console.warn('Failed to load saved view mode:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveViewMode = async (viewModeToSave: ViewMode) => {
    try {
      await AsyncStorage.setItem(VIEW_MODE_STORAGE_KEY, viewModeToSave);
    } catch (error) {
      console.warn('Failed to save view mode:', error);
    }
  };

  const updateViewMode = (newViewMode: ViewMode) => {
    setViewMode(newViewMode);
  };

  const resetViewMode = async () => {
    try {
      await AsyncStorage.removeItem(VIEW_MODE_STORAGE_KEY);
      setViewMode(defaultViewMode);
    } catch (error) {
      console.warn('Failed to reset view mode:', error);
    }
  };

  return {
    viewMode,
    isLoaded,
    updateViewMode,
    resetViewMode,
    defaultViewMode,
  };
}
