# API Service Documentation

This directory contains a reusable API service built with Axios for consuming REST APIs in the mobile application.

## Overview

The API service provides:
- **Centralized HTTP client** with Axios
- **Automatic authentication** token management
- **Request/Response interceptors** for logging and error handling
- **Type-safe API calls** with TypeScript interfaces
- **Error handling** with consistent error formatting
- **File upload/download** capabilities
- **Request cancellation** support

## Structure

```
api/
├── apiService.ts      # Main API service class
├── auth.ts           # Authentication API functions
├── products.ts       # Products API functions
├── categories.ts     # Categories API functions
├── subcategories.ts  # Subcategories API functions
├── orders.ts         # Orders API functions
├── cart.ts           # Cart API functions
├── wishlist.ts       # Wishlist API functions
├── user.ts           # User/Profile API functions
├── index.ts          # Central export point
└── README.md         # This documentation
```

## Usage

### Basic Usage

```typescript
import { apiService } from '@/api/apiService';

// GET request
const products = await apiService.get<Product[]>('/products');

// POST request
const newProduct = await apiService.post<Product>('/products', productData);

// PUT request
const updatedProduct = await apiService.put<Product>(`/products/${id}`, updateData);

// DELETE request
await apiService.delete(`/products/${id}`);
```

### Using Specific API Functions

```typescript
import { login, listProducts, addToCart } from '@/api';

// Authentication
const authResponse = await login('username', 'password');

// Products
const products = await listProducts({ pageSize: 10 });

// Cart
await addToCart('product-id', 2);
```

### Authentication

The API service automatically handles authentication tokens:

```typescript
import { apiService, login } from '@/api';

// Login automatically sets the token
const response = await login('username', 'password');

// All subsequent requests will include the token
const profile = await apiService.get('/user/profile', { requiresAuth: true });

// Manually set token if needed
apiService.setAuthToken('your-jwt-token');

// Clear token on logout
apiService.clearAuthToken();
```

### Internationalization (Culture Header)

The API service automatically includes a `Culture` header with every request based on the current app language:

```typescript
import { apiService } from '@/api';

// The Culture header is automatically added based on current language
// If current language is 'ar', header will be: Culture: ar
// If current language is 'en', header will be: Culture: en

// Get current culture
const currentCulture = apiService.getCurrentCulture(); // Returns 'ar' or 'en'

// Manually set culture header (optional - usually handled automatically)
apiService.setCultureHeader('ar');
```

**How it works:**
1. **Automatic**: The interceptor reads from `useLanguageStore` and adds the Culture header to every request
2. **Dynamic**: When user changes language, the Culture header is automatically updated
3. **Fallback**: Defaults to 'en' if language store is not available
4. **Backend Integration**: Your backend can use this header to return localized content

**Example API request headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Culture: ar
Content-Type: application/json
Accept: application/json
```

### Error Handling

The API service provides comprehensive error handling with support for RFC 9110 Problem Details format:

```typescript
import { apiService, ApiError, ApiService } from '@/api';

try {
  const data = await apiService.get('/some-endpoint');
} catch (error) {
  if (ApiService.isProblemDetailsError(error)) {
    // RFC 9110 Problem Details error
    console.error('API Error:', ApiService.getErrorMessage(error));
    console.error('Status:', error.status);
    console.error('Title:', error.title);
    console.error('Type:', error.type);
    
    // Get all error messages
    const messages = ApiService.getErrorMessages(error);
    console.error('All Errors:', messages);
    
    // Get field-specific errors (for form validation)
    const fieldErrors = ApiService.getErrorsByField(error);
    if (fieldErrors) {
      console.error('Field Errors:', fieldErrors);
    }
  }
}
```

#### Error Format Examples

Your backend returns RFC 9110 Problem Details format:

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

The API service automatically parses this into a structured `ApiError`:

```typescript
interface ApiError {
  message: string;           // "The category was not found."
  status: number;           // 404
  title: string;            // "Not Found"
  type: string;             // "https://tools.ietf.org/html/rfc9110#section-15.5.5"
  errors: Record<string, string[]>; // { "Category.CategoryNotFound": ["The category was not found."] }
  originalError: ProblemDetails;    // Original error data
}
```

#### Error Utility Methods

```typescript
// Check if error is a Problem Details error
if (ApiService.isProblemDetailsError(error)) {
  // Get the main error message
  const message = ApiService.getErrorMessage(error);
  
  // Get all error messages as array
  const allMessages = ApiService.getErrorMessages(error);
  
  // Get field-specific errors for form validation
  const fieldErrors = ApiService.getErrorsByField(error);
}
```

### File Upload

```typescript
import { apiService } from '@/api';

const formData = new FormData();
formData.append('file', file);

const result = await apiService.uploadFile('/upload', formData);
```

### Request Cancellation

```typescript
import { apiService } from '@/api';

const cancelToken = apiService.createCancelToken();

try {
  const data = await apiService.get('/endpoint', {
    cancelToken: cancelToken.token
  });
} catch (error) {
  if (apiService.isCancel(error)) {
    console.log('Request cancelled');
  }
}

// Cancel the request
cancelToken.cancel('Request cancelled by user');
```

## Configuration

### Environment Variables

Make sure to set the following environment variables:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

### Base URL

The API service uses the base URL from `constants/appRoutes.ts`:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/v1`;
```

## Features

### Request Interceptors
- Automatically adds authentication tokens
- Automatically adds Culture header based on current app language (ar/en)
- Logs requests in development mode
- Handles request configuration

### Response Interceptors
- Logs responses in development mode
- Handles common HTTP errors (401, 403, 404, 500)
- Automatically clears tokens on 401 Unauthorized
- Formats errors consistently

### Type Safety
All API functions are fully typed with TypeScript interfaces:

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  // ... other properties
}

const product = await getProduct('123'); // Returns Product type
```

### Error Types
```typescript
interface ApiError {
  message: string;
  status?: number;
  errors?: string[];
}
```

## API Functions

### Authentication (`auth.ts`)
- `login(userName, password)` - User login
- `register(userData)` - User registration
- `logout()` - User logout
- `refreshToken(refreshToken)` - Refresh JWT token
- `forgotPassword(email)` - Request password reset
- `resetPassword(resetData)` - Reset password

### Products (`products.ts`)
- `listProducts(filters?)` - Get products with optional filters
- `getProduct(id)` - Get single product
- `createProduct(productData)` - Create new product
- `updateProduct(productData)` - Update product
- `deleteProduct(id)` - Delete product
- `searchProducts(query, filters?)` - Search products

### Categories (`categories.ts`)
- `listCategories()` - Get all categories
- `getCategory(id)` - Get single category
- `createCategory(categoryData)` - Create category
- `updateCategory(categoryData)` - Update category
- `deleteCategory(id)` - Delete category

### Orders (`orders.ts`)
- `createOrder(items)` - Create new order
- `getUserOrders()` - Get user's orders
- `getOrderById(id)` - Get single order
- `updateOrderStatus(id, status)` - Update order status
- `cancelOrder(id)` - Cancel order

### Cart (`cart.ts`)
- `getCart()` - Get user's cart
- `addToCart(productId, quantity)` - Add item to cart
- `updateCartItem(itemId, quantity)` - Update cart item
- `removeFromCart(itemId)` - Remove item from cart
- `clearCart()` - Clear entire cart

### Wishlist (`wishlist.ts`)
- `getWishlist()` - Get user's wishlist
- `addToWishlist(productId)` - Add item to wishlist
- `removeFromWishlist(itemId)` - Remove item from wishlist
- `toggleWishlist(productId)` - Toggle item in wishlist
- `clearWishlist()` - Clear entire wishlist

### User/Profile (`user.ts`)
- `getProfile()` - Get user profile
- `updateProfile(profileData)` - Update profile
- `changePassword(passwordData)` - Change password
- `uploadProfileImage(imageFile)` - Upload profile image
- `deleteAccount(password)` - Delete user account

## Migration from Fetch

If you're migrating from fetch-based API calls, here's how to convert:

### Before (Fetch)
```typescript
const res = await fetch('/api/products', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

if (!res.ok) {
  throw new Error(`HTTP error! status: ${res.status}`);
}

const data = await res.json();
```

### After (API Service)
```typescript
const data = await apiService.get('/products', { requiresAuth: true });
```

## Best Practices

1. **Use TypeScript interfaces** for all API responses
2. **Handle errors appropriately** with try-catch blocks
3. **Use the `requiresAuth` flag** for protected endpoints
4. **Leverage helper functions** for common operations
5. **Cancel requests** when components unmount
6. **Use environment variables** for API configuration

## Development

### Adding New API Endpoints

1. Add the endpoint URL to `constants/appRoutes.ts`
2. Create or update the relevant API file (e.g., `products.ts`)
3. Define TypeScript interfaces for request/response
4. Implement the API function using `apiService`
5. Export the function from the API file
6. Add to `index.ts` for centralized access

### Testing

```typescript
// Example test
import { apiService } from '@/api/apiService';

// Mock the API service for testing
jest.mock('@/api/apiService');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

test('should fetch products', async () => {
  mockApiService.get.mockResolvedValue([{ id: '1', name: 'Test Product' }]);
  
  const products = await listProducts();
  
  expect(products).toHaveLength(1);
  expect(mockApiService.get).toHaveBeenCalledWith('/Products/GetAll');
});
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check if the auth token is set correctly
2. **Network errors**: Verify the API base URL and network connectivity
3. **CORS issues**: Ensure the backend allows requests from your domain
4. **Type errors**: Make sure interfaces match the API response structure

### Debug Mode

The API service logs all requests and responses in development mode. Check the console for detailed information about API calls.