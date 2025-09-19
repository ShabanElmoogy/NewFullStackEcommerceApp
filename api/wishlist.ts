import { apiService } from './apiService';
import { useAuth } from "../store/authStore";
import { WISHLIST_URLS } from '@/constants';

// Types for wishlist
export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  discountPrice?: number;
  userId: string;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToWishlistRequest {
  productId: string;
}

// Wishlist API functions
export async function getWishlist(): Promise<Wishlist> {
  const { user } = useAuth.getState();

  if (!user) {
    throw new Error('No user found in auth store');
  }

  const userId = user.id || user.userId || user.sub || user.nameid;
  
  if (!userId) {
    throw new Error('No user ID found in user object');
  }

  return await apiService.get<Wishlist>(WISHLIST_URLS.GET_BY_USER_ID(userId), { requiresAuth: true });
}

export async function addToWishlist(productId: string): Promise<WishlistItem> {
  const requestData: AddToWishlistRequest = { productId };

  return await apiService.post<WishlistItem>(WISHLIST_URLS.ADD_ITEM, requestData, { requiresAuth: true });
}

export async function removeFromWishlist(itemId: string): Promise<void> {
  await apiService.delete(WISHLIST_URLS.REMOVE_ITEM(itemId), { requiresAuth: true });
}

export async function clearWishlist(): Promise<void> {
  const { user } = useAuth.getState();

  if (!user) {
    throw new Error('No user found in auth store');
  }

  const userId = user.id || user.userId || user.sub || user.nameid;
  
  if (!userId) {
    throw new Error('No user ID found in user object');
  }

  await apiService.delete(WISHLIST_URLS.CLEAR(userId), { requiresAuth: true });
}

// Helper functions
export async function getWishlistItemCount(): Promise<number> {
  try {
    const wishlist = await getWishlist();
    return wishlist.totalItems || 0;
  } catch (error) {
    console.error('Error getting wishlist item count:', error);
    return 0;
  }
}

export async function isProductInWishlist(productId: string): Promise<boolean> {
  try {
    const wishlist = await getWishlist();
    return wishlist.items.some(item => item.productId === productId);
  } catch (error) {
    console.error('Error checking if product is in wishlist:', error);
    return false;
  }
}

export async function toggleWishlist(productId: string): Promise<{ added: boolean; item?: WishlistItem }> {
  try {
    const isInWishlist = await isProductInWishlist(productId);
    
    if (isInWishlist) {
      const wishlist = await getWishlist();
      const item = wishlist.items.find(item => item.productId === productId);
      if (item) {
        await removeFromWishlist(item.id);
        return { added: false };
      }
    } else {
      const item = await addToWishlist(productId);
      return { added: true, item };
    }
    
    return { added: false };
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    throw error;
  }
}
