import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Truck, Shield, Headphones, Award } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const features = [
  { icon: Truck, title: 'Free Shipping', subtitle: 'Orders over $50', color: '#10B981' },
  { icon: Shield, title: 'Secure Payment', subtitle: '100% protected', color: '#3B82F6' },
  { icon: Headphones, title: '24/7 Support', subtitle: 'Always here', color: '#8B5CF6' },
  { icon: Award, title: 'Best Quality', subtitle: 'Premium only', color: '#F59E0B' },
];

export default function WhyChooseUs() {
  return (
    <Animated.View
      entering={FadeInUp.delay(1300)}
      className="px-5 mt-8"
    >
      <VStack space="md">
        <HStack className="items-center justify-center mb-2">
          <Icon as={Award} size="md" className="text-blue-600 mr-2" />
          <Text className="text-xl font-bold text-gray-900">
            Why Choose Us
          </Text>
        </HStack>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay(1400 + index * 100)}
              style={{
                width: (screenWidth - 52) / 2,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <VStack space="sm" className="items-center">
                <View
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: `${feature.color}15`,
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon as={feature.icon} size="lg" style={{ color: feature.color }} />
                </View>

                <VStack className="items-center">
                  <Text className="font-bold text-gray-900 text-base text-center">
                    {feature.title}
                  </Text>
                  <Text className="text-gray-500 text-sm text-center">
                    {feature.subtitle}
                  </Text>
                </VStack>
              </VStack>
            </Animated.View>
          ))}
        </View>
      </VStack>
    </Animated.View>
  );
}