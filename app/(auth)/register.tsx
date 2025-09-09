import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <VStack className="flex-1 items-center justify-center p-6" space="lg">
        <Text className="text-2xl font-bold">Register</Text>
        <Text className="text-typography-600 text-center">
          Registration screen placeholder. Implement your sign-up form here.
        </Text>
        <Button onPress={() => router.replace('/(auth)/login')}>
          <ButtonText>Go to Login</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}
