import { useMemo } from 'react';
import { useRTL } from '../components/RTLProvider'

export const useRTLStyles = () => {
  const { isRTL } = useRTL();

  const rtlStyles = useMemo(() => ({
    // Flex direction utilities
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
    
    // Text alignment utilities
    textLeft: isRTL ? 'text-right' : 'text-left',
    textRight: isRTL ? 'text-left' : 'text-right',
    
    // Margin utilities
    ml: (size: string) => isRTL ? `mr-${size}` : `ml-${size}`,
    mr: (size: string) => isRTL ? `ml-${size}` : `mr-${size}`,
    
    // Padding utilities
    pl: (size: string) => isRTL ? `pr-${size}` : `pl-${size}`,
    pr: (size: string) => isRTL ? `pl-${size}` : `pr-${size}`,
    
    // Border utilities
    borderL: isRTL ? 'border-r' : 'border-l',
    borderR: isRTL ? 'border-l' : 'border-r',
    
    // Rounded corners
    roundedL: isRTL ? 'rounded-r' : 'rounded-l',
    roundedR: isRTL ? 'rounded-l' : 'rounded-r',
    roundedTL: isRTL ? 'rounded-tr' : 'rounded-tl',
    roundedTR: isRTL ? 'rounded-tl' : 'rounded-tr',
    roundedBL: isRTL ? 'rounded-br' : 'rounded-bl',
    roundedBR: isRTL ? 'rounded-bl' : 'rounded-br',
    
    // Position utilities
    left: (size: string) => isRTL ? `right-${size}` : `left-${size}`,
    right: (size: string) => isRTL ? `left-${size}` : `right-${size}`,
  }), [isRTL]);

  return { isRTL, ...rtlStyles };
};

// Helper function to combine RTL-aware classes
export const rtlClass = (isRTL: boolean, ltrClass: string, rtlClass: string) => {
  return isRTL ? rtlClass : ltrClass;
};

// Helper function to get RTL-aware icon rotation
export const getRTLIconRotation = (isRTL: boolean, baseRotation: number = 0) => {
  return isRTL ? baseRotation + 180 : baseRotation;
};

// Backward-compatible alias: some code may import `useRTLStyle` (singular)
export const useRTLStyle = useRTLStyles;