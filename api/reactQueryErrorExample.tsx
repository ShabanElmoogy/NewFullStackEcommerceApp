/**
 * React Query Error Handling Examples
 * 
 * This shows the new approach where error toasts are handled in React Query
 * onError callbacks instead of in the API functions themselves.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { login, register } from '@/api/auth';
import { getCategory, createCategory } from '@/api/categories';
import { useLogin, useRegister } from '@/hooks';
import { useErrorToast, withErrorToast } from '@/hooks/useErrorToast';
import { getLoginErrorToastData, getCategoryErrorToastData } from '@/utils/errorUtils';
import { Toast } from 'toastify-react-native';
import { ToastType } from '@/types/toastType';

// Example 1: Using the custom login hook (Recommended)
const LoginWithCustomHook = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, isLoading } = useLogin();

  const onLogin = () => {
    // Error toast automatically handled in useLogin hook
    handleLogin(email, password);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>1. Using Custom Hook (Recommended)</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={onLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 2: Using useMutation directly with custom error handling
const LoginWithDirectMutation = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      Toast.show({
        type: ToastType.SUCCESS,
        text1: '🎉 Welcome Back!',
        text2: \`Hello \${data.user.userName || data.user.email}\`,
        visibilityTime: 3000,
      });
      // Handle success (navigation, state updates, etc.)
    },
    onError: (error) => {
      const errorData = getLoginErrorToastData(error);
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });
    },
  });

  const onLogin = () => {
    loginMutation.mutate({ email, password });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>2. Direct useMutation</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={onLogin}
        disabled={loginMutation.isPending}
      >
        <Text style={styles.buttonText}>
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 3: Using the withErrorToast helper
const CategoryWithErrorToastHelper = () => {
  const [categoryName, setCategoryName] = useState('');

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    ...withErrorToast({
      successMessage: 'Category created successfully!',
      errorMessage: (error) => getCategoryErrorToastData(error),
      onSuccess: (data) => {
        setCategoryName('');
        // Additional success logic
      },
    }),
  });

  const onCreate = () => {
    createCategoryMutation.mutate({
      nameAr: categoryName,
      nameEn: categoryName,
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>3. Using withErrorToast Helper</Text>
      <TextInput
        style={styles.input}
        placeholder="Category Name"
        value={categoryName}
        onChangeText={setCategoryName}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={onCreate}
        disabled={createCategoryMutation.isPending}
      >
        <Text style={styles.buttonText}>
          {createCategoryMutation.isPending ? 'Creating...' : 'Create Category'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 4: Using the useErrorToast hook
const CategoryWithErrorToastHook = () => {
  const [categoryId, setCategoryId] = useState('');
  const { showErrorToast, showSuccessToast } = useErrorToast();

  const categoryQuery = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategory(categoryId),
    enabled: !!categoryId,
    retry: false, // Don't retry on error for this example
  });

  const fetchCategory = () => {
    if (!categoryId) return;
    
    categoryQuery.refetch().then((result) => {
      if (result.data) {
        showSuccessToast('✅ Category Found', \`Found: \${result.data.nameEn}\`);
      }
    }).catch((error) => {
      showErrorToast(error, {
        title: '❌ Category Not Found',
        message: 'The requested category could not be found'
      });
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>4. Using useErrorToast Hook</Text>
      <TextInput
        style={styles.input}
        placeholder="Category ID"
        value={categoryId}
        onChangeText={setCategoryId}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={fetchCategory}
        disabled={categoryQuery.isFetching}
      >
        <Text style={styles.buttonText}>
          {categoryQuery.isFetching ? 'Fetching...' : 'Fetch Category'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Main component
const ReactQueryErrorExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Query Error Handling Examples</Text>
      
      <LoginWithCustomHook />
      <LoginWithDirectMutation />
      <CategoryWithErrorToastHelper />
      <CategoryWithErrorToastHook />
      
      <View style={styles.testSection}>
        <Text style={styles.testTitle}>Test Error Cases:</Text>
        <Text style={styles.testText}>
          • Try logging in with wrong credentials{'\n'}
          • Try creating a category with invalid data{'\n'}
          • Try fetching a non-existent category
        </Text>
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
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  testSection: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    marginTop: 10,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#856404',
  },
  testText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default ReactQueryErrorExample;

/*
Benefits of this approach:

1. ✅ Separation of Concerns
   - API functions focus on data fetching
   - React Query handles UI concerns (loading, error states, toasts)

2. ✅ Flexibility
   - Different components can handle the same API errors differently
   - Easy to customize error messages per use case

3. ✅ Reusability
   - Error handling utilities can be reused across different mutations
   - Custom hooks encapsulate common patterns

4. ✅ Testability
   - API functions are pure and easy to test
   - Error handling logic is separated and testable

5. ✅ Consistency
   - All error toasts follow the same pattern
   - Easy to update error handling globally
*/
