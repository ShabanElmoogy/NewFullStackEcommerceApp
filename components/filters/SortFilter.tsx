import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { VStack } from '../ui/vstack';
import { CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface SortOption {
  value: string;
  label: string;
}

interface SortFilterProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
}

export default function SortFilter({ sortBy, onSortChange, sortOptions }: SortFilterProps) {
  const { colors } = useTheme();

  return (
    <View className="px-5 mb-6">
      <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
        Sort By
      </Text>
      <VStack className="gap-2">
        {sortOptions.map((option) => {
          const isSelected = sortBy === option.value;
          
          return (
            <Pressable
              key={option.value}
              onPress={() => onSortChange(option.value)}
              className="flex-row items-center px-4 py-3 rounded-xl border"
              style={{
                backgroundColor: isSelected ? colors.success + '20' : colors.backgroundSecondary,
                borderColor: isSelected ? colors.success : colors.border,
              }}
            >
              <Text
                className={`text-sm flex-1 ${isSelected ? 'font-semibold' : 'font-medium'}`}
                style={{
                  color: isSelected ? colors.success : colors.text,
                }}
              >
                {option.label}
              </Text>
              {isSelected && (
                <View
                  className="w-5 h-5 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.success }}
                >
                  <CheckCircle color={colors.textInverse} size={12} />
                </View>
              )}
            </Pressable>
          );
        })}
      </VStack>
    </View>
  );
}