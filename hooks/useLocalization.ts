import { useState, useEffect } from 'react';
import { useSettings } from '@/store/settingsStore';
import { 
  setLocale, 
  getCurrentLocale, 
  getLocaleInfo, 
  SUPPORTED_LOCALES,
  t 
} from '@/utils/i18n';

export const useLocalization = () => {
  const { language, setLanguage } = useSettings();
  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale());

  // Update locale when language changes in settings
  useEffect(() => {
    if (language !== currentLocale) {
      const localeInfo = setLocale(language);
      setCurrentLocale(language);
    }
  }, [language, currentLocale]);

  // Change language and update all related settings
  const changeLanguage = (localeCode: string) => {
    const localeInfo = setLocale(localeCode);
    setLanguage(localeCode);
    setCurrentLocale(localeCode);
    return localeInfo;
  };

  // Get current locale info
  const getLocaleDetails = () => {
    return getLocaleInfo(currentLocale);
  };

  // Get all supported locales
  const getSupportedLocales = () => {
    return SUPPORTED_LOCALES;
  };

  // Translation function
  const translate = (key: string, options?: any) => {
    return t(key, options);
  };

  return {
    currentLocale,
    changeLanguage,
    getLocaleDetails,
    getSupportedLocales,
    translate,
    t: translate, // Alias for convenience
  };
};