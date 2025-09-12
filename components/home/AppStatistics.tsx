import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Target, Users, Package, MapPin, Star } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const stats = [
  { label: 'Happy Customers', value: '50K+', icon: Users, color: '#10B981' },
  { label: 'Products', value: '100K+', icon: Package, color: '#3B82F6' },
  { label: 'Countries', value: '25+', icon: MapPin, color: '#F59E0B' },
  { label: 'Rating', value: '4.9★', icon: Star, color: '#EF4444' },
];

export default function AppStatistics() {
  return (
    <Animated.View
      entering={FadeInUp.delay(1500)}
      className="px-5 mt-8"
    >
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <VStack space="md">
          <HStack className="items-center justify-center mb-4">
            <Icon as={Target} size="lg" className="text-blue-600 mr-3" />
            <Text className="text-xl font-bold text-gray-900">
              Our Impact
            </Text>
          </HStack>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {stats.map((stat, index) => (
              <VStack key={index} className="items-center">
                <View
                  style={{
                    width: 52,
                    height: 52,
                    backgroundColor: `${stat.color}15`,
                    borderRadius: 26,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Icon as={stat.icon} size="md" style={{ color: stat.color }} />
                </View>
                <Text className="font-bold text-gray-900 text-lg">
                  {stat.value}
                </Text>
                <Text className="text-gray-500 text-xs text-center">
                  {stat.label}
                </Text>
              </VStack>
            ))}
          </View>
        </VStack>
      </View>
    </Animated.View>
  );
}