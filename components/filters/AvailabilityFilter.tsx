import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { Switch } from '../ui/switch';
import { useTheme } from '@/hooks/useTheme';

interface AvailabilityFilterProps {
  inStock: boolean | null;
  onSale: boolean;
  onStockChange: (value: boolean | null) => void;
  onSaleChange: (value: boolean) => void;
}

export default function AvailabilityFilter({
  inStock,
  onSale,
  onStockChange,
  onSaleChange,
}: AvailabilityFilterProps) {
  const { colors } = useTheme();

  const stockOptions = [
    { value: null, label: 'All' },
    { value: true, label: 'In Stock' },
    { value: false, label: 'Out of Stock' }
  ];

  return (
    <View className="px-5 mb-6">
      <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
        Availability & Offers
      </Text>
      
      {/* Stock Status */}
      <View className="mb-4">
        <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
          Stock Status
        </Text>
        <HStack className="gap-2">
          {stockOptions.map((option) => {
            const isSelected = inStock === option.value;
            
            return (
              <Pressable
                key={String(option.value)}
                onPress={() => onStockChange(option.value)}
                className="px-4 py-2 rounded-xl border"
                style={{
                  backgroundColor: isSelected ? colors.primary + '20' : colors.backgroundSecondary,
                  borderColor: isSelected ? colors.primary : colors.border,
                }}
              >
                <Text
                  className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}
                  style={{
                    color: isSelected ? colors.primary : colors.text,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </HStack>
      </View>

      {/* On Sale */}
      <HStack className="justify-between items-center">
        <Text className="text-sm font-semibold" style={{ color: colors.text }}>
          On Sale Only
        </Text>
        <Switch
          value={onSale}
          onValueChange={onSaleChange}
        />
      </HStack>
    </View>
  );
}
