import React from 'react';
import { View, StatusBar } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Link } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export function EmptyCart() {
  const { colors, isDark } = useTheme();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <View className="flex-1 justify-center items-center p-6">
        <VStack className="items-center" space="lg">
          <View className="w-24 h-24 rounded-full items-center justify-center" style={{
            backgroundColor: colors.surfaceSecondary,
          }}>
            <Icon as={ShoppingBag} size="xl" style={{ color: colors.text }} />
          </View>
          <VStack className="items-center" space="sm">
            <Heading size="xl" style={{ color: colors.text }}>Your cart is empty</Heading>
            <Text className="text-center max-w-70" style={{
              color: colors.textSecondary,
            }}>
              Looks like you haven't added any items to your cart yet
            </Text>
          </VStack>
          <Link href="/products" asChild>
            <Button
              size="lg"
              className="mt-4"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              <Icon as={ShoppingBag} size="xl" style={{ color: colors.text }} />
              <ButtonText style={{ color: colors.text }}>Start Shopping</ButtonText>
            </Button>
          </Link>
        </VStack>
      </View>
    </View>
  );
}