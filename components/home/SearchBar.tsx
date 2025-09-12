import React, { useState } from 'react';
import { useSearchStore } from '../../store/searchStore';
import { View, Pressable } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import SimpleSearchInput from '@/components/ui/SimpleSearchInput';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring
} from 'react-native-reanimated';

interface SearchBarProps {
  onNavigate?: (route: string) => void;
}

export default function SearchBar({ onNavigate }: SearchBarProps) {
  const [searchText, setSearchText] = useState('');
  const scaleAnimation = useSharedValue(1);

  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  // Handle search text changes (for real-time updates if needed)
  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    setSearchQuery(text);
    // If the input is cleared, also clear Zustand searchQuery for immediate filter update
    if (text === '') {
      setSearchQuery('');
    }
  };

  // Handle actual search execution
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setSearchQuery(searchQuery.trim());
    if (onNavigate) {
      onNavigate('/products');
    } else {
      router.push('/products');
    }
  };

  // Handle suggestion selection
  const handleSuggestionPress = (suggestion: string) => {
    setSearchText(suggestion);
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle search input clear
  const clearSearchQuery = useSearchStore((state) => state.clearSearchQuery);
  const handleClear = () => {
    setSearchText('');
    clearSearchQuery();
  };

  // Handle filter button press
  const handleFilterPress = () => {
    // Animate button press
    scaleAnimation.value = withSpring(0.95, { damping: 10, stiffness: 200 }, () => {
      scaleAnimation.value = withSpring(1, { damping: 10, stiffness: 200 });
    });
    
    const route = '/products?showFilters=true';
    
    if (onNavigate) {
      onNavigate(route);
    } else {
      router.push(route as any);
    }
  };

  const filterButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
  }));

  return (
    <View className="px-4 py-3 bg-white">
      <HStack className="items-center" space="sm">
        {/* Search Input */}
        <SimpleSearchInput
          value={searchText}
          placeholder="Search products..."
          variant="rounded"
          size="lg"
          onChangeText={handleSearchTextChange}
          onSearch={handleSearch}
          onClear={handleClear}
          autoSearch={false} // Disable auto-search, only search on manual trigger
          showSuggestions={true}
          suggestions={['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty']}
          onSuggestionPress={handleSuggestionPress}
          className="flex-1"
        />

        {/* Filter Button */}
        <Animated.View style={filterButtonStyle}>
          <Pressable
            onPress={handleFilterPress}
            className="active:opacity-80"
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#3B82F6',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Filter size={20} color="#FFFFFF" />
            </View>
          </Pressable>
        </Animated.View>
      </HStack>
    </View>
  );
}