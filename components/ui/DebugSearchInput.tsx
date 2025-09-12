import React, { useState, useEffect } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { Search, X } from 'lucide-react-native';

interface DebugSearchInputProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
}

export default function DebugSearchInput({
  value = '',
  placeholder = 'Search...',
  onChangeText,
  onClear,
}: DebugSearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  // Sync with external value
  useEffect(() => {
    console.log('DebugSearchInput: External value changed to:', value);
    setInternalValue(value);
  }, [value]);

  const handleChangeText = (text: string) => {
    console.log('DebugSearchInput: Text changed to:', text);
    setInternalValue(text);
    onChangeText?.(text);
  };

  const handleClear = () => {
    console.log('DebugSearchInput: Clear button pressed');
    setInternalValue('');
    onChangeText?.('');
    onClear?.();
  };

  console.log('DebugSearchInput: Rendering with internalValue:', internalValue, 'externalValue:', value);

  return (
    <View style={{ marginBottom: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 48,
          paddingHorizontal: 16,
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          borderRadius: 8,
        }}
      >
        {/* Search Icon */}
        <Search 
          size={20} 
          color="#6B7280" 
          style={{ marginRight: 8 }}
        />
        
        {/* Text Input */}
        <TextInput
          value={internalValue}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          style={{
            flex: 1,
            fontSize: 16,
            color: '#111827',
            paddingVertical: 0,
          }}
        />
        
        {/* Clear Button */}
        {internalValue && internalValue.length > 0 && (
          <Pressable 
            onPress={handleClear}
            style={{
              padding: 6,
              marginLeft: 8,
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X 
              size={16} 
              color="#6B7280" 
            />
          </Pressable>
        )}
      </View>
      
      {/* Debug Info */}
      <Text style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
        Internal: "{internalValue}" | External: "{value}"
      </Text>
    </View>
  );
}