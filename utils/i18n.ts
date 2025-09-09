import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

// Get device language for initial setup
const deviceLanguage = (() => {
  const deviceLocale = Localization.getLocales()[0];
  const languageCode = deviceLocale?.languageCode || 'en';
  const supportedLanguages = ['en', 'ar'];
  return supportedLanguages.includes(languageCode) ? languageCode : 'en';
})();

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: deviceLanguage, // Use device language as default
  fallbackLng: 'en',
  resources: { en: { translation: en }, ar: { translation: ar } },
  interpolation: { escapeValue: false },
});

export const setLanguage = async (lang: string) => {
  await AsyncStorage.setItem('appLanguage', lang);
  i18n.changeLanguage(lang);
};

export const getDeviceLanguage = () => {
  const deviceLocale = Localization.getLocales()[0];
  const languageCode = deviceLocale?.languageCode || 'en';
  
  // Check if device language is supported, otherwise default to English
  const supportedLanguages = ['en', 'ar'];
  return supportedLanguages.includes(languageCode) ? languageCode : 'en';
};

export const getLanguage = async () => {
  // First check if user has manually selected a language
  const userSelectedLang = await AsyncStorage.getItem('appLanguage');
  
  // If user hasn't selected a language, use device language
  if (!userSelectedLang) {
    const deviceLang = getDeviceLanguage();
    return deviceLang;
  }
  
  return userSelectedLang;
};

export default i18n;