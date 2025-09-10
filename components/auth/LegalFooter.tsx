import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export function LegalFooter() {
  return (
    <View className="items-center mt-6 mb-8">
      <Text className="text-gray-500 text-sm text-center">
        By signing in, you agree to our Terms of Service{"\n"}
        and Privacy Policy
      </Text>
    </View>
  );
}