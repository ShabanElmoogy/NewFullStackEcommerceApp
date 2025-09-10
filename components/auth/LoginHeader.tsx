import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export function LoginHeader() {
  return (
    <View
      style={{
        backgroundColor: '#000000',
        marginHorizontal: -24,
        marginTop: -50,
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        marginBottom: 40,
      }}
    >
      <VStack className="items-center">
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 20, color: '#000000', fontWeight: 'bold' }}>🛒</Text>
        </View>
        <Heading className="text-white text-lg font-bold text-center tracking-widest">LUXE MART</Heading>
        <Text className="text-gray-300 text-xs text-center font-light tracking-wide mt-1">Premium Shopping</Text>
      </VStack>
    </View>
  );
}