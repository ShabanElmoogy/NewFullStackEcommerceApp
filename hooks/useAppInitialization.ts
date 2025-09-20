import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { apiService } from '@/api/apiService';
import { useLanguageStore } from '@/store/languageStore';
import { useAuth } from '@/store/authStore';

export function useAppInitialization() {
  const systemColorScheme = useColorScheme();

  // Initialize API service and language store connection
  useEffect(() => {
    // Set up the language getter for API service
    apiService.setLanguageGetter(() => useLanguageStore.getState().language);
    
    // Set up the culture header callback for language store
    useLanguageStore.getState().setCultureHeaderCallback((lang: string) => {
      apiService.setCultureHeader(lang);
    });

    // Initialize API service with stored auth tokens
    const authState = useAuth.getState();
    if (authState.token && authState.refreshToken) {
      console.log('Initializing API service with stored tokens');
      apiService.setTokens(authState.token, authState.refreshToken);
    } else if (authState.token) {
      console.log('Initializing API service with stored token only');
      apiService.setAuthToken(authState.token);
    }
  }, []);
}