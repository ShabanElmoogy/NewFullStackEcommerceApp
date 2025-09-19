import React from 'react';
import { View } from 'react-native';
import { Text } from '../../ui/text';
import SimpleSearchInput from '../../ui/SimpleSearchInput';

interface ProductSearchProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
  value?: string;
}

export default function ProductSearch({ 
  onSearchChange, 
  placeholder = "Search products, brands, categories...",
  value = ""
}: ProductSearchProps) {
  
  // Handle text changes (real-time updates)
  const handleTextChange = (text: string) => {
    onSearchChange(text);
  };

  // Handle search execution (when user presses enter or search button)
  const handleSearch = (searchQuery: string) => {
    // The search execution is handled by the parent component
    // through the onSearchChange callback
    onSearchChange(searchQuery);
  };

  // Handle clear
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 12, marginTop: 15 }}>
      <SimpleSearchInput
        value={value}
        placeholder={placeholder}
        onChangeText={handleTextChange}
        onSearch={handleSearch}
        onClear={handleClear}
        variant="default"
        size="lg"
        autoSearch={true} // Enable auto-search for real-time filtering
        debounceDelay={300}
        showSuggestions={false} // Disable suggestions in product search
        className="shadow-sm"
      />
      
      {value && value.length > 0 && (
        <Text style={{ 
          fontSize: 12, 
          color: '#6B7280', 
          marginTop: 8, 
          marginLeft: 4 
        }}>
          Searching for "{value}"
        </Text>
      )}
    </View>
  );
}
