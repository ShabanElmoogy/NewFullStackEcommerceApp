import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { Badge, BadgeText } from '@/components/ui/badge';
import { 
  User,
  ShoppingCart,
  Heart,
  Package,
  Search,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  CreditCard,
  MapPin,
  Star,
  Gift,
  Headphones,
  Shield,
  Globe,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/authStore';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { useLanguageStore } from '@/store/languageStore';
import { Link, router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface MenuItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  href?: string;
  onPress?: () => void;
  badge?: number;
  rightElement?: React.ReactNode;
  color?: string;
  disabled?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: IconComponent,
  title,
  subtitle,
  href,
  onPress,
  badge,
  rightElement,
  color = 'text-gray-600',
  disabled = false
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    if (disabled) return;
    if (onPress) {
      onPress();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        {
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
          opacity: disabled ? 0.5 : 1,
        }
      ]}
      disabled={disabled}
    >
      <HStack className="items-center justify-between">
        <HStack className="items-center flex-1">
          <View className={`w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mr-4`}>
            <Icon as={IconComponent} size="md" className={color} />
          </View>
          
          <VStack className="flex-1">
            <Text className="font-semibold text-gray-900 text-base">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm text-gray-500 mt-1">
                {subtitle}
              </Text>
            )}
          </VStack>
        </HStack>

        <HStack className="items-center" space="sm">
          {badge && badge > 0 && (
            <View className="bg-red-500 rounded-full px-2 py-1 min-w-6 items-center">
              <Text className="text-white text-xs font-bold">
                {badge > 99 ? '99+' : badge.toString()}
              </Text>
            </View>
          )}
          
          {rightElement || (
            <Icon as={ChevronRight} size="sm" className="text-gray-400" />
          )}
        </HStack>
      </HStack>
    </AnimatedPressable>
  );
};

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = useCart((state) => state.totalQuantity());
  const wishlistCount = useWishlist((state) => state.totalItems());
  const { isRTL, toggleLanguage } = useLanguageStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement actual dark mode toggle
  };

  const accountMenuItems = [
    {
      icon: User,
      title: 'Profile',
      subtitle: 'Manage your account',
      href: '/profile',
      color: 'text-blue-600',
    },
    {
      icon: ShoppingCart,
      title: 'Shopping Cart',
      subtitle: 'Review your items',
      href: '/cart',
      badge: cartCount,
      color: 'text-green-600',
    },
    {
      icon: Heart,
      title: 'Wishlist',
      subtitle: 'Your favorite items',
      href: '/wishlist',
      badge: wishlistCount,
      color: 'text-red-600',
    },
    {
      icon: Package,
      title: 'Orders',
      subtitle: 'Track your purchases',
      href: '/orders',
      color: 'text-purple-600',
    },
  ];

  const appMenuItems = [
    {
      icon: Search,
      title: 'Search',
      subtitle: 'Find products quickly',
      href: '/search',
      color: 'text-orange-600',
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Stay updated',
      href: '/notifications',
      color: 'text-yellow-600',
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Manage cards & payments',
      href: '/payment-methods',
      color: 'text-indigo-600',
    },
    {
      icon: MapPin,
      title: 'Addresses',
      subtitle: 'Delivery locations',
      href: '/addresses',
      color: 'text-teal-600',
    },
  ];

  const settingsMenuItems = [
    {
      icon: Globe,
      title: 'Language',
      subtitle: isRTL ? 'العربية' : 'English',
      onPress: toggleLanguage,
      rightElement: (
        <View className="bg-blue-100 rounded-lg px-3 py-1">
          <Text className="text-blue-600 font-semibold text-sm">
            {isRTL ? 'AR' : 'EN'}
          </Text>
        </View>
      ),
      color: 'text-blue-600',
    },
    {
      icon: isDarkMode ? Sun : Moon,
      title: 'Dark Mode',
      subtitle: isDarkMode ? 'Switch to light' : 'Switch to dark',
      onPress: toggleDarkMode,
      rightElement: (
        <View style={{
          width: 48,
          height: 24,
          borderRadius: 12,
          backgroundColor: isDarkMode ? '#3B82F6' : '#D1D5DB',
          padding: 2,
          justifyContent: 'center'
        }}>
          <View style={{
            width: 20,
            height: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            transform: [{ translateX: isDarkMode ? 24 : 0 }]
          }} />
        </View>
      ),
      color: 'text-gray-600',
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences',
      href: '/settings',
      color: 'text-gray-600',
    },
  ];

  const supportMenuItems = [
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get assistance',
      href: '/help',
      color: 'text-green-600',
    },
    {
      icon: Headphones,
      title: 'Contact Us',
      subtitle: '24/7 customer service',
      href: '/contact',
      color: 'text-blue-600',
    },
    {
      icon: Star,
      title: 'Rate App',
      subtitle: 'Share your feedback',
      onPress: () => {
        // Handle app rating
      },
      color: 'text-yellow-600',
    },
    {
      icon: Shield,
      title: 'Privacy Policy',
      subtitle: 'Your data protection',
      href: '/privacy',
      color: 'text-purple-600',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: 'white',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {isAuthenticated && user ? (
            <HStack className="items-center">
              <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mr-4">
                {user.avatar ? (
                  <View className="w-16 h-16 rounded-full overflow-hidden">
                    {/* Image would go here */}
                    <View className="w-full h-full bg-blue-500 items-center justify-center">
                      <Text className="text-white font-bold text-xl">
                        {(user.name || user.username || user.email || 'U').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text className="text-blue-600 font-bold text-xl">
                    {(user.name || user.username || user.email || 'U').charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              
              <VStack className="flex-1">
                <Text className="text-xl font-bold text-gray-900">
                  {user.name || user.username || 'User'}
                </Text>
                {user.email && (
                  <Text className="text-gray-500 mt-1">
                    {user.email}
                  </Text>
                )}
                <Badge className="bg-green-100 self-start mt-2">
                  <BadgeText className="text-green-600 font-semibold">Premium Member</BadgeText>
                </Badge>
              </VStack>
            </HStack>
          ) : (
            <VStack className="items-center">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Icon as={User} size="xl" className="text-gray-400" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Welcome Guest
              </Text>
              <Link href="/login" asChild>
                <Button className="bg-blue-500 rounded-xl">
                  <ButtonText className="text-white font-semibold">
                    Sign In
                  </ButtonText>
                </Button>
              </Link>
            </VStack>
          )}
        </View>

        {/* Account Section */}
        {isAuthenticated && (
          <View className="px-5 mt-6">
            <VStack space="sm">
              <Text className="text-lg font-bold text-gray-900 mb-2">
                Account
              </Text>
              {accountMenuItems.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </VStack>
          </View>
        )}

        {/* App Features */}
        <View className="px-5 mt-6">
          <VStack space="sm">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              App Features
            </Text>
            {appMenuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </VStack>
        </View>

        {/* Settings */}
        <View className="px-5 mt-6">
          <VStack space="sm">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              Settings
            </Text>
            {settingsMenuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </VStack>
        </View>

        {/* Support */}
        <View className="px-5 mt-6">
          <VStack space="sm">
            <Text className="text-lg font-bold text-gray-900 mb-2">
              Support
            </Text>
            {supportMenuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </VStack>
        </View>

        {/* Logout */}
        {isAuthenticated && (
          <View className="px-5 mt-6">
            <MenuItem
              icon={LogOut}
              title="Sign Out"
              subtitle="Logout from your account"
              onPress={handleLogout}
              color="text-red-600"
            />
          </View>
        )}

        {/* App Info */}
        <View className="px-5 mt-8 mb-4">
          <VStack className="items-center" space="sm">
            <HStack className="items-center" space="sm">
              <Icon as={Smartphone} size="sm" className="text-gray-400" />
              <Text className="text-gray-500 text-sm">
                Version 1.0.0
              </Text>
            </HStack>
            <Text className="text-gray-400 text-xs text-center">
              © 2024 E-Commerce App. All rights reserved.
            </Text>
          </VStack>
        </View>
      </ScrollView>
    </View>
  );
}