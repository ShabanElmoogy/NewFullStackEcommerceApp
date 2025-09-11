/**
 * App Routes Constants
 * Centralized URL definitions for the application
 */

// Base API URL from environment variables
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

// API Version
const API_VERSION = 'v1';

// Full API URL with version
const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// Authentication URLs
export const AUTH_URLS = {
  LOGIN: `${API_URL}/Auth/Login`,
  REGISTER: `${API_URL}/Auth/Register`,
  REFRESH_TOKEN: `${API_URL}/Auth/RefreshToken`,
  LOGOUT: `${API_URL}/Auth/Logout`,
  FORGOT_PASSWORD: `${API_URL}/Auth/ForgotPassword`,
  RESET_PASSWORD: `${API_URL}/Auth/ResetPassword`,
} as const;

// Products URLs
export const PRODUCT_URLS = {
  GET_ALL: `${API_URL}/Products/GetAll`,
  GET_BY_ID: (id: string | number) => `${API_URL}/Products/GetById/${id}`,
  CREATE: `${API_URL}/Products/Create`,
  UPDATE: (id: string | number) => `${API_URL}/Products/Update/${id}`,
  DELETE: (id: string | number) => `${API_URL}/Products/Delete/${id}`,
  SEARCH: `${API_URL}/Products/Search`,
  BY_CATEGORY: (categoryId: string | number) => `${API_URL}/Products/Category/${categoryId}`,
} as const;

// Orders URLs
export const ORDER_URLS = {
  CREATE: `${API_URL}/Orders/Create`,
  GET_BY_USER_ID: (userId: string | number) => `${API_URL}/Orders/GetByUserId/${userId}`,
  GET_BY_ID: (orderId: string | number) => `${API_URL}/Orders/${orderId}`,
  UPDATE_STATUS: (orderId: string | number) => `${API_URL}/Orders/UpdateStatus/${orderId}`,
  CANCEL: (orderId: string | number) => `${API_URL}/Orders/Cancel/${orderId}`,
} as const;

// Categories URLs
export const CATEGORY_URLS = {
  GET_ALL: `${API_URL}/Categories/GetAll`,
  GET_BY_ID: (id: string | number) => `${API_URL}/Categories/GetById/${id}`,
  CREATE: `${API_URL}/Categories/Add`,
  UPDATE: `${API_URL}/Categories/Update`,
  DELETE: (id: string | number) => `${API_URL}/Categories/Delete/${id}`,
} as const;

// SubCategories URLs
export const SUBCATEGORY_URLS = {
  GET_ALL: `${API_URL}/Subcategories/GetAll`,
  GET_BY_ID: (id: string | number) => `${API_URL}/Subcategories/GetById/${id}`,
  GET_BY_CATEGORY: (categoryId: string | number) => `${API_URL}/Subcategories/GetAllRelatedToCategory?CategoryId=${categoryId}`,
  CREATE: `${API_URL}/Subcategories/Add`,
  UPDATE: `${API_URL}/Subcategories/Update`,
  DELETE: (id: string | number) => `${API_URL}/Subcategories/Delete/${id}`,
} as const;

// User/Profile URLs
export const USER_URLS = {
  PROFILE: `${API_URL}/User/Profile`,
  UPDATE_PROFILE: `${API_URL}/User/UpdateProfile`,
  CHANGE_PASSWORD: `${API_URL}/User/ChangePassword`,
  DELETE_ACCOUNT: `${API_URL}/User/DeleteAccount`,
} as const;

// Cart URLs
export const CART_URLS = {
  GET_BY_USER_ID: (userId: string | number) => `${API_URL}/Cart/GetByUserId/${userId}`,
  ADD_ITEM: `${API_URL}/Cart/AddItem`,
  UPDATE_ITEM: `${API_URL}/Cart/UpdateItem`,
  REMOVE_ITEM: (itemId: string | number) => `${API_URL}/Cart/RemoveItem/${itemId}`,
  CLEAR: (userId: string | number) => `${API_URL}/Cart/Clear/${userId}`,
} as const;

// Wishlist URLs
export const WISHLIST_URLS = {
  GET_BY_USER_ID: (userId: string | number) => `${API_URL}/Wishlist/GetByUserId/${userId}`,
  ADD_ITEM: `${API_URL}/Wishlist/AddItem`,
  REMOVE_ITEM: (itemId: string | number) => `${API_URL}/Wishlist/RemoveItem/${itemId}`,
  CLEAR: (userId: string | number) => `${API_URL}/Wishlist/Clear/${userId}`,
} as const;

// All URLs combined for easy access
export const APP_URLS = {
  AUTH: AUTH_URLS,
  PRODUCTS: PRODUCT_URLS,
  ORDERS: ORDER_URLS,
  CATEGORIES: CATEGORY_URLS,
  USER: USER_URLS,
  CART: CART_URLS,
  WISHLIST: WISHLIST_URLS,
} as const;

// Export base URLs for reference
export const BASE_URLS = {
  API_BASE_URL,
  API_URL,
  API_VERSION,
} as const;