import React from 'react';
import { View } from 'react-native';
import { AlertCircleIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

interface ProductsErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export default function ProductsErrorState({ error, onRetry }: ProductsErrorStateProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <VStack className="flex-1 justify-center items-center px-8" style={{ backgroundColor: colors.background }}>
      <AlertCircleIcon color={colors.error} size={48} />
      <Text className="text-xl font-bold mt-4 mb-2 text-center" style={{ color: colors.text }}>
        {t('products.error.title')}
      </Text>
      <Text className="text-base text-center mb-6" style={{ color: colors.textSecondary }}>
        {error.message}
      </Text>
      <Button onPress={onRetry} className="px-6 py-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
        <ButtonText className="text-white font-semibold">{t('products.error.tryAgain')}</ButtonText>
      </Button>
    </VStack>
  );
}