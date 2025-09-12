import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import SimpleSearchInput from '@/components/ui/SimpleSearchInput';

// Example 1: Basic Search
export function BasicSearchExample() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <VStack space="md" className="p-4">
      <Text className="text-lg font-semibold">Basic Search</Text>
      <SimpleSearchInput
        value={searchQuery}
        placeholder="Search anything..."
        onChangeText={setSearchQuery}
        onSearch={(query) => console.log('Searching for:', query)}
      />
    </VStack>
  );
}

// Example 2: Auto Search with Suggestions
export function AutoSearchExample() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const suggestions = [
    'iPhone 15',
    'Samsung Galaxy',
    'MacBook Pro',
    'AirPods',
    'iPad Air'
  ];

  return (
    <VStack space="md" className="p-4">
      <Text className="text-lg font-semibold">Auto Search with Suggestions</Text>
      <SimpleSearchInput
        value={searchQuery}
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        autoSearch={true}
        searchDelay={300}
        onSearch={(query) => console.log('Auto searching for:', query)}
        showSuggestions={true}
        suggestions={suggestions}
        onSuggestionPress={(suggestion) => {
          setSearchQuery(suggestion);
          console.log('Selected suggestion:', suggestion);
        }}
      />
    </VStack>
  );
}

// Example 3: Different Variants
export function SearchVariantsExample() {
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [query3, setQuery3] = useState('');

  return (
    <VStack space="lg" className="p-4">
      <Text className="text-lg font-semibold">Search Variants</Text>
      
      <VStack space="sm">
        <Text className="text-sm font-medium text-gray-600">Default</Text>
        <SimpleSearchInput
          value={query1}
          placeholder="Default search..."
          onChangeText={setQuery1}
          variant="default"
        />
      </VStack>

      <VStack space="sm">
        <Text className="text-sm font-medium text-gray-600">Rounded</Text>
        <SimpleSearchInput
          value={query2}
          placeholder="Rounded search..."
          onChangeText={setQuery2}
          variant="rounded"
        />
      </VStack>

      <VStack space="sm">
        <Text className="text-sm font-medium text-gray-600">Minimal</Text>
        <SimpleSearchInput
          value={query3}
          placeholder="Minimal search..."
          onChangeText={setQuery3}
          variant="minimal"
        />
      </VStack>
    </VStack>
  );
}

// Example 4: Different Sizes
export function SearchSizesExample() {
  const [querySmall, setQuerySmall] = useState('');
  const [queryMedium, setQueryMedium] = useState('');
  const [queryLarge, setQueryLarge] = useState('');

  return (
    <VStack space="lg" className="p-4">
      <Text className="text-lg font-semibold">Search Sizes</Text>
      
      <VStack space="sm">
        <Text className="text-sm font-medium text-gray-600">Small</Text>
        <SimpleSearchInput
          value={querySmall}
          placeholder="Small search..."
          onChangeText={setQuerySmall}
          size="sm"
        />
      </VStack>

      <VStack space="sm">
        <Text className="text-sm font-medium text-gray-600">Medium</Text>
        <SimpleSearchInput
          value={queryMedium}
          placeholder="Medium search..."
          onChangeText={setQueryMedium}
          size="md"
        />
      </VStack>

      <VStack space="sm">
        <Text className="text-sm font-medium text-gray-600">Large</Text>
        <SimpleSearchInput
          value={queryLarge}
          placeholder="Large search..."
          onChangeText={setQueryLarge}
          size="lg"
        />
      </VStack>
    </VStack>
  );
}

// Example 5: Search in Header/Navigation
export function HeaderSearchExample() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View className="bg-white border-b border-gray-200 px-4 py-2">
      <SimpleSearchInput
        value={searchQuery}
        placeholder="Search in app..."
        onChangeText={setSearchQuery}
        variant="rounded"
        size="md"
        autoSearch={true}
        onSearch={(query) => {
          // Navigate to search results
          console.log('Navigate to search results for:', query);
        }}
      />
    </View>
  );
}

// Example 6: Search with Custom Actions
export function CustomSearchExample() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    // Custom search logic
    console.log('Custom search logic for:', query);
    // Could navigate to different screens based on query
    // Could filter different data sources
    // Could trigger API calls
  };

  const handleClear = () => {
    console.log('Search cleared');
    // Custom clear logic
  };

  return (
    <VStack space="md" className="p-4">
      <Text className="text-lg font-semibold">Custom Search Actions</Text>
      <SimpleSearchInput
        value={searchQuery}
        placeholder="Search with custom actions..."
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
        onClear={handleClear}
        onFocus={() => console.log('Search focused')}
        onBlur={() => console.log('Search blurred')}
        variant="rounded"
        size="lg"
      />
    </VStack>
  );
}

// Complete Examples Component
export default function SearchExamples() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <VStack space="xl" className="pb-8">
        <BasicSearchExample />
        <AutoSearchExample />
        <SearchVariantsExample />
        <SearchSizesExample />
        <HeaderSearchExample />
        <CustomSearchExample />
      </VStack>
    </ScrollView>
  );
}