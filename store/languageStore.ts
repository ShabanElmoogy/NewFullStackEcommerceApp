import { create } from 'zustand';
import { I18nManager, Platform } from 'react-native';
import i18n, { getLanguage, setLanguage, getDeviceLanguage } from '../utils/i18n';

interface LanguageState {
  language: string;
  isRTL: boolean;
  toggleLanguage: () => void;
  initializeLanguage: () => Promise<void>;
  handleLanguageChange: (lang: string, showAlert?: boolean) => Promise<void>;
  setCultureHeaderCallback: (callback: (lang: string) => void) => void;
}

// Callback for updating API service culture header
let cultureHeaderCallback: ((lang: string) => void) | null = null;

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: getDeviceLanguage(), // Initialize with device language
  isRTL: getDeviceLanguage() === 'ar', // Set RTL based on device language

  setCultureHeaderCallback: (callback: (lang: string) => void) => {
    cultureHeaderCallback = callback;
  },

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
    
    // Update state
    set({
      language: lang,
      isRTL,
    });

    // Update API service culture header via callback
    try {
      if (cultureHeaderCallback) {
        cultureHeaderCallback(lang);
      }
    } catch (error) {
      console.warn('⚠️ Could not update API service culture header:', error);
    }

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