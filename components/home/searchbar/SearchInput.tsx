import React, { useState, useEffect } from 'react';
import { useSearchStore } from '@/store/searchStore'
import { router } from 'expo-router';
import SimpleSearchInput from '@/components/ui/SimpleSearchInput';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  onNavigate?: (route: string) => void;
  placeholder?: string;
  variant?: 'rounded' | 'default';
  size?: 'sm' | 'md' | 'lg';
  autoSearch?: boolean;
  debounceMs?: number;
  className?: string;
}

export default function SearchInput({ 
  onNavigate,
  placeholder,
  variant = 'rounded',
  size = 'lg',
  autoSearch = true,
  debounceMs = 500,
  className = 'flex-1'
}: SearchInputProps) {
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, debounceMs);
  const { t } = useTranslation();

  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  const clearSearchQuery = useSearchStore((state) => state.clearSearchQuery);

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    setSearchQuery(text);
    if (text === '') clearSearchQuery();
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setSearchQuery(searchQuery.trim());
    setSearchText('');
    
    if (onNavigate) {
      onNavigate('/products');
    } else {
      router.push('/products');
    }
  };

  const handleClear = () => {
    setSearchText('');
    clearSearchQuery();
  };

  // Auto-search when user stops typing (if enabled)
  useEffect(() => {
    if (!autoSearch) return;
    
    const query = debouncedSearch.trim();
    if (query.length === 0) return;
    
    handleSearch(query);
  }, [debouncedSearch, autoSearch]);

  return (
    <SimpleSearchInput
      value={searchText}
      placeholder={placeholder || t('home.searchPlaceholder')}
      variant={variant}
      size={size}
      onChangeText={handleSearchTextChange}
      onSearch={handleSearch}
      autoSearch={false} // We handle auto-search internally
      onClear={handleClear}
      showSuggestions={false}
      className={`${className} transition-all duration-200 ease-in-out`}
    />
  );
}