import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { Bell } from 'lucide-react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';

export default function Newsletter() {
  return (
    <Animated.View
      entering={SlideInUp.delay(1600)}
      className="px-5 mt-8"
    >
      <View
        style={{
          backgroundColor: '#1F2937',
          borderRadius: 24,
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 160,
            height: 160,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: 80,
          }}
        />

        <VStack space="md">
          <HStack className="items-center mb-2">
            <Icon as={Bell} size="lg" className="text-blue-400 mr-3" />
            <Text className="text-white font-bold text-xl">
              Stay in the Loop
            </Text>
          </HStack>

          <Text className="text-gray-300 text-sm mb-6 leading-relaxed">
            Get exclusive deals, new arrivals, and special offers delivered straight to your inbox.
          </Text>

          <HStack space="sm">
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}
            >
              <Text className="text-gray-400 text-sm">
                Enter your email address
              </Text>
            </View>

            <Button className="bg-blue-600 rounded-2xl px-8 py-3">
              <ButtonText className="text-white font-semibold">
                Subscribe
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </View>
    </Animated.View>
  );
}