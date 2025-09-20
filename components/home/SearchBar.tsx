import React from 'react';
import { View } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import SearchInput from './searchbar/SearchInput';
import FilterButton from './FilterButton';

interface SearchBarProps {
  onNavigate?: (route: string) => void;
  className?: string;
}

export default function SearchBar({ onNavigate, className }: SearchBarProps) {
  const { colors } = useTheme();

  const handleFilterPress = () => {
    const route = '/products?showFilters=true';
    if (onNavigate) {
      onNavigate(route);
    } else {
      router.push(route as any);
    }
  };

  return (
    <View
      className={`px-4 py-3 w-full safe-area-top ${className || ''}`}
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <HStack className="items-center justify-between gap-3 w-full max-w-screen-xl mx-auto">
        {/* Search Input Component */}
        <SearchInput
          onNavigate={onNavigate}
          variant="rounded"
          size="lg"
          className="flex-1 min-w-0 max-w-none"
        />

        {/* Filter Button Component */}
        <FilterButton
          onPress={handleFilterPress}
          size={48}
          iconSize={20}
        />
      </HStack>
    </View>
  );
}
