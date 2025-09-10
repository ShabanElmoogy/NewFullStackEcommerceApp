import React from 'react';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Icon} from '@/components/ui/icon';
import { LogIn } from 'lucide-react-native'

interface SignInButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export function SignInButton({ onPress, loading }: SignInButtonProps) {
  return (
    <Button
      className="h-14 rounded-xl mt-4 flex-row items-center"
      onPress={onPress}
      disabled={!!loading}
    >
      {/* Icon on the left */}
      {!loading && (
        <Icon as={LogIn} size="xl" className="text-white"/>
      )}

      {/* Text */}
      <ButtonText className="text-white font-semibold text-lg ml-2">
        {loading ? 'Signing In...' : 'Sign In'}
      </ButtonText>
    </Button>
  );
}
