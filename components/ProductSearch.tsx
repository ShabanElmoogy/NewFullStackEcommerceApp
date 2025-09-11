import React, { useState, useEffect } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { Text } from './ui/text';
import { HStack } from './ui/hstack';
import { SearchIcon, XIcon } from 'lucide-react-native';

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
  const [searchQuery, setSearchQuery] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onSearchChange(text);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 12,marginTop : 15 }}>
      <HStack
        style={{
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isFocused ? '#3B82F6' : '#E5E7EB',
          paddingHorizontal: 16,
          paddingVertical: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <SearchIcon 
          color={isFocused ? '#3B82F6' : '#9CA3AF'} 
          size={20} 
          style={{ marginRight: 12 }} 
        />
        
        <TextInput
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={{
            flex: 1,
            fontSize: 16,
            color: '#111827',
            paddingVertical: 0,
          }}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {searchQuery.length > 0 && (
          <Pressable
            onPress={clearSearch}
            style={{
              padding: 4,
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
              marginLeft: 8,
            }}
          >
            <XIcon color="#6B7280" size={16} />
          </Pressable>
        )}
      </HStack>
      
      {searchQuery.length > 0 && (
        <Text style={{ 
          fontSize: 12, 
          color: '#6B7280', 
          marginTop: 8, 
          marginLeft: 4 
        }}>
          Searching for "{searchQuery}"
        </Text>
      )}
    </View>
  );
}