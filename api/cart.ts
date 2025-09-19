import { apiService } from './apiService';
import { useAuth } from "../store/authStore";
import { CART_URLS } from '@/constants';

// Types for cart
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Cart API functions
export async function getCart(): Promise<Cart> {
  const { user } = useAuth.getState();

  if (!user) {
    throw new Error('No user found in auth store');
  }

  const userId = user.id || user.userId || user.sub || user.nameid;
  
  if (!userId) {
    throw new Error('No user ID found in user object');
  }

  return await apiService.get<Cart>(CART_URLS.GET_BY_USER_ID(userId), { requiresAuth: true });
}

export async function addToCart(productId: string, quantity: number = 1): Promise<CartItem> {
  const requestData: AddToCartRequest = {
    productId,
    quantity
  };

  return await apiService.post<CartItem>(CART_URLS.ADD_ITEM, requestData, { requiresAuth: true });
}

export async function updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
  const requestData: UpdateCartItemRequest = { quantity };
  
  return await apiService.put<CartItem>(CART_URLS.UPDATE_ITEM, { ...requestData, id: itemId }, { requiresAuth: true });
}

export async function removeFromCart(itemId: string): Promise<void> {
  await apiService.delete(CART_URLS.REMOVE_ITEM(itemId), { requiresAuth: true });
}

export async function clearCart(): Promise<void> {
  const { user } = useAuth.getState();

  if (!user) {
    throw new Error('No user found in auth store');
  }

  const userId = user.id || user.userId || user.sub || user.nameid;
  
  if (!userId) {
    throw new Error('No user ID found in user object');
  }

  await apiService.delete(CART_URLS.CLEAR(userId), { requiresAuth: true });
}

// Helper functions
export async function getCartItemCount(): Promise<number> {
  try {
    const cart = await getCart();
    return cart.totalItems || 0;
  } catch (error) {
    console.error('Error getting cart item count:', error);
    return 0;
  }
}

export async function getCartTotal(): Promise<number> {
  try {
    const cart = await getCart();
    return cart.totalAmount || 0;
  } catch (error) {
    console.error('Error getting cart total:', error);
    return 0;
  }
}

export async function isProductInCart(productId: string): Promise<boolean> {
  try {
    const cart = await getCart();
    return cart.items.some(item => item.productId === productId);
  } catch (error) {
    console.error('Error checking if product is in cart:', error);
    return false;
  }
}
