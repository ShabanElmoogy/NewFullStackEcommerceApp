import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { StarIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface RatingFilterProps {
  minRating: number;
  onRatingChange: (rating: number) => void;
}

export default function RatingFilter({ minRating, onRatingChange }: RatingFilterProps) {
  const { colors } = useTheme();

  return (
    <View className="px-5 mb-6">
      <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
        Minimum Rating
      </Text>
      <HStack className="gap-3 flex-wrap">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isSelected = minRating >= rating;
          
          return (
            <Pressable
              key={rating}
              onPress={() => onRatingChange(minRating === rating ? 0 : rating)}
              className="flex-row items-center px-3 py-2 rounded-xl border"
              style={{
                backgroundColor: isSelected ? colors.warning + '20' : colors.backgroundSecondary,
                borderColor: isSelected ? colors.warning : colors.border,
              }}
            >
              <View className="flex-row">
                {Array.from({ length: rating }, (_, i) => (
                  <View key={i} className="mr-0.5">
                    <StarIcon
                      color={isSelected ? colors.warning : colors.textTertiary}
                      size={16}
                    />
                  </View>
                ))}
              </View>
              <Text
                className={`text-sm ml-1 ${isSelected ? 'font-semibold' : 'font-medium'}`}
                style={{
                  color: isSelected ? colors.warning : colors.textSecondary,
                }}
              >
                {rating}+
              </Text>
            </Pressable>
          );
        })}
      </HStack>
    </View>
  );
}