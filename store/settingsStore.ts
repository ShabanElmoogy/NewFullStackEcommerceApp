import { createPersistentStore } from './persistenceUtils';

export type TextDirection = 'ltr' | 'rtl';

interface SettingsState {
  notificationsEnabled: boolean;
  orderNotifications: boolean;
  promotionNotifications: boolean;
  appNotifications: boolean;
  language: string;
  textDirection: TextDirection;
  setNotificationsEnabled: (enabled: boolean) => void;
  setOrderNotifications: (enabled: boolean) => void;
  setPromotionNotifications: (enabled: boolean) => void;
  setAppNotifications: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
  setTextDirection: (direction: TextDirection) => void;
  toggleTextDirection: () => void;
}

const settingsStoreConfig = (set: any, get: any): SettingsState => ({
  notificationsEnabled: true,
  orderNotifications: true,
  promotionNotifications: true,
  appNotifications: true,
  language: 'en',
  textDirection: 'ltr',
  
  setNotificationsEnabled: (enabled: boolean) => set({ notificationsEnabled: enabled }),
  setOrderNotifications: (enabled: boolean) => set({ orderNotifications: enabled }),
  setPromotionNotifications: (enabled: boolean) => set({ promotionNotifications: enabled }),
  setAppNotifications: (enabled: boolean) => set({ appNotifications: enabled }),
  setLanguage: (language: string) => set({ language: language }),
  setTextDirection: (direction: TextDirection) => set({ textDirection: direction }),
  toggleTextDirection: () => {
    const currentDirection = get().textDirection;
    set({ textDirection: currentDirection === 'ltr' ? 'rtl' : 'ltr' });
  },
});

export const useSettings = createPersistentStore<SettingsState>(
  settingsStoreConfig,
  {
    name: 'settings-storage',
    partialize: (state) => ({
      notificationsEnabled: state.notificationsEnabled,
      orderNotifications: state.orderNotifications,
      promotionNotifications: state.promotionNotifications,
      appNotifications: state.appNotifications,
      language: state.language,
      textDirection: state.textDirection,
    }),
    onRehydrateStorage: (state) => {
      console.log('Settings store rehydrated:', state);
    },
  }
);