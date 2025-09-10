import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';

export const SocialLogin = () => {
  return (
    <>
      {/* Social Sign Up Options */}
      <VStack space="sm">
        <Button variant="outline" className="h-12">
          <ButtonText className="text-typography-700">Continue with Google</ButtonText>
        </Button>
        <Button variant="outline" className="h-12">
          <ButtonText className="text-typography-700">Continue with Apple</ButtonText>
        </Button>
      </VStack>
    </>
  );
};