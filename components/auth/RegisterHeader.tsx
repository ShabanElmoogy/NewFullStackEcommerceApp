import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { User } from 'lucide-react-native';

export const RegisterHeader = () => {
  return (
    <VStack className="items-center mb-8" space="sm">
      <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-4">
        <Icon as={User} size="xl" className="text-white" />
      </View>
      <Heading size="2xl" className="text-typography-900 text-center">
        Create Account
      </Heading>
      <Text className="text-typography-600 text-center text-base">
        Join us and start your shopping journey
      </Text>
    </VStack>
  );
};