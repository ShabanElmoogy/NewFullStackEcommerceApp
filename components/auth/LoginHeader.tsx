import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';

export function LoginHeader() {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.surfaceSecondary : colors.primary,
        marginHorizontal: -24,
        marginTop: -50,
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        marginBottom: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      <VStack className="items-center">
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ 
            fontSize: 20, 
            color: colors.primary, 
            fontWeight: 'bold' 
          }}>
            🛒
          </Text>
        </View>
        <Text style={{
          color: isDark ? colors.text : colors.textInverse,
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          letterSpacing: 2
        }}>
          LUXE MART
        </Text>
        <Text style={{
          color: isDark ? colors.textSecondary : colors.textInverse + 'CC', // 80% opacity
          fontSize: 12,
          textAlign: 'center',
          fontWeight: '300',
          letterSpacing: 1,
          marginTop: 4
        }}>
          Premium Shopping
        </Text>
      </VStack>
    </View>
  );
}