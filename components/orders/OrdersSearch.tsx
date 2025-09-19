import React, { useState, useEffect } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Search, X } from 'lucide-react-native';

interface OrdersSearchProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
  value?: string;
}

export function OrdersSearch({ 
  onSearchChange, 
  placeholder = "Search orders by ID, product name...",
  value = ""
}: OrdersSearchProps) {
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
    <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
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
        <Search 
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
            <X color="#6B7280" size={16} />
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
