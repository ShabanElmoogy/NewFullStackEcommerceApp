import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { Bell } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Animated, { SlideInUp } from 'react-native-reanimated';

export default function Newsletter() {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View
      entering={SlideInUp.delay(1600)}
      style={{ paddingHorizontal: 20, marginBottom: 20, position: 'relative', zIndex: 10 }}
    >
      <View
      style={{
      backgroundColor: isDark ? colors.surfaceSecondary : '#1F2937',
      borderRadius: 24,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
      }}
      >
        <View
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 160,
            height: 160,
            backgroundColor: colors.primary + '20',
            borderRadius: 80,
          }}
        />

        <VStack space="md">
          <HStack className="items-center mb-2">
            <Icon as={Bell} size="lg" style={{ 
              color: isDark ? colors.primary : '#60A5FA', 
              marginRight: 12 
            }} />
            <Text style={{
              color: isDark ? colors.text : '#FFFFFF',
              fontWeight: 'bold',
              fontSize: 20
            }}>
              Stay in the Loop
            </Text>
          </HStack>

          <Text style={{
            color: isDark ? colors.textSecondary : '#D1D5DB',
            fontSize: 14,
            marginBottom: 24,
            lineHeight: 20
          }}>
            Get exclusive deals, new arrivals, and special offers delivered straight to your inbox.
          </Text>

          <HStack space="sm">
            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? colors.backgroundSecondary : 'rgba(255, 255, 255, 0.1)',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderWidth: 1,
                borderColor: isDark ? colors.border : 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Text style={{
                color: isDark ? colors.textTertiary : '#9CA3AF',
                fontSize: 14
              }}>
                Enter your email address
              </Text>
            </View>

            <Pressable
              style={{
                backgroundColor: colors.primary,
                borderRadius: 16,
                paddingHorizontal: 32,
                paddingVertical: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{
                color: colors.textInverse,
                fontWeight: '600',
                fontSize: 14
              }}>
                Subscribe
              </Text>
            </Pressable>
          </HStack>
        </VStack>
      </View>
    </Animated.View>
  );
}