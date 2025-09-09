import { useLanguageStore } from '@/store/languageStore';
import { I18nManager, Platform } from 'react-native';

export const useRTL = () => {
  const { isRTL, language } = useLanguageStore();

  // Helper function to get RTL-aware styles
  const getRTLStyle = (ltrStyle: any, rtlStyle: any) => {
    return isRTL ? rtlStyle : ltrStyle;
  };

  // Helper function for text alignment
  const getTextAlign = (defaultAlign: 'left' | 'right' | 'center' = 'left') => {
    if (defaultAlign === 'center') return 'center';
    return isRTL ? 'right' : 'left';
  };

  // Helper function for flex direction
  const getFlexDirection = (defaultDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse' = 'row') => {
    if (defaultDirection === 'column' || defaultDirection === 'column-reverse') {
      return defaultDirection;
    }
    return isRTL ? 'row-reverse' : 'row';
  };

  // Helper function for margin/padding
  const getSpacing = (left: number, right: number) => {
    return isRTL ? { marginLeft: right, marginRight: left } : { marginLeft: left, marginRight: right };
  };

  // Helper function for positioning
  const getPosition = (left?: number, right?: number) => {
    if (left !== undefined && right !== undefined) {
      return isRTL ? { left: right, right: left } : { left, right };
    }
    if (left !== undefined) {
      return isRTL ? { right: left } : { left };
    }
    if (right !== undefined) {
      return isRTL ? { left: right } : { right };
    }
    return {};
  };

  // Helper function for transform
  const getTransform = (translateX: number) => {
    return [{ translateX: isRTL ? -translateX : translateX }];
  };

  return {
    isRTL,
    language,
    getRTLStyle,
    getTextAlign,
    getFlexDirection,
    getSpacing,
    getPosition,
    getTransform,
  };
};