import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';

export const LoginLink = () => {
  const router = useRouter();

  return (
    <HStack className="items-center justify-center mt-6" space="xs">
      <Text className="text-typography-600">Already have an account?</Text>
      <Pressable onPress={() => router.replace('/(auth)/login')}>
        <Text className="text-primary-600 font-semibold">Sign In</Text>
      </Pressable>
    </HStack>
  );
};
