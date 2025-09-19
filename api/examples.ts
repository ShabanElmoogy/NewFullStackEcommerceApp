/**
 * API Service Usage Examples
 * 
 * This file contains examples of how to use the new axios-based API service
 * in your React Native components and hooks.
 */

import { apiService } from './apiService';
import { 
  login, 
  listProducts, 
  addToCart, 
  getWishlist,
  createOrder,
  getProfile,
  getCart,
  clearCart,
  getUserOrders,
  logout
} from './index';

// Example 1: Basic API calls in a component
export const BasicUsageExample = () => {
  const handleLogin = async () => {
    try {
      const response = await login('username', 'password');
      
      // Token is automatically set for future requests
      const profile = await getProfile();
      
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleFetchProducts = async () => {
    try {
      const products = await listProducts({
        pageSize: 10,
        sortBy: 'name',
        sortOrder: 'asc'
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  return { handleLogin, handleFetchProducts };
};

// Example 2: Using with React Query (recommended)
export const ReactQueryExample = () => {
  // This is how your existing hooks work with the new API service
  // Note: This is just an example - you would import useQuery from @tanstack/react-query
  const useProductsWithFilters = (filters: any) => {
    // return useQuery({
    //   queryKey: ['products', filters],
    //   queryFn: () => listProducts(filters),
    //   staleTime: 5 * 60 * 1000, // 5 minutes
    // });
    return { data: null, isLoading: false, error: null }; // Placeholder
  };

  return { useProductsWithFilters };
};

// Example 3: Error handling
export const ErrorHandlingExample = () => {
  const handleApiCallWithErrorHandling = async () => {
    try {
      const products = await listProducts();
      return products;
    } catch (error: any) {
      // The API service provides structured error objects
      if (error.status === 401) {
        // Redirect to login
      } else if (error.status === 403) {
        // Show access denied message
      } else if (error.status >= 500) {
        // Show server error message
      } else {
        // Show generic error message
      }
      throw error;
    }
  };

  return { handleApiCallWithErrorHandling };
};

// Example 4: File upload
export const FileUploadExample = () => {
  const handleProfileImageUpload = async (imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const result = await apiService.uploadFile('/User/UploadProfileImage', formData, {
        requiresAuth: true
      });

      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  return { handleProfileImageUpload };
};

// Example 5: Request cancellation
export const RequestCancellationExample = () => {
  const handleCancellableRequest = async () => {
    const cancelToken = apiService.createCancelToken();

    try {
      const products = await apiService.get('/Products/GetAll', {
        cancelToken: cancelToken.token
      });
      return products;
    } catch (error) {
      if (apiService.isCancel(error)) {
      } else {
        console.error('Request failed:', error);
      }
      throw error;
    }
  };

  // Cancel the request (e.g., when component unmounts)
  const cancelRequest = (cancelToken: any) => {
    cancelToken.cancel('Request cancelled by user');
  };

  return { handleCancellableRequest, cancelRequest };
};

// Example 6: Shopping cart operations
export const ShoppingCartExample = () => {
  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    try {
      const cartItem = await addToCart(productId, quantity);
      
      // Optionally refresh cart data
      const updatedCart = await getCart();
      
      return cartItem;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const handleCreateOrder = async (cartItems: any[]) => {
    try {
      const order = await createOrder(cartItems);
      
      // Clear cart after successful order
      await clearCart();
      
      return order;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  return { handleAddToCart, handleCreateOrder };
};

// Example 7: Authentication flow
export const AuthenticationFlowExample = () => {
  const handleCompleteAuthFlow = async (credentials: any) => {
    try {
      // 1. Login
      const authResponse = await login(credentials.username, credentials.password);

      // 2. Get user profile (token is automatically included)
      const profile = await getProfile();

      // 3. Load user-specific data
      const [cart, wishlist, orders] = await Promise.all([
        getCart(),
        getWishlist(),
        getUserOrders()
      ]);


      return {
        user: authResponse.user,
        profile,
        cart,
        wishlist,
        orders
      };
    } catch (error) {
      console.error('Authentication flow failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      
      // Clear any cached data
      // queryClient.clear(); // if using React Query
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local data even if logout request fails
    }
  };

  return { handleCompleteAuthFlow, handleLogout };
};

// Example 8: Search and filtering
export const SearchAndFilterExample = () => {
  const handleProductSearch = async (searchTerm: string, filters: any = {}) => {
    try {
      const searchResults = await listProducts({
        search: searchTerm,
        ...filters,
        pageSize: 20
      });

      return searchResults;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  };

  const handleCategoryFilter = async (categoryId: string) => {
    try {
      const products = await listProducts({
        categoryId,
        pageSize: 50
      });

      return products;
    } catch (error) {
      console.error('Category filter failed:', error);
      throw error;
    }
  };

  return { handleProductSearch, handleCategoryFilter };
};

// Import statements you'll need in your components
export const ImportExamples = `
// Basic imports
import { apiService } from '@/api/apiService';
import { login, logout, listProducts, addToCart } from '@/api';

// Grouped imports
import { authAPI, productsAPI, cartAPI } from '@/api';

// Type imports
import type { Product, User, Order, ApiError } from '@/api';

// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
`;

// Usage in React components
export const ComponentUsageExample = `
import React from 'react';
import { View, Button, Alert } from 'react-native';
import { login, listProducts } from '@/api';

const MyComponent = () => {
  const handleLogin = async () => {
    try {
      const response = await login('username', 'password');
      Alert.alert('Success', 'Logged in successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLoadProducts = async () => {
    try {
      const products = await listProducts({ pageSize: 10 });
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  return (
    <View>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Load Products" onPress={handleLoadProducts} />
    </View>
  );
};

export default MyComponent;
`;
