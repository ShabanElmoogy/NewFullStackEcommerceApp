/**
 * API Index
 * Central export point for all API functions and types
 */

// Export the main API service
export { apiService, type ApiResponse, type ApiError, type RequestConfig } from './apiService';

// Export authentication API
export * from './auth';

// Export products API
export * from './products';

// Export categories API
export * from './categories';

// Export subcategories API
export { 
  listSubCategories, 
  getSubCategory, 
  getSubCategoriesByCategory, 
  createSubCategory, 
  updateSubCategory, 
  deleteSubCategory,
  getActiveSubCategories,
  getActiveSubCategoriesByCategory,
  type SubCategoryRequest,
  type CategoryInfo
} from './subcategories';

// Export orders API
export * from './orders';

// Export cart API
export * from './cart';

// Export wishlist API
export * from './wishlist';

// Export user/profile API
export * from './user';

// Import individual functions for re-export
import { login, register, logout, isAuthenticated } from './auth';
import { listProducts, getProduct, searchProducts } from './products';
import { listCategories, getCategory, getActiveCategories } from './categories';
import { createOrder, getUserOrders, getOrderById } from './orders';
import { getCart, addToCart, removeFromCart, clearCart } from './cart';
import { getWishlist, addToWishlist, removeFromWishlist, toggleWishlist } from './wishlist';
import { getProfile, updateProfile, changePassword } from './user';

// Re-export commonly used functions for convenience
export {
  // Auth
  login,
  register,
  logout,
  isAuthenticated,
  
  // Products
  listProducts,
  getProduct,
  searchProducts,
  
  // Categories
  listCategories,
  getCategory,
  getActiveCategories,
  
  // Orders
  createOrder,
  getUserOrders,
  getOrderById,
  
  // Cart
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  
  // Wishlist
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  
  // User
  getProfile,
  updateProfile,
  changePassword,
};

// Export grouped API functions
export const authAPI = {
  login,
  register,
  logout,
  isAuthenticated,
};

export const productsAPI = {
  listProducts,
  getProduct,
  searchProducts,
};

export const categoriesAPI = {
  listCategories,
  getCategory,
  getActiveCategories,
};

export const ordersAPI = {
  createOrder,
  getUserOrders,
  getOrderById,
};

export const cartAPI = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

export const wishlistAPI = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
};

export const userAPI = {
  getProfile,
  updateProfile,
  changePassword,
};
