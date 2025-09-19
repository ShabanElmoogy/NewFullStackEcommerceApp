/**
 * Refactored Error Handling Examples
 * 
 * Simple examples showing how to use the new streamlined error handling
 */

import { login } from './auth';
import { getCategory } from './categories';
import { ApiService, ApiError } from './apiService';

// Example 1: Basic Error Handling
export const BasicErrorExample = () => {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      return response;
    } catch (error) {
      if (ApiService.isApiError(error)) {
        // This is our structured API error
        
        // Check for specific field errors
        const fieldErrors = ApiService.getFieldErrors(error);
        if (fieldErrors) {
        }
        
        // Handle specific status codes
        if (error.status === 404) {
        } else if (error.status === 401) {
        }
      } else {
        // Handle unexpected errors
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  };

  return { handleLogin };
};

// Example 2: Category Error Handling
export const CategoryErrorExample = () => {
  const handleGetCategory = async (categoryId: string) => {
    try {
      const category = await getCategory(categoryId);
      return category;
    } catch (error) {
      if (ApiService.isApiError(error)) {
        // Your API returns: 
        // {
        //   "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
        //   "title": "Not Found", 
        //   "status": 404,
        //   "errors": { "Category.CategoryNotFound": ["The category was not found."] }
        // }
        
        
        // Get field-specific errors
        const fieldErrors = ApiService.getFieldErrors(error);
        if (fieldErrors) {
        }
        
        // Simple status-based handling
        if (error.status === 404) {
          return { error: 'Category not found' };
        }
      }
      
      return { error: 'Something went wrong' };
    }
  };

  return { handleGetCategory };
};

// Example 3: Form Validation Errors
export const FormValidationExample = () => {
  const handleFormSubmit = async (formData: any) => {
    try {
      // Example: Creating a category
      const result = await apiService.post('/Categories/Add', formData);
      return { success: true, data: result };
    } catch (error) {
      if (ApiService.isApiError(error)) {
        // For validation errors, your API might return:
        // {
        //   "title": "Validation Failed",
        //   "status": 400,
        //   "errors": {
        //     "Name": ["Name is required"],
        //     "Email": ["Email format is invalid"]
        //   }
        // }
        
        const fieldErrors = ApiService.getFieldErrors(error);
        if (fieldErrors) {
          // Return field-specific errors for form validation
          return {
            success: false,
            fieldErrors,
            message: 'Please fix the errors below'
          };
        } else {
          // General error
          return {
            success: false,
            message: error.message
          };
        }
      }
      
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  };

  return { handleFormSubmit };
};

// Example 4: React Component Usage
export const ReactComponentExample = `
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { login } from '@/api';
import { ApiService } from '@/api/apiService';

const LoginComponent = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    
    try {
      const response = await login('wrong@email.com', 'wrongpassword');
      Alert.alert('Success', 'Logged in successfully');
    } catch (error) {
      if (ApiService.isApiError(error)) {
        // Show the actual error message from your API
        Alert.alert('Login Failed', error.message);
        
        // Log additional details for debugging
        
        const fieldErrors = ApiService.getFieldErrors(error);
        if (fieldErrors) {
        }
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Button 
        title={loading ? "Logging in..." : "Login"} 
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};

export default LoginComponent;
`;

// Example 5: User-Friendly Error Messages
export const UserFriendlyErrorsExample = () => {
  const getDisplayMessage = (error: ApiError): string => {
    // Map API errors to user-friendly messages
    switch (error.status) {
      case 400:
        return 'Please check your input and try again.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        if (error.type?.includes('Category')) {
          return 'The requested category could not be found.';
        }
        return 'The requested item could not be found.';
      case 500:
        return 'Something went wrong on our end. Please try again later.';
      default:
        // Use the actual API message as fallback
        return error.message || 'An unexpected error occurred.';
    }
  };

  const handleApiCallWithUserFriendlyErrors = async (apiCall: () => Promise<any>) => {
    try {
      return await apiCall();
    } catch (error) {
      if (ApiService.isApiError(error)) {
        const userMessage = getDisplayMessage(error);
        
        // Show user-friendly message
        Alert.alert('Error', userMessage);
        
        // Log technical details for debugging
        console.error('API Error:', {
          message: error.message,
          status: error.status,
          type: error.type,
          fieldErrors: ApiService.getFieldErrors(error)
        });
        
        return { error: userMessage };
      }
      
      Alert.alert('Error', 'Something went wrong');
      return { error: 'Something went wrong' };
    }
  };

  return { getDisplayMessage, handleApiCallWithUserFriendlyErrors };
};

// Example 6: Testing the Error Handling
export const TestingExample = `
// Jest test example
import { ApiService } from '@/api/apiService';
import { login } from '@/api';

describe('Error Handling', () => {
  test('should handle login error correctly', async () => {
    // Mock the API to return your error format
    jest.spyOn(apiService, 'post').mockRejectedValue(
      new Error('Invalid credentials') as ApiError
    );

    try {
      await login('wrong@email.com', 'wrongpassword');
    } catch (error) {
      expect(ApiService.isApiError(error)).toBe(true);
      expect(error.message).toBe('Invalid credentials');
    }
  });
});
`;

export default {
  BasicErrorExample,
  CategoryErrorExample,
  FormValidationExample,
  UserFriendlyErrorsExample,
};
