import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons/GoogleLogin'
import { Icon } from '@/components/ui/icon';

interface SocialLoginProps {
  onPress?: () => void;
}

export function SocialLogin({ onPress }: SocialLoginProps) {
  return (
    <Button variant="outline" className="h-12 rounded-xl border-black" style={{ borderColor: '#000000', borderWidth: 1 }} onPress={onPress}>
      <HStack space="sm" className="items-center">
       <Icon as={GoogleIcon} size="lg" />
        <ButtonText className="text-black font-medium">Continue with Google</ButtonText>
      </HStack>
    </Button>
  );
}