import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';

export function FormDivider() {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center">
      <View style={{
        flex: 1,
        height: 1,
        backgroundColor: colors.border
      }} />
      <Text style={{
        marginHorizontal: 16,
        color: colors.textTertiary,
        fontWeight: '500',
        fontSize: 12
      }}>
        OR
      </Text>
      <View style={{
        flex: 1,
        height: 1,
        backgroundColor: colors.border
      }} />
    </View>
  );
}
