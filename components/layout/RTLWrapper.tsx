import React, { useEffect } from 'react';
import { View, Platform, I18nManager } from 'react-native';
import { useLanguageStore } from '@/store/languageStore';

interface RTLWrapperProps {
  children: React.ReactNode;
}

export function RTLWrapper({ children }: RTLWrapperProps) {
  const { isRTL, key, initializeLanguage } = useLanguageStore();

  useEffect(() => {
    initializeLanguage();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      I18nManager.forceRTL(isRTL);
    }
  }, [isRTL]);

  return (
    <View
      key={key}
      style={{
        flex: 1,
        flexDirection: 'column',
        // 👇 this is the important part
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </View>
  );
}
