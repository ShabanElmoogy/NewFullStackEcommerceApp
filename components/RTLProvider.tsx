import React, { createContext, useContext, useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';
import { useSettings, TextDirection } from '@/store/settingsStore';

interface RTLContextType {
  isRTL: boolean;
  textDirection: TextDirection;
  setTextDirection: (direction: TextDirection) => void;
  toggleTextDirection: () => void;
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

export const useRTL = () => {
  const context = useContext(RTLContext);
  if (!context) {
    throw new Error('useRTL must be used within an RTLProvider');
  }
  return context;
};

interface RTLProviderProps {
  children: React.ReactNode;
}

export const RTLProvider: React.FC<RTLProviderProps> = ({ children }) => {
  const { textDirection, setTextDirection, toggleTextDirection } = useSettings();
  const isRTL = textDirection === 'rtl';

  useEffect(() => {
    // Force RTL layout when direction changes
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(isRTL);
    }

    // Update document direction for web
    if (Platform.OS === 'web') {
      if (typeof document !== 'undefined') {
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = isRTL ? 'ar' : 'en';
      }
    }
  }, [isRTL]);

  const contextValue: RTLContextType = {
    isRTL,
    textDirection,
    setTextDirection,
    toggleTextDirection,
  };

  return (
    <RTLContext.Provider value={contextValue}>
      {children}
    </RTLContext.Provider>
  );
};