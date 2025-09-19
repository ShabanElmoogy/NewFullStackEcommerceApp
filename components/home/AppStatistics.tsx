import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Target, Users, Package, MapPin, Star } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';


export default function AppStatistics() {
  const { colors, isDark } = useTheme();
  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: Users, color: colors.success },
    { label: 'Products', value: '100K+', icon: Package, color: colors.primary },
    { label: 'Countries', value: '25+', icon: MapPin, color: colors.warning },
    { label: 'Rating', value: '4.9★', icon: Star, color: colors.error },
  ];
  return (
    <Animated.View
      entering={FadeInUp.delay(1500)}
      className="px-5"
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          padding: 24,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.25 : 0.12,
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <VStack space="md">
          <HStack className="items-center justify-center mb-4">
            <Icon as={Target} size="lg" style={{ color: colors.primary, marginRight: 12 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
              Our Impact
            </Text>
          </HStack>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start' }}>
            {stats.map((stat, index) => (
              <VStack key={index} className="items-center" style={{ width: '25%', paddingHorizontal: 4 }}>
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
                <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: 18 }}>
                  {stat.value}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: 'center', flexWrap: 'wrap' }}>
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
