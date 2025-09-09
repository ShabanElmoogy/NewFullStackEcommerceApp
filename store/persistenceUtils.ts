import { StateCreator } from 'zustand';
import { create } from 'zustand';

// Platform detection
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
const isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Storage interface
interface Storage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

// Get storage implementation
const getStorage = (): Storage => {
  if (isReactNative) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return AsyncStorage;
    } catch (error) {
      console.warn('AsyncStorage not available:', error);
      return createMemoryStorage();
    }
  } else if (isWeb) {
    return {
      getItem: (name: string) => localStorage.getItem(name),
      setItem: (name: string, value: string) => localStorage.setItem(name, value),
      removeItem: (name: string) => localStorage.removeItem(name),
    };
  } else {
    return createMemoryStorage();
  }
};

// Memory storage fallback
const createMemoryStorage = (): Storage => {
  const memoryStorage: { [key: string]: string } = {};
  return {
    getItem: (name: string) => memoryStorage[name] || null,
    setItem: (name: string, value: string) => { memoryStorage[name] = value; },
    removeItem: (name: string) => { delete memoryStorage[name]; },
  };
};

// Persistence configuration
export interface PersistConfig<T> {
  name: string;
  partialize?: (state: T) => Partial<T>;
  onRehydrateStorage?: (state: T) => void;
}

// Manual persistence implementation to avoid import.meta issues
export const createPersistentStore = <T>(
  stateCreator: StateCreator<T>,
  config: PersistConfig<T>
) => {
  const storage = getStorage();
  
  // Enhanced state creator with persistence
  const persistentStateCreator: StateCreator<T> = (set, get, api) => {
    // Wrap the set function to persist changes
    const persistentSet = (partial: any, replace?: boolean) => {
      set(partial, replace);
      
      // Persist the state after setting it
      setTimeout(async () => {
        try {
          const currentState = get();
          const stateToPersist = config.partialize ? config.partialize(currentState) : currentState;
          await storage.setItem(config.name, JSON.stringify(stateToPersist));
        } catch (error) {
          console.warn(`Failed to persist state for ${config.name}:`, error);
        }
      }, 0);
    };

    return stateCreator(persistentSet, get, api);
  };

  // Create the store
  const store = create<T>()(persistentStateCreator);

  // Load persisted state on initialization
  const loadPersistedState = async () => {
    try {
      const persistedData = await storage.getItem(config.name);
      if (persistedData) {
        const parsedData = JSON.parse(persistedData);
        const stateToRestore = config.partialize ? config.partialize(parsedData) : parsedData;
        
        // Merge with current state to preserve functions
        const currentState = store.getState();
        const mergedState = { ...currentState, ...stateToRestore };
        
        // Use replace = false to preserve all functions and methods
        store.setState(mergedState as T, false);
        
        if (config.onRehydrateStorage) {
          config.onRehydrateStorage(store.getState());
        }
      }
    } catch (error) {
      console.warn(`Failed to load persisted state for ${config.name}:`, error);
    }
  };

  // Load persisted state
  loadPersistedState();

  return store;
};

// Helper functions
export const clearPersistedData = async (storeName: string) => {
  try {
    const storage = getStorage();
    await storage.removeItem(storeName);
  } catch (error) {
    console.warn(`Failed to clear persisted data (${storeName}):`, error);
  }
};

export const getPersistedData = async (storeName: string) => {
  try {
    const storage = getStorage();
    const data = await storage.getItem(storeName);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn(`Failed to get persisted data (${storeName}):`, error);
    return null;
  }
};

// Legacy web storage helpers
export const webStorage = {
  save: (key: string, data: any) => {
    try {
      if (isWeb) {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.warn(`Failed to save to localStorage (${key}):`, error);
    }
  },
  load: (key: string) => {
    try {
      if (isWeb) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.warn(`Failed to load from localStorage (${key}):`, error);
    }
    return null;
  },
  remove: (key: string) => {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Failed to remove from localStorage (${key}):`, error);
    }
  }
};