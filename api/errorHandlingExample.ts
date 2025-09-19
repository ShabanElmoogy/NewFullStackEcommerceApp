/**
 * RFC 9110 Problem Details Error Handling Examples
 * 
 * This file demonstrates how to handle the new RFC 9110 Problem Details
 * error format that your backend returns.
 */

import { apiService, ApiError, ApiService } from './apiService';
import { getCategory, listProducts } from './index';

// Example 1: Basic Error Handling
export const BasicErrorHandlingExample = () => {
  const handleCategoryRequest = async (categoryId: string) => {
    try {
      const category = await getCategory(categoryId);
      return category;
    } catch (error) {
      if (ApiService.isProblemDetailsError(error)) {
        // This is a structured API error
        
        // Handle specific error types
        if (error.status === 404) {
          // Show user-friendly message
        }
      } else {
        // Handle unexpected errors
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  };

  return { handleCategoryRequest };
};

// Example 2: Detailed Error Analysis
export const DetailedErrorAnalysisExample = () => {
  const analyzeError = (error: ApiError) => {
    console.group('🔍 Error Analysis');
    
    // Basic info
    
    // RFC 9110 specific fields
    
    // Field-specific errors
    const fieldErrors = ApiService.getErrorsByField(error);
    if (fieldErrors) {
      Object.entries(fieldErrors).forEach(([field, messages]) => {
      });
    }
    
    // All error messages
    const allMessages = ApiService.getErrorMessages(error);
    
    console.groupEnd();
  };

  const testErrorAnalysis = async () => {
    try {
      // This will likely cause a 404 error
      await getCategory('non-existent-id');
    } catch (error) {
      if (ApiService.isProblemDetailsError(error)) {
        analyzeError(error);
      }
    }
  };

  return { analyzeError, testErrorAnalysis };
};

// Example 3: User-Friendly Error Messages
export const UserFriendlyErrorsExample = () => {
  const getDisplayMessage = (error: ApiError): string => {
    // Handle specific error types with user-friendly messages
    if (error.status === 404) {
      if (error.type?.includes('Category')) {
        return 'The requested category could not be found.';
      }
      if (error.type?.includes('Product')) {
        return 'The requested product could not be found.';
      }
      return 'The requested item could not be found.';
    }
    
    if (error.status === 400) {
      // For validation errors, show the first specific error message
      const messages = ApiService.getErrorMessages(error);
      return messages[0] || 'Please check your input and try again.';
    }
    
    if (error.status === 401) {
      return 'Please log in to continue.';
    }
    
    if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (error.status === 500) {
      return 'Something went wrong on our end. Please try again later.';
    }
    
    // Default to the API message or a generic message
    return ApiService.getErrorMessage(error) || 'An unexpected error occurred.';
  };

  const handleApiCall = async (apiCall: () => Promise<any>) => {
    try {
      return await apiCall();
    } catch (error) {
      if (ApiService.isProblemDetailsError(error)) {
        const userMessage = getDisplayMessage(error);
        
        // Show user-friendly message (you can integrate with your toast/alert system)
        
        // You can also show specific field errors for forms
        const fieldErrors = ApiService.getErrorsByField(error);
        if (fieldErrors) {
        }
        
        return { error: userMessage, fieldErrors };
      }
      
      // Handle non-API errors
      console.error('Unexpected error:', error);
      return { error: 'An unexpected error occurred.' };
    }
  };

  return { getDisplayMessage, handleApiCall };
};

// Example 4: React Component Error Handling
export const ReactComponentExample = `
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { getCategory } from '@/api';
import { ApiService, ApiError } from '@/api/apiService';

const CategoryComponent = ({ categoryId }: { categoryId: string }) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getCategory(categoryId);
      setCategory(result);
    } catch (err) {
      if (ApiService.isProblemDetailsError(err)) {
        const apiError = err as ApiError;
        
        // Handle specific error cases
        if (apiError.status === 404) {
          setError('Category not found');
        } else if (apiError.status === 400) {
          const messages = ApiService.getErrorMessages(apiError);
          setError(messages[0] || 'Invalid request');
        } else {
          setError(ApiService.getErrorMessage(apiError));
        }
        
        // Log detailed error for debugging
          title: apiError.title,
          type: apiError.type,
          status: apiError.status,
          errors: apiError.errors
        });
      } else {
        setError('An unexpected error occurred');
        console.error('Unexpected error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Button title="Fetch Category" onPress={fetchCategory} />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
      {category && <Text>Category: {JSON.stringify(category)}</Text>}
    </View>
  );
};

export default CategoryComponent;
`;

// Example 5: Form Validation Error Handling
export const FormValidationExample = () => {
  const handleFormSubmission = async (formData: any) => {
    try {
      // Example: Create a new category
      const result = await apiService.post('/Categories/Add', formData);
      return { success: true, data: result };
    } catch (error) {
      if (ApiService.isProblemDetailsError(error)) {
        const fieldErrors = ApiService.getErrorsByField(error);
        
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
            message: ApiService.getErrorMessage(error)
          };
        }
      }
      
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  };

  return { handleFormSubmission };
};

// Example 6: Error Logging and Monitoring
export const ErrorLoggingExample = () => {
  const logError = (error: ApiError, context: string) => {
    const errorLog = {
      timestamp: new Date().toISOString(),
      context,
      message: ApiService.getErrorMessage(error),
      status: error.status,
      type: error.type,
      title: error.title,
      detail: error.detail,
      instance: error.instance,
      errors: error.errors,
      originalError: error.originalError
    };
    
    // Log to console in development
    if (__DEV__) {
      console.error('API Error Log:', errorLog);
    }
    
    // In production, you might want to send this to a logging service
    // logToService(errorLog);
    
    return errorLog;
  };

  const handleApiCallWithLogging = async (
    apiCall: () => Promise<any>,
    context: string
  ) => {
    try {
      return await apiCall();
    } catch (error) {
      if (ApiService.isProblemDetailsError(error)) {
        logError(error, context);
      }
      throw error;
    }
  };

  return { logError, handleApiCallWithLogging };
};

// Example 7: Testing Error Scenarios
export const TestingExample = `
// Jest test example for RFC 9110 error handling

import { apiService, ApiService } from '@/api/apiService';
import { getCategory } from '@/api';

describe('RFC 9110 Error Handling', () => {
  test('should handle 404 category not found error', async () => {
    // Mock the API to return a 404 error
    const mockError = {
      response: {
        status: 404,
        data: {
          type: 'https://tools.ietf.org/html/rfc9110#section-15.5.5',
          title: 'Not Found',
          status: 404,
          errors: {
            'Category.CategoryNotFound': ['The category was not found.']
          }
        }
      }
    };

    jest.spyOn(apiService, 'get').mockRejectedValue(mockError);

    try {
      await getCategory('non-existent-id');
    } catch (error) {
      expect(ApiService.isProblemDetailsError(error)).toBe(true);
      expect(error.status).toBe(404);
      expect(error.title).toBe('Not Found');
      expect(ApiService.getErrorMessage(error)).toBe('The category was not found.');
      
      const fieldErrors = ApiService.getErrorsByField(error);
      expect(fieldErrors).toHaveProperty('Category.CategoryNotFound');
    }
  });

  test('should handle validation errors', async () => {
    const mockValidationError = {
      response: {
        status: 400,
        data: {
          type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
          title: 'Bad Request',
          status: 400,
          errors: {
            'Name': ['Name is required'],
            'Email': ['Email format is invalid']
          }
        }
      }
    };

    jest.spyOn(apiService, 'post').mockRejectedValue(mockValidationError);

    try {
      await apiService.post('/test', {});
    } catch (error) {
      const messages = ApiService.getErrorMessages(error);
      expect(messages).toContain('Name is required');
      expect(messages).toContain('Email format is invalid');
      
      const fieldErrors = ApiService.getErrorsByField(error);
      expect(fieldErrors?.Name).toContain('Name is required');
      expect(fieldErrors?.Email).toContain('Email format is invalid');
    }
  });
});
`;
