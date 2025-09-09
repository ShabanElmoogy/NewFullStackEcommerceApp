import { clearPersistedData, getPersistedData } from './persistenceUtils';

// Store names for easy reference
export const STORE_NAMES = {
  AUTH: 'auth-storage',
  CART: 'cart-storage',
  WISHLIST: 'wishlist-storage',
  SETTINGS: 'settings-storage',
} as const;

// Clear all persisted data (useful for logout or reset)
export const clearAllPersistedData = async () => {
  try {
    await Promise.all([
      clearPersistedData(STORE_NAMES.AUTH),
      clearPersistedData(STORE_NAMES.CART),
      clearPersistedData(STORE_NAMES.WISHLIST),
      clearPersistedData(STORE_NAMES.SETTINGS),
    ]);
    console.log('All persisted data cleared successfully');
  } catch (error) {
    console.error('Error clearing persisted data:', error);
  }
};

// Get all persisted data (useful for debugging)
export const getAllPersistedData = async () => {
  try {
    const [authData, cartData, wishlistData, settingsData] = await Promise.all([
      getPersistedData(STORE_NAMES.AUTH),
      getPersistedData(STORE_NAMES.CART),
      getPersistedData(STORE_NAMES.WISHLIST),
      getPersistedData(STORE_NAMES.SETTINGS),
    ]);

    return {
      auth: authData,
      cart: cartData,
      wishlist: wishlistData,
      settings: settingsData,
    };
  } catch (error) {
    console.error('Error getting persisted data:', error);
    return null;
  }
};

// Clear specific store data
export const clearStoreData = async (storeName: keyof typeof STORE_NAMES) => {
  try {
    await clearPersistedData(STORE_NAMES[storeName]);
    console.log(`${storeName} store data cleared successfully`);
  } catch (error) {
    console.error(`Error clearing ${storeName} store data:`, error);
  }
};

// Debug function to log all store states
export const debugStores = async () => {
  const data = await getAllPersistedData();
  console.log('=== STORE DEBUG INFO ===');
  console.log('Auth Store:', data?.auth);
  console.log('Cart Store:', data?.cart);
  console.log('Wishlist Store:', data?.wishlist);
  console.log('========================');
};

// Migration helper for future store structure changes
export const migrateStoreData = async (storeName: string, migrationFn: (data: any) => any) => {
  try {
    const existingData = await getPersistedData(storeName);
    if (existingData) {
      const migratedData = migrationFn(existingData);
      // The migration would be handled by the persistence utility
      console.log(`Migration completed for ${storeName}`);
      return migratedData;
    }
  } catch (error) {
    console.error(`Migration failed for ${storeName}:`, error);
  }
  return null;
};