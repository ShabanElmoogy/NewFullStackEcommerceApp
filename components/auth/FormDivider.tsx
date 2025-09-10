import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export function FormDivider() {
  return (
    <View className="flex-row items-center">
      <View className="flex-1 h-px bg-gray-300" />
      <Text className="mx-4 text-gray-500 font-medium text-xs">OR</Text>
      <View className="flex-1 h-px bg-gray-300" />
    </View>
  );
}