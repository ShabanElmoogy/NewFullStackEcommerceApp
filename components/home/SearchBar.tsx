import React, { useState } from 'react';
import { useSearchStore } from '../../store/searchStore';
import { View, Pressable } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import SimpleSearchInput from '@/components/ui/SimpleSearchInput';
import { useTheme } from '@/hooks/useTheme';
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
  const { colors } = useTheme();

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

  const handleSuggestionPress = (suggestion: string) => {
    setSearchText(suggestion);
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleClear = () => {
    setSearchText('');
    clearSearchQuery();
  };

  const handleFilterPress = () => {
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
    <View style={{
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.backgroundSecondary
    }}>
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
          autoSearch={false}
          showSuggestions={true}
          suggestions={['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty']}
          onSuggestionPress={handleSuggestionPress}
          className="flex-1"
        />

        {/* Filter Button */}
        <Animated.View style={filterButtonStyle}>
          <Pressable onPress={handleFilterPress} style={{ opacity: 0.8 }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              borderWidth: 1,
              borderColor: colors.border
            }}>
              <Filter size={20} color={colors.textSecondary} />
            </View>
          </Pressable>
        </Animated.View>
      </HStack>
    </View>
  );
}
