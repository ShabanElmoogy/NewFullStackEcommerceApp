import { useState, useEffect } from 'react';
import { useSettings } from '@/store/settingsStore';
import { 
  setLocale, 
  getCurrentLocale, 
  getLocaleInfo, 
  isRTLLocale, 
  SUPPORTED_LOCALES,
  t 
} from '@/utils/i18n';

export const useLocalization = () => {
  const { language, setLanguage, textDirection, setTextDirection } = useSettings();
  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale());

  // Update locale when language changes in settings
  useEffect(() => {
    if (language !== currentLocale) {
      const localeInfo = setLocale(language);
      setCurrentLocale(language);
      
      // Update text direction based on locale
      const newDirection = localeInfo.isRTL ? 'rtl' : 'ltr';
      if (textDirection !== newDirection) {
        setTextDirection(newDirection);
      }
    }
  }, [language, currentLocale, textDirection, setTextDirection]);

  // Change language and update all related settings
  const changeLanguage = (localeCode: string) => {
    const localeInfo = setLocale(localeCode);
    setLanguage(localeCode);
    setCurrentLocale(localeCode);
    
    // Update text direction
    const newDirection = localeInfo.isRTL ? 'rtl' : 'ltr';
    setTextDirection(newDirection);
    
    return localeInfo;
  };

  // Get current locale info
  const getLocaleDetails = () => {
    return getLocaleInfo(currentLocale);
  };

  // Check if current locale is RTL
  const isRTL = () => {
    return isRTLLocale(currentLocale);
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
    isRTL: isRTL(),
    getSupportedLocales,
    translate,
    t: translate, // Alias for convenience
  };
};