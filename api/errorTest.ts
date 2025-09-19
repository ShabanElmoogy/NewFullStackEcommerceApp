/**
 * Test file to verify error handling with your exact API error format
 */

import { ApiService } from './apiService';
import { getErrorToastData, getLoginErrorToastData, getCategoryErrorToastData } from '@/utils/errorUtils';

// Your exact API error format
const mockApiError = {
  type: "https://tools.ietf.org/html/rfc9110#section-15.5.5",
  title: "Not Found",
  status: 404,
  errors: {
    "Category.CategoryNotFound": [
      "The category was not found."
    ]
  }
};

// Simulate how the API service creates an ApiError from your API response
function createMockApiError() {
  const message = "The category was not found."; // First error message
  const apiError = new Error(message) as any;
  apiError.name = 'ApiError';
  apiError.status = 404;
  apiError.title = "Not Found";
  apiError.type = "https://tools.ietf.org/html/rfc9110#section-15.5.5";
  apiError.errors = {
    "Category.CategoryNotFound": [
      "The category was not found."
    ]
  };
  apiError.fieldErrors = {
    "Category.CategoryNotFound": [
      "The category was not found."
    ]
  };
  
  return apiError;
}

// Test the error handling
export function testErrorHandling() {
  
  const mockError = createMockApiError();
  
  // Test 1: Check if it's recognized as an API error
  
  // Test 2: Get error message
  
  // Test 3: Get field errors
  
  // Test 4: Get all error messages
  
  // Test 5: Generic error toast data
  const genericToast = getErrorToastData(mockError);
  
  // Test 6: Category-specific error toast data
  const categoryToast = getCategoryErrorToastData(mockError);
  
  // Test 7: Login error (should use generic handling for 404)
  const loginToast = getLoginErrorToastData(mockError);
}

// Test different error scenarios
export function testDifferentErrorScenarios() {
  
  // Test 401 Unauthorized
  const unauthorizedError = new Error("Invalid credentials") as any;
  unauthorizedError.name = 'ApiError';
  unauthorizedError.status = 401;
  unauthorizedError.title = "Unauthorized";
  unauthorizedError.type = "https://tools.ietf.org/html/rfc9110#section-15.5.2";
  unauthorizedError.errors = {
    "Auth.InvalidCredentials": ["Invalid email or password."]
  };
  unauthorizedError.fieldErrors = unauthorizedError.errors;
  
  
  // Test 400 Validation Error
  const validationError = new Error("Validation failed") as any;
  validationError.name = 'ApiError';
  validationError.status = 400;
  validationError.title = "Bad Request";
  validationError.errors = {
    "Email": ["Email is required"],
    "Password": ["Password must be at least 8 characters"]
  };
  validationError.fieldErrors = validationError.errors;
  
  
  // Test 500 Server Error
  const serverError = new Error("Internal server error") as any;
  serverError.name = 'ApiError';
  serverError.status = 500;
  serverError.title = "Internal Server Error";
  
}

// Example of how to use in a React component
export const ExampleUsage = `
// In your React component:
import { useMutation } from '@tanstack/react-query';
import { getCategory } from '@/api/categories';
import { getCategoryErrorToastData } from '@/utils/errorUtils';
import { Toast } from 'toastify-react-native';
import { ToastType } from '@/types/toastType';

const CategoryComponent = () => {
  const categoryMutation = useMutation({
    mutationFn: (id: string) => getCategory(id),
    onSuccess: (data) => {
      Toast.show({
        type: ToastType.SUCCESS,
        text1: '✅ Category Found',
        text2: \`Found: \${data.nameEn}\`,
      });
    },
    onError: (error) => {
      // Your API error:
      // {
      //   "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
      //   "title": "Not Found",
      //   "status": 404,
      //   "errors": {
      //     "Category.CategoryNotFound": ["The category was not found."]
      //   }
      // }
      
      // Will become this toast:
      const errorData = getCategoryErrorToastData(error);
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,    // "❌ Category Not Found"
        text2: errorData.message,  // "The category was not found."
      });
    },
  });

  const handleFetchCategory = (id: string) => {
    categoryMutation.mutate(id);
  };

  return (
    // Your component JSX
  );
};
`;

// Run tests (you can call this in your app to verify)
if (__DEV__) {
  // Uncomment to run tests in development
  // testErrorHandling();
  // testDifferentErrorScenarios();
}
