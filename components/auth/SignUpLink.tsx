import React from 'react';
import { View } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';

interface SignUpLinkProps {
  onPress: () => void;
}

export function SignUpLink({ onPress }: SignUpLinkProps) {
  return (
    <View className="items-center mt-6">
      <HStack space="xs" className="items-center">
        <Text className="text-gray-600">Don't have an account?</Text>
        <Button variant="link" className="p-0" onPress={onPress}>
          <ButtonText className="text-black font-semibold underline">Sign Up</ButtonText>
        </Button>
      </HStack>
    </View>
  );
}