import { useMemo } from 'react';
import { useLanguageStore } from '@/store/languageStore';

export const useRTLStyles = () => {
  const { isRTL } = useLanguageStore();

  const rtlStyles = useMemo(() => ({
    // Simple direction indicator
    direction: isRTL ? 'rtl' : 'ltr',
    
    // For components that need conditional RTL classes
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
    
    // Text alignment (prefer start/end over left/right)
    textAlign: isRTL ? 'text-right' : 'text-left',
  }), [isRTL]);

  return { isRTL, ...rtlStyles };
};

// Helper function to combine RTL-aware classes
export const rtlClass = (isRTL: boolean, ltrClass: string, rtlClass: string) => {
  return isRTL ? rtlClass : ltrClass;
};

// Helper function for RTL-aware transforms (for icons that need flipping)
export const getRTLTransform = (isRTL: boolean) => {
  return isRTL ? [{ scaleX: -1 }] : [{ scaleX: 1 }];
};

// Backward-compatible alias
export const useRTLStyle = useRTLStyles;