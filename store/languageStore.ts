import { create } from 'zustand';
import { I18nManager, Platform } from 'react-native';
import i18n, { getLanguage, setLanguage } from '../utils/i18n';

interface LanguageState {
  language: string;
  key: number;
  isRTL: boolean;
  toggleLanguage: () => void;
  initializeLanguage: () => Promise<void>;
  handleLanguageChange: (lang: string, showAlert?: boolean) => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',
  key: 0,
  isRTL: false,

  initializeLanguage: async () => {
    const lang = await getLanguage();
    get().handleLanguageChange(lang, false);
  },

  handleLanguageChange: async (lang: string, showAlert = true) => {
    const isRTL = lang === 'ar';

    // Save language first
    await setLanguage(lang);
    
    // Enable RTL support for all platforms
    I18nManager.allowRTL(true);
    
    // For native platforms, we need to force the RTL state
    if (Platform.OS !== 'web') {
      I18nManager.forceRTL(isRTL);
    }
    
    // Update state - key change forces re-render without restart
    set((state) => ({
      language: lang,
      isRTL,
      key: state.key + 1, // Force re-render of root component
    }));

    // For web platform
    if (Platform.OS === 'web') {
      if (typeof document !== 'undefined') {
        document.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        // Also set the body direction for better support
        document.body.dir = isRTL ? 'rtl' : 'ltr';
      }
    }
  },

  toggleLanguage: () => {
    const currentLanguage = get().language;
    get().handleLanguageChange(currentLanguage === 'en' ? 'ar' : 'en');
  },
}));