import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from 'react-native';
import { Divider } from '@/components/ui/divider';
import { useTheme } from '@/hooks/useTheme';

export const SocialLogin = () => {
  const { colors } = useTheme();

  return (
    <>
      {/* Social Sign Up Options */}
      <VStack space="sm">
        <Pressable
          style={{
            height: 48,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: '500'
          }}>
            Continue with Google
          </Text>
        </Pressable>
        
        <Pressable
          style={{
            height: 48,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: '500'
          }}>
            Continue with Apple
          </Text>
        </Pressable>
      </VStack>
    </>
  );
};