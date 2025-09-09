import { createPersistentStore, clearPersistedData } from './persistenceUtils';

interface AuthState {
  user: any | null;   // replace `any` with your User type if available
  token: string | null;
  returnUrl: string | null;  // Added missing returnUrl property
  isAuthenticated: boolean;  // Added computed property for easier auth checks
  isLoading: boolean;        // Added for loading state management
  setUser: (user: any | null) => void;
  setToken: (token: string | null) => void;
  setReturnUrl: (url: string) => void;
  clearReturnUrl: () => void;  // Added missing method
  logout: () => void;
  setLoading: (loading: boolean) => void;  // Added loading setter
}

const authStoreConfig = (set: any, get: any) => ({
  user: null,
  token: null,
  returnUrl: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user: any) => {
    set({
      user,
      isAuthenticated: !!user
    });
  },

  setToken: (token: string | null) => {
    set({ token });
  },

  setReturnUrl: (url: string) => set({ returnUrl: url }),

  clearReturnUrl: () => set({ returnUrl: null }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  logout: () => {
    set({
      user: null,
      token: null,
      returnUrl: null,
      isAuthenticated: false
    });
    // Clear persisted data
    clearPersistedData('auth-storage');
  }
});

export const useAuth = createPersistentStore<AuthState>(
  authStoreConfig,
  {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
    }),
    onRehydrateStorage: (state) => {
      console.log('Auth store rehydrated:', { 
        hasUser: !!state.user, 
        hasToken: !!state.token,
        isAuthenticated: state.isAuthenticated 
      });
    }
  }
);