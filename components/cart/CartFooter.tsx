import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { CreditCard, ArrowLeft } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Link } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CartFooterProps {
  onCheckout: () => void;
  isCreatingOrder: boolean;
}

export function CartFooter({ onCheckout, isCreatingOrder }: CartFooterProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="absolute bottom-0 left-0 right-0 border-t shadow-lg px-4 pt-4"
      style={{
        backgroundColor: colors.background,
        borderTopColor: colors.border,
        shadowColor: colors.shadow,
        paddingBottom: Math.max(16, insets.bottom + 8),
      }}
    >
      <VStack space="sm">
        <Button
          size="lg"
          onPress={onCheckout}
          disabled={isCreatingOrder}
          className="opacity-70"
          style={{
            backgroundColor: colors.primary,
            opacity: isCreatingOrder ? 0.7 : 1
          }}
        >
          <Icon as={CreditCard} size="sm" className="mr-2" style={{ color: colors.textInverse }} />
          <ButtonText className="font-semibold" style={{ color: colors.textInverse }}>
            {isCreatingOrder ? 'Processing...' : 'Proceed to Checkout'}
          </ButtonText>
        </Button>

        <Link href="/" asChild>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent"
            style={{
              borderColor: colors.primary,
            }}
          >
            <Icon as={ArrowLeft} size="sm" className="mr-2" style={{ color: colors.primary }} />
            <ButtonText style={{ color: colors.primary }}>Continue Shopping</ButtonText>
          </Button>
        </Link>
      </VStack>
    </View>
  );
}