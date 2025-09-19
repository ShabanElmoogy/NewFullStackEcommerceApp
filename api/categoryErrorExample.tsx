/**
 * Category Error Example
 * 
 * This shows exactly how your RFC 9110 error format will be handled
 * when fetching a category that doesn't exist.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCategory } from '@/api/categories';
import { getCategoryErrorToastData } from '@/utils/errorUtils';
import { Toast } from 'toastify-react-native';
import { ToastType } from '@/types/toastType';

const CategoryErrorExample = () => {
  const [categoryId, setCategoryId] = useState('');

  // Method 1: Using useMutation with onError
  const fetchCategoryMutation = useMutation({
    mutationFn: (id: string) => getCategory(id),
    onSuccess: (data) => {
      Toast.show({
        type: ToastType.SUCCESS,
        text1: '✅ Category Found',
        text2: `Found: ${data.nameEn || data.nameAr}`,
        visibilityTime: 3000,
      });
    },
    onError: (error) => {
      
      // Your API returns:
      // {
      //   "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
      //   "title": "Not Found",
      //   "status": 404,
      //   "errors": {
      //     "Category.CategoryNotFound": ["The category was not found."]
      //   }
      // }
      
      // This gets converted to an ApiError by our apiService:
      // {
      //   name: 'ApiError',
      //   message: 'The category was not found.',
      //   status: 404,
      //   title: 'Not Found',
      //   type: 'https://tools.ietf.org/html/rfc9110#section-15.5.5',
      //   errors: { "Category.CategoryNotFound": ["The category was not found."] },
      //   fieldErrors: { "Category.CategoryNotFound": ["The category was not found."] }
      // }
      
      const errorData = getCategoryErrorToastData(error);
      
      // This will show a toast with:
      // Title: "❌ Category Not Found"
      // Message: "The category was not found."
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });
    },
  });

  // Method 2: Using useQuery with error handling
  const categoryQuery = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategory(categoryId),
    enabled: false, // Don't auto-fetch
    retry: false,   // Don't retry on error
  });

  const handleFetchWithMutation = () => {
    if (!categoryId.trim()) {
      Alert.alert('Error', 'Please enter a category ID');
      return;
    }
    fetchCategoryMutation.mutate(categoryId);
  };

  const handleFetchWithQuery = async () => {
    if (!categoryId.trim()) {
      Alert.alert('Error', 'Please enter a category ID');
      return;
    }

    try {
      const result = await categoryQuery.refetch();
      if (result.data) {
        Toast.show({
          type: ToastType.SUCCESS,
          text1: '✅ Category Found',
          text2: `Found: ${result.data.nameEn || result.data.nameAr}`,
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      const errorData = getCategoryErrorToastData(error);
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category Error Handling Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Category Fetch</Text>
        <Text style={styles.description}>
          Enter a category ID to test. Use a non-existent ID to see the error handling.
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Category ID (e.g., 999)"
          value={categoryId}
          onChangeText={setCategoryId}
          keyboardType="numeric"
        />
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleFetchWithMutation}
          disabled={fetchCategoryMutation.isPending}
        >
          <Text style={styles.buttonText}>
            {fetchCategoryMutation.isPending ? 'Fetching...' : 'Fetch with Mutation'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleFetchWithQuery}
          disabled={categoryQuery.isFetching}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            {categoryQuery.isFetching ? 'Fetching...' : 'Fetch with Query'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>What happens when you test:</Text>
        <Text style={styles.infoText}>
          1. Enter a non-existent category ID (e.g., 999){'\n'}
          2. Click either fetch button{'\n'}
          3. Your API returns the RFC 9110 error{'\n'}
          4. Our error handler shows a user-friendly toast{'\n'}
          5. Check the console for detailed error logs
        </Text>
      </View>

      <View style={styles.errorFormatSection}>
        <Text style={styles.errorFormatTitle}>Your API Error Format:</Text>
        <Text style={styles.errorFormatText}>
{`{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.5",
  "title": "Not Found",
  "status": 404,
  "errors": {
    "Category.CategoryNotFound": [
      "The category was not found."
    ]
  }
}`}
        </Text>
      </View>

      <View style={styles.toastPreviewSection}>
        <Text style={styles.toastPreviewTitle}>Expected Toast:</Text>
        <View style={styles.toastPreview}>
          <Text style={styles.toastPreviewIcon}>✕</Text>
          <View style={styles.toastPreviewContent}>
            <Text style={styles.toastPreviewTitleText}>❌ Category Not Found</Text>
            <Text style={styles.toastPreviewMessage}>The category was not found.</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  infoSection: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  errorFormatSection: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  errorFormatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f57c00',
    marginBottom: 8,
  },
  errorFormatText: {
    fontSize: 12,
    color: '#ef6c00',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  toastPreviewSection: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  toastPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 10,
  },
  toastPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
  },
  toastPreviewIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  toastPreviewContent: {
    flex: 1,
  },
  toastPreviewTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  toastPreviewMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
});

export default CategoryErrorExample;
