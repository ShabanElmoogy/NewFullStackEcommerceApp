import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Chrome, Apple } from 'lucide-react-native';

export const SocialLogin = () => {
  const { colors } = useTheme();

  return (
    <>
      {/* Social Sign Up Options */}
      <VStack space="sm">
        <Pressable
          className="h-12 rounded-xl border flex-row items-center justify-center mb-2"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <View className="flex-row items-center">
            <Chrome 
              size={20} 
              color="#4285F4" 
              className="mr-3"
            />
            <Text 
              className="text-base font-medium ml-3"
              style={{ color: colors.text }}
            >
              Continue with Google
            </Text>
          </View>
        </Pressable>
        
        <Pressable
          className="h-12 rounded-xl border flex-row items-center justify-center"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <View className="flex-row items-center">
            <Apple 
              size={20} 
              color={colors.text} 
              className="mr-3"
            />
            <Text 
              className="text-base font-medium ml-3"
              style={{ color: colors.text }}
            >
              Continue with Apple
            </Text>
          </View>
        </Pressable>
      </VStack>
    </>
  );
};
