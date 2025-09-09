import React from 'react';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeToastProps {
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'center';
}

export const SafeToast: React.FC<SafeToastProps> = ({ children, placement = 'top' }) => {
  const insets = useSafeAreaInsets();
  
  // Only add top padding for top placement toasts
  const topPadding = placement === 'top' ? insets.top + 10 : 0;
  const bottomPadding = placement === 'bottom' ? insets.bottom + 10 : 0;
  
  return (
    <View 
      style={{ 
        paddingTop: topPadding,
        paddingBottom: bottomPadding,
        paddingHorizontal: 16,
      }}
    >
      {children}
    </View>
  );
};