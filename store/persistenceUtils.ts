import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateCreator } from 'zustand';
import { create } from 'zustand';

export interface PersistConfig<T> {
  name: string;
  partialize?: (state: T) => Partial<T>;
  onRehydrateStorage?: (state: T) => void;
}

// Simple RN-only persistent store factory
export const createPersistentStore = <T>(
  stateCreator: StateCreator<T>,
  config: PersistConfig<T>
) => {
  // Wrap set() to persist after each update without blocking UI
  const persistentStateCreator: StateCreator<T> = (set, get, api) => {
    const persist = async () => {
      try {
        const current = get();
        const toPersist = config.partialize ? config.partialize(current) : (current as any);
        await AsyncStorage.setItem(config.name, JSON.stringify(toPersist));
      } catch (error) {
        console.warn(`Failed to persist state for ${config.name}:`, error);
      }
    };

    const persistentSet = (partial: any, replace?: boolean) => {
      set(partial, replace);
      // Schedule persistence to the next tick
      setTimeout(persist, 0);
    };

    return stateCreator(persistentSet, get, api);
  };

  const store = create<T>()(persistentStateCreator);

  // Initial hydration (RN-only)
  (async () => {
    try {
      const saved = await AsyncStorage.getItem(config.name);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      const restored = config.partialize ? (config.partialize as any)(parsed) : parsed;

      // Merge strategy: keep runtime changes and merge items by product.id if both sides have items
      const current: any = store.getState();
      let merged: any = { ...current, ...restored };

      const currItems = Array.isArray(current.items) ? current.items : [];
      const persistedItems = Array.isArray(restored.items) ? restored.items : [];

      if (currItems.length === 0) {
        merged.items = persistedItems;
      } else if (persistedItems.length === 0) {
        merged.items = currItems;
      } else {
        const byId = new Map<any, any>();
        for (const it of persistedItems) {
          const id = it?.product?.id ?? it?.id;
          if (id != null) byId.set(id, { ...it });
        }
        for (const it of currItems) {
          const id = it?.product?.id ?? it?.id;
          if (id != null) {
            if (byId.has(id)) {
              const ex = byId.get(id);
              byId.set(id, {
                ...ex,
                quantity: (ex.quantity ?? 0) + (it.quantity ?? 0),
                product: it.product ?? ex.product,
              });
            } else {
              byId.set(id, { ...it });
            }
          }
        }
        merged.items = Array.from(byId.values());
      }

      // Replace=false to preserve store functions
      store.setState(merged as T, false);
      config.onRehydrateStorage?.(store.getState());
    } catch (error) {
      console.warn(`Failed to load persisted state for ${config.name}:`, error);
    }
  })();

  return store;
};

export const clearPersistedData = async (storeName: string) => {
  try {
    await AsyncStorage.removeItem(storeName);
  } catch (error) {
    console.warn(`Failed to clear persisted data (${storeName}):`, error);
  }
};

export const getPersistedData = async (storeName: string) => {
  try {
    const data = await AsyncStorage.getItem(storeName);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn(`Failed to get persisted data (${storeName}):`, error);
    return null;
  }
};
