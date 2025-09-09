import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { useLanguageStore } from '@/store/languageStore';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { key, initializeLanguage, language, isRTL } = useLanguageStore();

  useEffect(() => {
    (async () => {
      await initializeLanguage();
    })();
  }, []);

  // Sync RTL state on mount and language change
  useEffect(() => {
    if (Platform.OS === 'web') {
      if (typeof document !== 'undefined') {
        document.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        // Add RTL class to body for Tailwind
        if (isRTL) {
          document.documentElement.classList.add('rtl');
        } else {
          document.documentElement.classList.remove('rtl');
        }
      }
    }
  }, [isRTL, language]);

  // For mobile, wrap in a View with direction style
  if (Platform.OS !== 'web') {
    return (
      <View key={key} style={{ flex: 1, direction: isRTL ? 'rtl' : 'ltr' }}>
        {children}
      </View>
    );
  }

  return <React.Fragment key={key}>{children}</React.Fragment>;
};