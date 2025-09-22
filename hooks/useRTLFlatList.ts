import { useEffect, useRef, useCallback } from 'react';
import { FlatList, I18nManager, Platform } from 'react-native';
import { useLanguageStore } from '@/store/languageStore';

/**
 * Custom hook for RTL-aware FlatList behavior
 * Ensures both RTL and LTR modes start with the same first item
 * Uses a more aggressive approach to force correct positioning
 */
export function useRTLFlatList<T>(data: T[] | null | undefined) {
  const { isRTL } = useLanguageStore();
  const flatListRef = useRef<FlatList<T>>(null);

  // Aggressive scroll to start position
  const forceScrollToStart = useCallback(() => {
    if (!flatListRef.current || !data || data.length === 0) return;

    // Use multiple strategies to ensure correct positioning
    const scrollStrategies = [
      () => flatListRef.current?.scrollToOffset({ offset: 0, animated: false }),
      () => flatListRef.current?.scrollToIndex({ index: 0, animated: false, viewPosition: 0 }),
      () => flatListRef.current?.scrollToIndex({ index: 0, animated: false, viewOffset: 0 }),
    ];

    // Execute strategies with different delays
    const delays = [0, 50, 150, 300, 500];
    
    delays.forEach((delay) => {
      setTimeout(() => {
        scrollStrategies.forEach((strategy) => {
          try {
            strategy();
          } catch (error) {
            // Ignore errors
          }
        });
      }, delay);
    });
  }, [data]);

  // Reset scroll position when RTL state changes
  useEffect(() => {
    forceScrollToStart();
  }, [isRTL, forceScrollToStart]);

  // Handle layout and content size changes
  const handleLayout = useCallback(() => {
    setTimeout(() => forceScrollToStart(), 50);
  }, [forceScrollToStart]);

  const handleContentSizeChange = useCallback(() => {
    setTimeout(() => forceScrollToStart(), 50);
  }, [forceScrollToStart]);

  return {
    flatListRef,
    isRTL,
    forceScrollToStart,
    // RTL-aware props for horizontal FlatList
    getRTLProps: (horizontal: boolean = false) => {
      return {
        key: `flatlist-${isRTL}`,
        inverted: false,
        initialScrollIndex: 0,
        onLayout: handleLayout,
        onContentSizeChange: handleContentSizeChange,
        // Disable momentum scrolling to prevent unwanted scroll behavior
        decelerationRate: 'fast',
        // Ensure consistent behavior
        showsHorizontalScrollIndicator: false,
      };
    },
  };
}

export default useRTLFlatList;