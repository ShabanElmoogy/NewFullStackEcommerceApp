/**
 * Unified API Error Handler
 * Handles RFC 9110 Problem Details format from all endpoints
 */

export interface ErrorToast {
  title: string;
  message: string;
}

/**
 * Extract error message from API response
 * Format: { "errors": { "Category.CategoryNotFound": ["The category was not found."] } }
 */
export function getApiError(error: any): ErrorToast {
  // Handle API errors with RFC 9110 format
  if (error?.response?.data) {
    const errorData = error.response.data;
    console.log("Error Data",errorData)
    // Extract message from errors object
    if (errorData.errors) {
      const firstError = Object.values(errorData.errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return {
          title: getErrorTitle(errorData.status),
          message: firstError[0]        
        };
      }
    }
    
    // Fallback to title or detail
    if (errorData.title) {
      return {
        title: getErrorTitle(errorData.status),
        message: errorData.title
      };
    }
    
    if (errorData.detail) {
      return {
        title: getErrorTitle(errorData.status),
        message: errorData.detail
      };
    }
  }
  
  // Handle network or other errors
  return {
    title: '❌ Error',
    message: error?.message || 'Something went wrong'
  };
}

/**
 * Get error title based on status code
 */
function getErrorTitle(status?: number): string {
  switch (status) {
    case 400: return '❌ Invalid Request';
    case 401: return '❌ Unauthorized';
    case 403: return '❌ Forbidden';
    case 404: return '❌ Not Found';
    case 409: return '❌ Conflict';
    case 422: return '❌ Validation Error';
    case 429: return '⏰ Too Many Requests';
    case 500: return '🔧 Server Error';
    default: return '❌ Error';
  }
}