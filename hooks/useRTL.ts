/**
 * RTL Hook
 * Provides RTL-aware utilities for styling and layout
 */

import { useLanguageStore } from '@/store/languageStore';

export interface RTLUtils {
  isRTL: boolean;
  getTextAlign: (align: 'left' | 'right' | 'center') => 'left' | 'right' | 'center';
  getFlexDirection: (direction: 'row' | 'row-reverse') => 'row' | 'row-reverse';
  getSpacing: (left: number, right: number) => { marginLeft: number; marginRight: number };
  getPosition: (left?: number, right?: number) => { left?: number; right?: number };
  getWritingDirection: () => 'ltr' | 'rtl';
}

export function useRTL(): RTLUtils {
  const { isRTL } = useLanguageStore();

  const getTextAlign = (align: 'left' | 'right' | 'center'): 'left' | 'right' | 'center' => {
    if (align === 'center') return 'center';
    if (isRTL) {
      return align === 'left' ? 'right' : 'left';
    }
    return align;
  };

  const getFlexDirection = (direction: 'row' | 'row-reverse'): 'row' | 'row-reverse' => {
    if (isRTL) {
      return direction === 'row' ? 'row-reverse' : 'row';
    }
    return direction;
  };

  const getSpacing = (left: number, right: number) => {
    if (isRTL) {
      return { marginLeft: right, marginRight: left };
    }
    return { marginLeft: left, marginRight: right };
  };

  const getPosition = (left?: number, right?: number) => {
    if (isRTL) {
      return { left: right, right: left };
    }
    return { left, right };
  };

  const getWritingDirection = (): 'ltr' | 'rtl' => {
    return isRTL ? 'rtl' : 'ltr';
  };

  return {
    isRTL,
    getTextAlign,
    getFlexDirection,
    getSpacing,
    getPosition,
    getWritingDirection,
  };
}