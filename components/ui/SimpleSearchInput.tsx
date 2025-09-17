import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Search, X } from 'lucide-react-native';

interface SimpleSearchInputProps {
  // Core props
  value?: string;
  placeholder?: string;
  
  // Event handlers
  onChangeText?: (text: string) => void;
  onSearch?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  
  // Suggestions
  showSuggestions?: boolean;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
  
  // Auto search behavior
  autoSearch?: boolean;
  debounceDelay?: number;
  
  // Styling
  variant?: 'default' | 'rounded' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export default function SimpleSearchInput({
  value = '',
  placeholder = 'Search...',
  onChangeText,
  onSearch,
  onFocus,
  onBlur,
  onClear,
  showSuggestions = false,
  suggestions = [],
  onSuggestionPress,
  autoSearch = false,
  debounceDelay = 300,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
}: SimpleSearchInputProps) {
  // Internal state for the input text
  const [internalText, setInternalText] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  
  // Refs for debouncing
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchedTextRef = useRef<string>('');

  // Sync internal state with external value prop
  useEffect(() => {
    setInternalText(value);
  }, [value]);

  // Clear debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle text input changes
  const handleTextChange = (newText: string) => {
    setInternalText(newText);
    
    // Immediately notify parent of text change
    onChangeText?.(newText);
    
    // Handle auto-search with debouncing
    if (autoSearch && onSearch) {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      const trimmedImmediate = newText.trim();

      // If input is cleared, trigger search immediately without debounce
      if (trimmedImmediate === '') {
        lastSearchedTextRef.current = '';
        onSearch('');
        return;
      }
      
      // Set new timeout for auto-search
      debounceTimeoutRef.current = setTimeout(() => {
        const trimmedText = newText.trim();
        
        // Only search if text has changed and is not empty
        if (trimmedText && trimmedText !== lastSearchedTextRef.current) {
          lastSearchedTextRef.current = trimmedText;
          onSearch(trimmedText);
        }
      }, debounceDelay);
    }
  };

  // Handle manual search (when user presses enter or search button)
  const handleManualSearch = () => {
    const trimmedText = internalText.trim();
    
    if (trimmedText && onSearch) {
      // Clear any pending auto-search
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      lastSearchedTextRef.current = trimmedText;
      onSearch(trimmedText);
    }
  };

  // Handle clear button
  const handleClear = () => {
    setInternalText('');
    onChangeText?.('');
    onClear?.();
    
    // Clear any pending searches
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    lastSearchedTextRef.current = '';

    // Immediately trigger an empty search so results clear without delay
    if (onSearch) {
      onSearch('');
    }
  };

  // Handle suggestion selection
  const handleSuggestionPress = (suggestion: string) => {
    setInternalText(suggestion);
    onChangeText?.(suggestion);
    onSuggestionPress?.(suggestion);
    
    // Immediately search when suggestion is selected
    if (onSearch) {
      lastSearchedTextRef.current = suggestion;
      onSearch(suggestion);
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  // Size configurations
  const sizeConfig = {
    sm: { height: 36, paddingHorizontal: 12, fontSize: 14, iconSize: 16 },
    md: { height: 40, paddingHorizontal: 14, fontSize: 15, iconSize: 18 },
    lg: { height: 48, paddingHorizontal: 16, fontSize: 16, iconSize: 20 },
  }[size];

  // Variant configurations
  const variantConfig = {
    default: {
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      borderColor: isFocused ? '#3B82F6' : '#E5E7EB',
      borderWidth: 1,
    },
    rounded: {
      borderRadius: 24,
      backgroundColor: '#F9FAFB',
      borderColor: isFocused ? '#3B82F6' : '#E5E7EB',
      borderWidth: 1,
    },
    minimal: {
      borderRadius: 0,
      backgroundColor: 'transparent',
      borderColor: isFocused ? '#3B82F6' : '#D1D5DB',
      borderWidth: 0,
      borderBottomWidth: 1,
    },
  }[variant];

  // Filter suggestions based on current input
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(internalText.toLowerCase())
  );

  const shouldShowSuggestions = showSuggestions && isFocused && 
    (internalText.length > 0 || suggestions.length > 0);

  return (
    <View className={className}>
      {/* Input Container */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          ...variantConfig,
        }}
      >
        {/* Search Icon */}
        <Search 
          size={sizeConfig.iconSize} 
          color={isFocused ? '#3B82F6' : '#6B7280'} 
          style={{ marginRight: 8 }}
        />
        
        {/* Text Input */}
        <TextInput
          value={internalText}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleManualSearch}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          editable={!disabled}
          style={{
            flex: 1,
            fontSize: sizeConfig.fontSize,
            color: disabled ? '#9CA3AF' : '#111827',
            paddingVertical: 0,
          }}
        />
        
        {/* Clear Button */}
        {internalText.length > 0 && (
          <Pressable 
            onPress={handleClear}
            style={{
              padding: 4,
              marginLeft: 8,
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X 
              size={sizeConfig.iconSize - 2} 
              color="#6B7280" 
            />
          </Pressable>
        )}
      </View>

      {/* Suggestions Dropdown */}
      {shouldShowSuggestions && (
        <View 
          style={{
            marginTop: 8,
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            maxHeight: 200,
          }}
        >
          {/* Search Current Text Option */}
          {internalText.length > 0 && (
            <Pressable
              onPress={handleManualSearch}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: filteredSuggestions.length > 0 ? 1 : 0,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <HStack className="items-center" space="sm">
                <Search size={16} color="#6B7280" />
                <Text className="text-gray-700 flex-1">
                  Search for "{internalText}"
                </Text>
              </HStack>
            </Pressable>
          )}
          
          {/* Suggestions List */}
          {filteredSuggestions.length > 0 && (
            <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{
                fontSize: 12,
                color: '#6B7280',
                textTransform: 'uppercase',
                fontWeight: '600',
                marginBottom: 8,
              }}>
                {internalText.length > 0 ? 'Suggestions' : 'Popular Searches'}
              </Text>
              {filteredSuggestions.map((suggestion, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSuggestionPress(suggestion)}
                  style={{ 
                    paddingVertical: 8,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ 
                    color: '#4B5563',
                    fontSize: 15,
                  }}>
                    {suggestion}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}