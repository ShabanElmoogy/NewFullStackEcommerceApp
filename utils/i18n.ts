import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from '../locales/en.json';
import ar from '../locales/ar.json';

// Create i18n instance
const i18n = new I18n({
  en,
  ar,
});

// ✅ Fix: Use getLocales() instead of Localization.locale
const locales = Localization.getLocales();
i18n.locale = locales.length > 0 ? locales[0].languageCode ?? 'en' : 'en';

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

export const getLocaleInfo = (localeCode: string) => {
  return SUPPORTED_LOCALES.find(locale => locale.code === localeCode) || SUPPORTED_LOCALES[0];
};

export const setLocale = (localeCode: string) => {
  const localeInfo = getLocaleInfo(localeCode);
  i18n.locale = localeCode;
  return localeInfo;
};

export const getCurrentLocale = () => {
  return i18n.locale;
};

export const t = (key: string, options?: any) => {
  return i18n.t(key, options);
};

export default i18n;
