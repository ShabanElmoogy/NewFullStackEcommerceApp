import React, { useEffect, useState, useMemo } from 'react';
import { View, Pressable, TextInput, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Bell, Mail, Send, Sparkles, Gift, Star, Shield, Zap, Heart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Animated, { 
  SlideInUp, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming,
  FadeInDown,
  BounceIn,
  withSpring,
  Easing
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

export default function Newsletter({ disableInitialAnimation = false }: { disableInitialAnimation?: boolean }) {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Optimized animation values with better performance
  const sparkleRotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);
  const floatingY = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const backgroundFloat1 = useSharedValue(0);
  const backgroundFloat2 = useSharedValue(0);
  const doEnter = !disableInitialAnimation;

  // Memoized styles for better performance
  const containerStyle = useMemo(() => ({
    backgroundColor: isDark 
      ? colors.surfaceSecondary 
      : `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.primary}25 100%)`,
    borderRadius: 24,
    padding: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDark ? 0.15 : 0.25,
    shadowRadius: 16,
    elevation: 12,
  }), [colors, isDark]);

  const inputStyle = useMemo(() => ({
    backgroundColor: isDark ? colors.background : 'rgba(255, 255, 255, 0.95)',
    borderColor: isDark ? colors.border : 'rgba(255, 255, 255, 0.4)',
    color: isDark ? colors.text : colors.text,
  }), [colors, isDark]);

  const benefitsData = useMemo(() => [
    { icon: Zap, text: 'Instant deal notifications', color: colors.warning },
    { icon: Gift, text: 'Exclusive member discounts', color: colors.success },
    { icon: Heart, text: 'Personalized recommendations', color: colors.error },
    { icon: Shield, text: 'Privacy protected', color: colors.info }
  ], [colors]);

  useEffect(() => {
    // Optimized animations with spring physics
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );

    pulseScale.value = withRepeat(
      withSpring(1.15, { damping: 8, stiffness: 100 }),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 3000 }),
        withTiming(0.2, { duration: 3000 })
      ),
      -1,
      true
    );

    floatingY.value = withRepeat(
      withSequence(
        withSpring(-6, { damping: 12 }),
        withSpring(6, { damping: 12 })
      ),
      -1,
      true
    );

    // Background shapes floating animations
    backgroundFloat1.value = withRepeat(
      withSequence(
        withSpring(-10, { damping: 15 }),
        withSpring(10, { damping: 15 })
      ),
      -1,
      true
    );

    backgroundFloat2.value = withRepeat(
      withSequence(
        withSpring(8, { damping: 20 }),
        withSpring(-8, { damping: 20 })
      ),
      -1,
      true
    );
  }, []);

  // Optimized animated styles
  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }), []);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }), []);

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ translateY: backgroundFloat1.value }],
  }), []);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }), []);

  const handleSubscribe = async () => {
    if (!email.trim() || isLoading) return;
    
    setIsLoading(true);
    buttonScale.value = withSpring(0.95);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setEmail('');
      setIsLoading(false);
      buttonScale.value = withSpring(1);
      
      // Auto reset after 4 seconds
      setTimeout(() => setIsSubscribed(false), 4000);
    }, 1000);
  };

  return (
    <Animated.View
      entering={doEnter ? SlideInUp.delay(1600).springify().damping(12) : undefined}
      className="px-4"
    >
      {/* Optimized gradient container */}
      <View className="relative overflow-hidden rounded-3xl" style={containerStyle}>
        
        {/* Only animated mail icon remains */}

        <VStack space="lg">
          {/* Optimized header */}
          <Animated.View entering={doEnter ? FadeInDown.delay(100).springify() : undefined}>
            <HStack className="items-center mb-4">
              <Animated.View className="mr-4" style={pulseAnimatedStyle}>
                <View
                  className="items-center justify-center border-2 shadow-lg"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary + '40',
                  }}
                >
                  <Icon as={Mail} size={28} style={{ color: colors.primary }} />
                </View>
              </Animated.View>
              
              <VStack className="flex-1">
                <Text
                  className="font-black text-3xl leading-tight"
                  style={{ color: isDark ? colors.text : '#FFFFFF' }}
                >
                  Stay in the Loop
                </Text>
                <HStack className="items-center mt-1">
                  <View 
                    className="rounded-full mr-2" 
                    style={{ 
                      width: 8, 
                      height: 8, 
                      backgroundColor: colors.success 
                    }} 
                  />
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: isDark ? colors.primary : '#E0E7FF' }}
                  >
                    Join 50,000+ happy subscribers
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </Animated.View>

          {/* Enhanced description */}
          <Animated.View entering={doEnter ? FadeInDown.delay(2000).springify() : undefined}>
            <Text
              className="text-base leading-relaxed mb-5"
              style={{ color: isDark ? colors.textSecondary : '#E5E7EB' }}
            >
              Get exclusive deals, early access to sales, and personalized recommendations. 
              <Text className="font-bold" style={{ color: colors.warning }}> Join the VIP club!</Text>
            </Text>
          </Animated.View>

          {/* Optimized benefits grid */}
          <Animated.View entering={doEnter ? FadeInDown.delay(2200).springify() : undefined}>
            <View className="flex-row flex-wrap gap-3 mb-6">
              {benefitsData.map((benefit, index) => (
                <Animated.View
                  key={index}
                  entering={doEnter ? BounceIn.delay(2400 + index * 100).springify() : undefined}
                  className="flex-row items-center rounded-2xl px-3 py-2 border"
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Icon as={benefit.icon} size={12} style={{ color: benefit.color, marginRight: 6 }} />
                  <Text
                    className="text-xs font-medium"
                    style={{ color: isDark ? colors.textSecondary : '#F3F4F6' }}
                  >
                    {benefit.text}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Optimized input section */}
          <Animated.View entering={doEnter ? FadeInDown.delay(2600).springify() : undefined}>
            {!isSubscribed ? (
              <VStack space="md">
                {/* Enhanced input */}
                <View
                  className="rounded-2xl px-4 border-2 shadow-sm backdrop-blur-sm"
                  style={inputStyle}
                >
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your.email@example.com"
                    placeholderTextColor={isDark ? colors.textTertiary : '#9CA3AF'}
                    className="text-base py-4 font-medium"
                    style={{ color: inputStyle.color }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>

                {/* Enhanced button */}
                <Animated.View style={buttonAnimatedStyle}>
                  <Pressable
                    onPress={handleSubscribe}
                    disabled={isLoading || !email.trim()}
                    className="rounded-2xl py-2 items-center justify-center shadow-xl"
                    style={{
                      backgroundColor: isLoading || !email.trim() ? colors.textTertiary : colors.primary,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.3,
                      shadowRadius: 16,
                      elevation: 10,
                    }}
                  >
                    <HStack className="items-center py-3">
                      {isLoading ? (
                        <Animated.View
                          style={sparkleAnimatedStyle}
                          className="mr-2"
                        >
                          <Icon as={Sparkles} size={20} style={{ color: colors.textInverse }} />
                        </Animated.View>
                      ) : (
                        <View className="mr-2">
                          <Icon as={Send} size={20} style={{ color: colors.textInverse }} />
                        </View>
                      )}
                      <Text className="font-bold text-lg" style={{ color: colors.textInverse }}>
                        {isLoading ? 'Subscribing...' : 'Subscribe Now'}
                      </Text>
                    </HStack>
                  </Pressable>
                </Animated.View>
              </VStack>
            ) : (
              <Animated.View
                entering={doEnter ? BounceIn.springify().damping(8) : undefined}
                className="rounded-3xl p-8 items-center border-2 shadow-lg"
                style={{
                  backgroundColor: colors.success + '15',
                  borderColor: colors.success,
                }}
              >
                <Animated.View style={pulseAnimatedStyle} className="mb-3">
                  <Icon as={Heart} size={48} style={{ color: colors.success }} />
                </Animated.View>
                <Text className="font-black text-xl mb-2" style={{ color: colors.success }}>
                  Welcome aboard! 🎉
                </Text>
                <Text
                  className="text-center text-sm leading-relaxed"
                  style={{ color: isDark ? colors.textSecondary : '#6B7280' }}
                >
                  Check your inbox for a special welcome gift and start saving today!
                </Text>
              </Animated.View>
            )}
          </Animated.View>

          {/* Enhanced trust indicators */}
          <Animated.View entering={doEnter ? FadeInDown.delay(2800).springify() : undefined}>
            <HStack className="items-center justify-center mt-4">
              <Icon as={Shield} size={12} style={{ color: colors.success, marginRight: 6 }} />
              <Text
                className="text-xs text-center font-medium"
                style={{ color: isDark ? colors.textTertiary : '#D1D5DB' }}
              >
                100% secure • Unsubscribe anytime • No spam, ever
              </Text>
            </HStack>
          </Animated.View>
        </VStack>
      </View>
    </Animated.View>
  );
}