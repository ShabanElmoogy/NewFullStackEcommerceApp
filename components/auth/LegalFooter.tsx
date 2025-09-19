import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';

export function LegalFooter() {
  const { colors } = useTheme();

  return (
    <View className="items-center mt-6 mb-8">
      <Text style={{
        color: colors.textTertiary,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20
      }}>
        By signing in, you agree to our Terms of Service{"\n"}
        and Privacy Policy
      </Text>
    </View>
  );
}
