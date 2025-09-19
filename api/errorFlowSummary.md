# Error Handling Flow Summary

## Your API Error Format
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
  "title": "Not Found",
  "status": 404,
  "errors": {
    "Category.CategoryNotFound": [
      "The category was not found."
    ]
  }
}
```

## Step-by-Step Processing

### 1. API Call Fails
```typescript
// User tries to fetch a non-existent category
const category = await getCategory('999');
```

### 2. API Service Receives Error
The `apiService.ts` response interceptor catches the error and processes it:

```typescript
// In formatError method
private formatError(error: AxiosError): ApiError {
  const response = error.response;
  
  if (response?.data) {
    const problemDetails = response.data as ProblemDetails;
    
    // Your error data matches this condition
    if (problemDetails.type || problemDetails.title || problemDetails.status || problemDetails.errors) {
      return this.createApiError(problemDetails, response.status);
    }
  }
}
```

### 3. API Service Creates Structured Error
```typescript
// In createApiError method
private createApiError(problemDetails: ProblemDetails, statusCode?: number): ApiError {
  // Get the main error message from the first error
  let message = 'An error occurred';
  
  if (problemDetails.errors) {
    // Gets "Category.CategoryNotFound": ["The category was not found."]
    const firstErrorMessages = Object.values(problemDetails.errors)[0];
    if (firstErrorMessages && firstErrorMessages.length > 0) {
      message = firstErrorMessages[0]; // "The category was not found."
    }
  }

  // Create a proper Error object
  const apiError = new Error(message) as ApiError;
  apiError.name = 'ApiError';
  apiError.status = 404;
  apiError.title = 'Not Found';
  apiError.type = 'https://tools.ietf.org/html/rfc9110#section-15.5.5';
  apiError.errors = { "Category.CategoryNotFound": ["The category was not found."] };
  apiError.fieldErrors = { "Category.CategoryNotFound": ["The category was not found."] };

  return apiError;
}
```

### 4. React Query Catches Error
```typescript
const categoryMutation = useMutation({
  mutationFn: (id: string) => getCategory(id),
  onError: (error) => {
    // error is now the structured ApiError from step 3
    console.log(error.message);     // "The category was not found."
    console.log(error.status);      // 404
    console.log(error.title);       // "Not Found"
    console.log(error.fieldErrors); // { "Category.CategoryNotFound": ["The category was not found."] }
  },
});
```

### 5. Error Utils Format Toast Message
```typescript
// In getCategoryErrorToastData
export const getCategoryErrorToastData = (error: any): ErrorToastData => {
  if (ApiService.isApiError(error)) {
    const apiError = error as ApiError;
    
    switch (apiError.status) {
      case 404:
        return {
          title: '❌ Category Not Found',
          message: apiError.message || 'The requested category could not be found'
          // apiError.message = "The category was not found." (from your API)
        };
    }
  }
}
```

### 6. Toast is Displayed
```typescript
const errorData = getCategoryErrorToastData(error);
Toast.show({
  type: ToastType.ERROR,
  text1: errorData.title,    // "❌ Category Not Found"
  text2: errorData.message,  // "The category was not found."
  visibilityTime: 4000,
});
```

## Final Result

### Toast Display:
```
┌─────────────────────────────────────┐
│ ✕  ❌ Category Not Found            ���
│    The category was not found.      │
└─────────────────────────────────────┘
```

### Console Logs (Development):
```
🔍 API Error Details
├─ Message: The category was not found.
├─ Status: 404
├─ Title: Not Found
├─ Type: https://tools.ietf.org/html/rfc9110#section-15.5.5
└─ Errors: { "Category.CategoryNotFound": ["The category was not found."] }
```

## Key Benefits

1. **✅ Preserves Original Message**: Uses your exact API error message
2. **✅ User-Friendly Title**: Converts "Not Found" to "❌ Category Not Found"
3. **✅ Structured Data**: All error details available for debugging
4. **✅ Consistent Handling**: Same pattern works for all RFC 9110 errors
5. **✅ Flexible**: Easy to customize per operation type

## Usage in Components

```typescript
// Simple usage - error toast handled automatically
const { handleLogin, isLoading } = useLogin();
handleLogin(email, password);

// Custom usage - full control over error handling
const categoryMutation = useMutation({
  mutationFn: getCategory,
  onError: (error) => {
    const errorData = getCategoryErrorToastData(error);
    Toast.show({
      type: ToastType.ERROR,
      text1: errorData.title,
      text2: errorData.message,
    });
  },
});
```

## Testing

To test this error handling:

1. Try to fetch a category with ID `999` (non-existent)
2. Your API will return the RFC 9110 error
3. You'll see the formatted toast with your exact error message
4. Check console for detailed error information

The error handling is now fully compatible with your RFC 9110 Problem Details format! 🎉