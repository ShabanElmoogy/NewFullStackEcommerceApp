import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'en', // default language
  fallbackLng: 'en',
  resources: { en: { translation: en }, ar: { translation: ar } },
  interpolation: { escapeValue: false },
});

export const setLanguage = async (lang: string) => {
  await AsyncStorage.setItem('appLanguage', lang);
  i18n.changeLanguage(lang);
};

export const getLanguage = async () => {
  const lang = await AsyncStorage.getItem('appLanguage');
  return lang || 'en';
};

export default i18n;