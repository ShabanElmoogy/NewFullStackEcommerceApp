import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Truck, Shield, Headphones, Award } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const features = [
  { icon: Truck, title: 'Free Shipping', subtitle: 'Orders over $50', color: '#10B981' },
  { icon: Shield, title: 'Secure Payment', subtitle: '100% protected', color: '#3B82F6' },
  { icon: Headphones, title: '24/7 Support', subtitle: 'Always here', color: '#8B5CF6' },
  { icon: Award, title: 'Best Quality', subtitle: 'Premium only', color: '#F59E0B' },
];

export default function WhyChooseUs() {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(1300)}
      style={{ paddingHorizontal: 20, marginTop: 32 }}
    >
      <VStack space="md">
        <HStack className="items-center justify-center mb-2">
          <Icon as={Award} size="md" style={{ color: colors.primary, marginRight: 8 }} />
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text
          }}>
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
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 20,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <VStack space="sm" className="items-center">
                <View
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: feature.color + '15',
                    borderRadius: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon as={feature.icon} size="lg" style={{ color: feature.color }} />
                </View>

                <VStack className="items-center">
                  <Text style={{
                    fontWeight: 'bold',
                    color: colors.text,
                    fontSize: 16,
                    textAlign: 'center'
                  }}>
                    {feature.title}
                  </Text>
                  <Text style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    textAlign: 'center'
                  }}>
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