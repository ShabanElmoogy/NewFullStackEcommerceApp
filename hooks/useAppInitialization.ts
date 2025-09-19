import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { apiService } from '@/api/apiService';
import { useLanguageStore } from '@/store/languageStore';

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
  }, []);
}