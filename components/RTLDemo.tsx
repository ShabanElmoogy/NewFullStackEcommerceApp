import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { 
  ArrowRight, 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingCart, 
  User,
  Globe,
  CheckCircle
} from 'lucide-react-native';
import { useLanguageStore } from '@/store/languageStore';
import { useRTL } from '@/hooks/useRTL';
import i18n from '@/utils/i18n';

export const RTLDemo: React.FC = () => {
  const { language, toggleLanguage } = useLanguageStore();
  const { isRTL, getTextAlign, getFlexDirection, getSpacing } = useRTL();

  const demoItems = [
    {
      id: 1,
      title: isRTL ? 'منتج رائع' : 'Amazing Product',
      price: '$99.99',
      rating: 4.5,
      description: isRTL 
        ? 'هذا منتج رائع مع ميزات مذهلة وجودة عالية'
        : 'This is an amazing product with great features and high quality',
    },
    {
      id: 2,
      title: isRTL ? 'منتج آخر' : 'Another Product',
      price: '$149.99',
      rating: 4.8,
      description: isRTL 
        ? 'منتج آخر بمواصفات ممتازة وتصميم أنيق'
        : 'Another product with excellent specifications and elegant design',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background-0 p-4">
      <VStack className="space-y-4">
        {/* Header */}
        <View className="bg-primary-600 rounded-xl p-4">
          <View style={{ flexDirection: getFlexDirection('row') }} className="items-center justify-between">
            <View>
              <Text 
                className="text-white text-xl font-bold"
                style={{ textAlign: getTextAlign('left') }}
              >
                {isRTL ? 'عرض RTL' : 'RTL Demo'}
              </Text>
              <Text 
                className="text-primary-100 text-sm mt-1"
                style={{ textAlign: getTextAlign('left') }}
              >
                {isRTL ? 'اختبار الاتجاه من اليمين إلى اليسار' : 'Testing Right-to-Left Layout'}
              </Text>
            </View>
            <Pressable
              onPress={toggleLanguage}
              className="bg-white/20 rounded-lg p-2"
            >
              <Icon as={Globe} size="md" className="text-white" />
            </Pressable>
          </View>
        </View>

        {/* Language Toggle Button */}
        <Pressable
          onPress={toggleLanguage}
          className="bg-secondary-50 border border-secondary-200 rounded-lg p-4"
        >
          <View style={{ flexDirection: getFlexDirection('row') }} className="items-center">
            <Icon 
              as={Globe} 
              size="sm" 
              className={`text-secondary-600 ${isRTL ? 'ms-3' : 'me-3'}`} 
            />
            <View className="flex-1">
              <Text 
                className="font-semibold text-secondary-700"
                style={{ textAlign: getTextAlign('left') }}
              >
                {isRTL ? 'تغيير اللغة' : 'Change Language'}
              </Text>
              <Text 
                className="text-sm text-secondary-600 mt-1"
                style={{ textAlign: getTextAlign('left') }}
              >
                {language === 'en' ? 'Switch to العربية' : 'Switch to English'}
              </Text>
            </View>
            <Icon 
              as={isRTL ? ArrowLeft : ArrowRight} 
              size="sm" 
              className="text-secondary-400" 
            />
          </View>
        </Pressable>

        {/* Product Cards */}
        <Text 
          className="text-lg font-bold text-typography-900 mb-2"
          style={{ textAlign: getTextAlign('left') }}
        >
          {isRTL ? 'المنتجات' : 'Products'}
        </Text>

        {demoItems.map((item) => (
          <View key={item.id} className="bg-white border border-outline-200 rounded-xl p-4 shadow-sm">
            <View style={{ flexDirection: getFlexDirection('row') }} className="items-start">
              {/* Product Image Placeholder */}
              <View className={`w-16 h-16 bg-primary-100 rounded-lg ${isRTL ? 'ms-3' : 'me-3'}`} />
              
              {/* Product Info */}
              <View className="flex-1">
                <Text 
                  className="font-semibold text-typography-900 text-base"
                  style={{ textAlign: getTextAlign('left') }}
                >
                  {item.title}
                </Text>
                
                <Text 
                  className="text-typography-600 text-sm mt-1"
                  style={{ textAlign: getTextAlign('left') }}
                >
                  {item.description}
                </Text>

                {/* Rating and Price Row */}
                <View 
                  style={{ flexDirection: getFlexDirection('row') }} 
                  className="items-center justify-between mt-3"
                >
                  <View style={{ flexDirection: getFlexDirection('row') }} className="items-center">
                    <Icon as={Star} size="xs" className="text-warning-500" />
                    <Text className={`text-sm text-typography-700 ${isRTL ? 'me-1' : 'ms-1'}`}>
                      {item.rating}
                    </Text>
                  </View>
                  
                  <Text className="font-bold text-primary-600 text-lg">
                    {item.price}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View 
                  style={{ flexDirection: getFlexDirection('row') }} 
                  className="items-center mt-3 space-x-2"
                >
                  <Pressable className="bg-primary-600 rounded-lg px-4 py-2 flex-1">
                    <View style={{ flexDirection: getFlexDirection('row') }} className="items-center justify-center">
                      <Icon 
                        as={ShoppingCart} 
                        size="xs" 
                        className={`text-white ${isRTL ? 'ms-2' : 'me-2'}`} 
                      />
                      <Text className="text-white font-semibold">
                        {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                      </Text>
                    </View>
                  </Pressable>
                  
                  <Pressable className="bg-error-50 border border-error-200 rounded-lg p-2">
                    <Icon as={Heart} size="sm" className="text-error-600" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* RTL Status Card */}
        <View className="bg-success-50 border border-success-200 rounded-xl p-4">
          <View style={{ flexDirection: getFlexDirection('row') }} className="items-center">
            <Icon 
              as={CheckCircle} 
              size="sm" 
              className={`text-success-600 ${isRTL ? 'ms-3' : 'me-3'}`} 
            />
            <View className="flex-1">
              <Text 
                className="font-semibold text-success-700"
                style={{ textAlign: getTextAlign('left') }}
              >
                {isRTL ? 'حالة RTL' : 'RTL Status'}
              </Text>
              <Text 
                className="text-sm text-success-600 mt-1"
                style={{ textAlign: getTextAlign('left') }}
              >
                {isRTL 
                  ? `الاتجاه: من اليمين إلى اليسار - اللغة: ${language.toUpperCase()}`
                  : `Direction: Left to Right - Language: ${language.toUpperCase()}`
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Navigation Example */}
        <View className="bg-background-50 rounded-xl p-4">
          <Text 
            className="font-semibold text-typography-900 mb-3"
            style={{ textAlign: getTextAlign('left') }}
          >
            {isRTL ? 'مثال على التنقل' : 'Navigation Example'}
          </Text>
          
          <View className="space-y-2">
            {[
              { icon: User, label: isRTL ? 'الملف الشخصي' : 'Profile' },
              { icon: ShoppingCart, label: isRTL ? 'السلة' : 'Cart' },
              { icon: Heart, label: isRTL ? 'المفضلة' : 'Wishlist' },
            ].map((navItem, index) => (
              <Pressable 
                key={index}
                className="bg-white border border-outline-200 rounded-lg p-3"
              >
                <View style={{ flexDirection: getFlexDirection('row') }} className="items-center justify-between">
                  <View style={{ flexDirection: getFlexDirection('row') }} className="items-center">
                    <Icon 
                      as={navItem.icon} 
                      size="sm" 
                      className={`text-typography-600 ${isRTL ? 'ms-3' : 'me-3'}`} 
                    />
                    <Text 
                      className="text-typography-900 font-medium"
                      style={{ textAlign: getTextAlign('left') }}
                    >
                      {navItem.label}
                    </Text>
                  </View>
                  <Icon 
                    as={isRTL ? ArrowLeft : ArrowRight} 
                    size="sm" 
                    className="text-typography-400" 
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </VStack>
    </ScrollView>
  );
};