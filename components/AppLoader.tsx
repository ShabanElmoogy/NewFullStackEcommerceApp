import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Sparkles } from 'lucide-react-native';
import Animated, { 
  FadeInUp, 
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { useLanguageStore } from '@/store/languageStore';

interface AppLoaderProps {
  /** Custom loading message */
  message?: string;
  /** Custom subtitle message */
  subtitle?: string;
  /** Custom delay for entrance animation */
  delay?: number;
  /** Custom container class name */
  className?: string;
}

export default function AppLoader({
  message = 'Loading...',
  subtitle = 'Please wait while we prepare everything for you',
  delay = 1000,
  className = 'px-5'
}: AppLoaderProps) {
  const { colors } = useTheme();
  const { language } = useLanguageStore();
  
  // Animation values
  const sparkleRotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const headerGlow = useSharedValue(0);

  // Get localized messages
  const displayMessage = language === 'ar' ? getArabicMessage() : message;
  const displaySubtitle = language === 'ar' ? getArabicSubtitle() : subtitle;

  function getArabicMessage(): string {
    if (message === 'Loading...') return 'جاري التحميل...';
    if (message === 'Discovering Products') return 'اكتشاف المنتجات';
    if (message === 'Loading Products') return 'تحميل المنتجات';
    if (message === 'Loading Categories') return 'تحميل الفئات';
    if (message === 'Loading Wishlist') return 'تحميل قائمة الأمنيات';
    if (message === 'Loading Cart') return 'تحميل السلة';
    if (message === 'Loading Orders') return 'تحميل الطلبات';
    if (message === 'Loading Profile') return 'تحميل الملف الشخصي';
    if (message === 'Searching...') return 'البحث...';
    if (message === 'Processing...') return 'جاري المعالجة...';
    if (message === 'Saving...') return 'جاري الحفظ...';
    if (message === 'Updating...') return 'جاري التحديث...';
    return message;
  }

  function getArabicSubtitle(): string {
    if (subtitle === 'Please wait while we prepare everything for you') return 'يرجى الانتظار بينما نحضر كل شيء لك';
    if (subtitle === 'Finding the best deals just for you...') return 'البحث عن أفضل العروض من أجلك...';
    if (subtitle === 'Organizing your shopping experience...') return 'تنظيم تجربة التسوق الخاصة بك...';
    if (subtitle === 'Gathering your favorite items...') return 'جمع العناصر المفضلة لديك...';
    if (subtitle === 'Preparing your selected items...') return 'إعداد العناصر المحددة...';
    if (subtitle === 'Fetching your order history...') return 'جلب تاريخ الطلبات...';
    if (subtitle === 'Getting your information...') return 'الحصول على معلوماتك...';
    if (subtitle === 'Finding what you need...') return 'البحث عما تحتاجه...';
    if (subtitle === 'Processing your request...') return 'معالجة طلبك...';
    if (subtitle === 'Saving your changes...') return 'حفظ التغييرات...';
    if (subtitle === 'Updating information...') return 'تحديث المعلومات...';
    return subtitle;
  }

  useEffect(() => {
    // Sparkle rotation animation
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );

    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Header glow animation
    headerGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const headerGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(headerGlow.value, [0, 1], [0.12, 0.25]),
  }));

  return (
    <Animated.View 
      entering={FadeInUp.delay(delay)}
      className={className}
    >
      <Animated.View style={[
        {
          backgroundColor: colors.card,
          borderRadius: 24,
          padding: 32,
          alignItems: 'center',
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 20,
          elevation: 10,
        },
        pulseAnimatedStyle,
        headerGlowStyle
      ]}>
        <Animated.View style={sparkleAnimatedStyle}>
          <View style={{
            width: 60,
            height: 60,
            backgroundColor: colors.primary,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Icon as={Sparkles} size="xl" style={{ color: colors.textInverse }} />
          </View>
        </Animated.View>
        <Text style={{ 
          color: colors.text, 
          fontWeight: '600', 
          fontSize: 18, 
          marginBottom: 8,
          textAlign: 'center'
        }}>
          {displayMessage}
        </Text>
        <Text style={{ 
          color: colors.textSecondary, 
          textAlign: 'center',
          fontSize: 16
        }}>
          {displaySubtitle}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// How To use
// <AppLoader 
//     message="Discovering Products"
//     subtitle="Finding the best deals just for you..."
//   />