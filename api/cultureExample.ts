/**
 * Culture Header Example
 * 
 * This file demonstrates how the Culture header works with the API service
 * and how it integrates with the language store.
 */

import { apiService } from './apiService';
import { useLanguageStore } from '@/store/languageStore';
import { listProducts, listCategories } from './index';

// Example 1: Automatic Culture Header
export const AutomaticCultureExample = () => {
  const fetchLocalizedData = async () => {
    try {
      // These requests will automatically include the Culture header
      // based on the current app language (ar or en)
      
      const products = await listProducts({ pageSize: 10 });
      const categories = await listCategories();
      
      
      // The backend will receive requests with headers like:
      // Culture: ar (if Arabic is selected)
      // Culture: en (if English is selected)
      
    } catch (error) {
      console.error('Error fetching localized data:', error);
    }
  };

  return { fetchLocalizedData };
};

// Example 2: Language Change Integration
export const LanguageChangeExample = () => {
  const { toggleLanguage, handleLanguageChange } = useLanguageStore();

  const switchToArabic = async () => {
    // This will automatically update the API service Culture header
    await handleLanguageChange('ar');
    
    // All subsequent API calls will include: Culture: ar
    const products = await listProducts();
  };

  const switchToEnglish = async () => {
    // This will automatically update the API service Culture header
    await handleLanguageChange('en');
    
    // All subsequent API calls will include: Culture: en
    const products = await listProducts();
  };

  const toggleAppLanguage = () => {
    // This will automatically switch between ar/en and update API headers
    toggleLanguage();
  };

  return {
    switchToArabic,
    switchToEnglish,
    toggleAppLanguage
  };
};

// Example 3: Manual Culture Control
export const ManualCultureExample = () => {
  const getCurrentCulture = () => {
    const culture = apiService.getCurrentCulture();
    return culture;
  };

  const setCultureManually = (culture: 'ar' | 'en') => {
    // Manually set the culture header (not recommended - use language store instead)
    apiService.setCultureHeader(culture);
  };

  const testCultureHeaders = async () => {
    // Test with Arabic
    apiService.setCultureHeader('ar');
    const arabicProducts = await listProducts({ pageSize: 5 });

    // Test with English
    apiService.setCultureHeader('en');
    const englishProducts = await listProducts({ pageSize: 5 });
  };

  return {
    getCurrentCulture,
    setCultureManually,
    testCultureHeaders
  };
};

// Example 4: Backend Integration Example
export const BackendIntegrationExample = `
// On your backend (C# example), you can access the Culture header like this:

[HttpGet("GetAll")]
public async Task<IActionResult> GetAllProducts()
{
    // Get the culture from the request header
    var culture = Request.Headers["Culture"].FirstOrDefault() ?? "en";
    
    // Use the culture to return localized content
    var products = await _productService.GetLocalizedProductsAsync(culture);
    
    return Ok(products);
}

// Or in your middleware (CultureMiddleware.cs):
public async Task InvokeAsync(HttpContext context, RequestDelegate next)
{
    var culture = context.Request.Headers["Culture"].FirstOrDefault() ?? "en";
    
    // Set the current culture for the request
    var cultureInfo = new CultureInfo(culture);
    CultureInfo.CurrentCulture = cultureInfo;
    CultureInfo.CurrentUICulture = cultureInfo;
    
    await next(context);
}
`;

// Example 5: React Component Usage
export const ComponentUsageExample = `
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useLanguageStore } from '@/store/languageStore';
import { listProducts } from '@/api';

const LocalizedProductsComponent = () => {
  const [products, setProducts] = useState([]);
  const { language, toggleLanguage } = useLanguageStore();

  const fetchProducts = async () => {
    try {
      // This will automatically include the correct Culture header
      const response = await listProducts({ pageSize: 10 });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [language]); // Refetch when language changes

  const handleLanguageToggle = () => {
    toggleLanguage(); // This will update the API Culture header automatically
  };

  return (
    <View>
      <Text>Current Language: {language}</Text>
      <Button title="Toggle Language" onPress={handleLanguageToggle} />
      <Text>Products Count: {products.length}</Text>
      {/* Render localized products */}
    </View>
  );
};

export default LocalizedProductsComponent;
`;

// Example 6: Testing Culture Headers
export const TestingExample = `
// Jest test example for Culture header functionality

import { apiService } from '@/api/apiService';
import { useLanguageStore } from '@/store/languageStore';

// Mock the language store
jest.mock('@/store/languageStore');
const mockLanguageStore = useLanguageStore as jest.MockedFunction<typeof useLanguageStore>;

describe('API Service Culture Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should include Arabic culture header when language is ar', async () => {
    // Mock the language store to return Arabic
    mockLanguageStore.mockReturnValue({
      language: 'ar',
      isRTL: true,
      // ... other properties
    });

    const spy = jest.spyOn(apiService.axiosInstance, 'get');
    
    await apiService.get('/test-endpoint');
    
    expect(spy).toHaveBeenCalledWith('/test-endpoint', expect.objectContaining({
      headers: expect.objectContaining({
        Culture: 'ar'
      })
    }));
  });

  test('should include English culture header when language is en', async () => {
    // Mock the language store to return English
    mockLanguageStore.mockReturnValue({
      language: 'en',
      isRTL: false,
      // ... other properties
    });

    const spy = jest.spyOn(apiService.axiosInstance, 'get');
    
    await apiService.get('/test-endpoint');
    
    expect(spy).toHaveBeenCalledWith('/test-endpoint', expect.objectContaining({
      headers: expect.objectContaining({
        Culture: 'en'
      })
    }));
  });
});
`;
