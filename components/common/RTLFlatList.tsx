import React, { forwardRef, useEffect, useRef, useImperativeHandle, useMemo } from 'react';
import { FlatList, FlatListProps, I18nManager, Platform } from 'react-native';
import { useLanguageStore } from '@/store/languageStore';

interface RTLFlatListProps<T> extends FlatListProps<T> {
  /**
   * Whether to automatically handle RTL behavior for horizontal lists
   * @default true
   */
  enableRTL?: boolean;
}

/**
 * RTL-aware FlatList component that automatically handles right-to-left layout
 * for horizontal lists when Arabic or other RTL languages are active.
 * 
 * For horizontal lists in RTL mode:
 * - Automatically applies `inverted` prop
 * - Handles scroll position reset on language change
 * - Maintains all original FlatList functionality
 */
function RTLFlatListComponent<T>(
  { 
    enableRTL = true,
    horizontal = false,
    inverted = false,
    data,
    contentContainerStyle,
    maintainVisibleContentPosition,
    ...props 
  }: RTLFlatListProps<T>,
  ref: React.Ref<FlatList<T>>
) {
  const { isRTL } = useLanguageStore();
  const flatListRef = useRef<FlatList<T>>(null);

  // Determine if we should apply RTL behavior
  const shouldInvert = useMemo(() => {
    if (!horizontal || !enableRTL) {
      return inverted; // Use original inverted prop for non-horizontal or disabled RTL
    }
    return isRTL || inverted; // Apply RTL inversion for horizontal lists
  }, [horizontal, enableRTL, isRTL, inverted]);

  // Forward ref to internal FlatList
  useImperativeHandle(ref, () => flatListRef.current as FlatList<T>, []);

  // Reset scroll position when RTL state changes for horizontal lists
  useEffect(() => {
    if (horizontal && enableRTL && flatListRef.current && data && data.length > 0) {
      const timer = setTimeout(() => {
        try {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
        } catch (error) {
          // Silently ignore scroll errors
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isRTL, horizontal, enableRTL, data?.length]);

  // Prepare final props for FlatList
  const finalProps: FlatListProps<T> = {
    ...props,
    data,
    horizontal,
    inverted: shouldInvert,
    contentContainerStyle,
    // For RTL horizontal lists, disable maintainVisibleContentPosition as it can cause issues
    maintainVisibleContentPosition: (horizontal && shouldInvert) 
      ? undefined 
      : maintainVisibleContentPosition,
  };

  return <FlatList ref={flatListRef} {...finalProps} />;
}

/**
 * RTL-aware FlatList component
 * 
 * Usage:
 * ```tsx
 * // Automatically handles RTL for horizontal lists
 * <RTLFlatList
 *   horizontal
 *   data={items}
 *   renderItem={renderItem}
 * />
 * 
 * // Disable RTL behavior
 * <RTLFlatList
 *   horizontal
 *   enableRTL={false}
 *   data={items}
 *   renderItem={renderItem}
 * />
 * ```
 */
export const RTLFlatList = forwardRef(RTLFlatListComponent) as <T>(
  props: RTLFlatListProps<T> & { ref?: React.Ref<FlatList<T>> }
) => React.ReactElement;

export default RTLFlatList;