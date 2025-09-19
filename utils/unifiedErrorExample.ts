import { useMutation, useQuery } from '@tanstack/react-query';
import { Toast } from 'toastify-react-native';
import { ToastType } from '@/types/toastType';
import { getApiError } from '@/utils/errorUtils';

/**
 * Unified Error Handling Examples
 * 
 * The getApiError function handles RFC 9110 Problem Details format:
 * {
 *   "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
 *   "title": "Not Found",
 *   "status": 404,
 *   "errors": {
 *     "Category.CategoryNotFound": ["The category was not found."]
 *   }
 * }
 */

// Example 1: Login Hook
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onError: (error) => {
      const errorData = getApiError(error);
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });
    },
  });
}

// Example 2: Categories Query
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    onError: (error) => {
      const errorData = getApiError(error);
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });
    },
  });
}

// Example 3: Create Product Mutation
export function useCreateProduct() {
  return useMutation({
    mutationFn: (productData: any) => createProduct(productData),
    onError: (error) => {
      const errorData = getApiError(error);
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });
    },
  });
}

// Example 4: Delete Category Mutation
export function useDeleteCategory() {
  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onError: (error) => {
      const errorData = getApiError(error);
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });
    },
  });
}

// Example 5: Update User Profile
export function useUpdateProfile() {
  return useMutation({
    mutationFn: (profileData: any) => updateProfile(profileData),
    onError: (error) => {
      const errorData = getApiError(error);
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });
    },
  });
}

/**
 * How it works:
 * 
 * 1. For your error format:
 *    { "errors": { "Category.CategoryNotFound": ["The category was not found."] } }
 *    
 *    getApiError() will extract:
 *    - title: "❌ Not Found" (based on status 404)
 *    - message: "The category was not found." (from errors array)
 * 
 * 2. For validation errors:
 *    { "errors": { "Email": ["Email is required"], "Password": ["Password too short"] } }
 *    
 *    getApiError() will extract:
 *    - title: "❌ Validation Error" (based on status 422)
 *    - message: "Email is required" (first error message)
 * 
 * 3. For simple errors:
 *    { "title": "Unauthorized", "status": 401 }
 *    
 *    getApiError() will extract:
 *    - title: "❌ Unauthorized" (based on status 401)
 *    - message: "Unauthorized" (from title field)
 */

// Placeholder API functions
declare function login(email: string, password: string): Promise<any>;
declare function getCategories(): Promise<any>;
declare function createProduct(data: any): Promise<any>;
declare function deleteCategory(id: string): Promise<any>;
declare function updateProfile(data: any): Promise<any>;