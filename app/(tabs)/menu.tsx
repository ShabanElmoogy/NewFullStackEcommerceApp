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
import StatsCards from '@/components/home/StatsCards';
import { useCompareStore } from '@/store/compareStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/store/authStore';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { useLanguageStore } from '@/store/languageStore';
import { useTheme } from '@/hooks/useTheme';
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
  tint?: 'primary' | 'success' | 'warning' | 'error' | 'info';
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
  tint,
  disabled = false
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const iconTint = tint ? (colors as any)[tint] : colors.primary;

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
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          marginBottom: 8,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
          opacity: disabled ? 0.5 : 1,
          borderWidth: 1,
          borderColor: colors.border,
        }
      ]}
      disabled={disabled}
    >
      <HStack className="items-center justify-between">
        <HStack className="items-center flex-1">
          <View style={{
            width: 48,
            height: 48,
            backgroundColor: iconTint + '20',
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16
          }}>
            <Icon as={IconComponent} size="md" style={{ color: iconTint }} />
          </View>
          
          <VStack className="flex-1">
            <Text style={{
              fontWeight: '600',
              color: colors.text,
              fontSize: 16
            }}>
              {title}
            </Text>
            {subtitle && (
              <Text style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginTop: 4
              }}>
                {subtitle}
              </Text>
            )}
          </VStack>
        </HStack>

        <HStack className="items-center" space="sm">
          {badge && badge > 0 && (
            <View style={{
              backgroundColor: colors.error,
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
              minWidth: 24,
              alignItems: 'center'
            }}>
              <Text style={{
                color: colors.textInverse,
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                {badge > 99 ? '99+' : badge.toString()}
              </Text>
            </View>
          )}
          
          {rightElement || (
            <Icon as={ChevronRight} size="sm" style={{ color: colors.textTertiary }} />
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
  const compareCount = useCompareStore((state) => state.getCompareCount());
  const wishlistCount = useWishlist((state) => state.totalItems());
  const { isRTL, toggleLanguage } = useLanguageStore();
  const { colors, isDark, toggleTheme, themePreference } = useTheme();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const getThemeSubtitle = () => {
    if (themePreference === 'system') {
      return `System (${isDark ? 'Dark' : 'Light'})`;
    }
    return isDark ? 'Switch to light' : 'Switch to dark';
  };

  const accountMenuItems = [
    {
      icon: User,
      title: 'Profile',
      subtitle: 'Manage your account',
      href: '/profile',
      tint: 'info' as const,
    },
    {
      icon: ShoppingCart,
      title: 'Shopping Cart',
      subtitle: 'Review your items',
      href: '/cart',
      badge: cartCount,
      tint: 'primary' as const,
    },
    {
      icon: Heart,
      title: 'Wishlist',
      subtitle: 'Your favorite items',
      href: '/wishlist',
      badge: wishlistCount,
      tint: 'error' as const,
    },
    {
      icon: Package,
      title: 'Orders',
      subtitle: 'Track your purchases',
      href: '/orders',
      tint: 'success' as const,
    },
  ];

  const appMenuItems = [
    {
      icon: Search,
      title: 'Search',
      subtitle: 'Find products quickly',
      href: '/search',
      tint: 'info' as const,
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Stay updated',
      href: '/notifications',
      tint: 'warning' as const,
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Manage cards & payments',
      href: '/payment-methods',
      tint: 'primary' as const,
    },
    {
      icon: MapPin,
      title: 'Addresses',
      subtitle: 'Delivery locations',
      href: '/addresses',
      tint: 'success' as const,
    },
  ];

  const settingsMenuItems = [
    {
      icon: Globe,
      title: 'Language',
      subtitle: isRTL ? 'العربية' : 'English',
      onPress: toggleLanguage,
      tint: 'info' as const,
      rightElement: (
        <View style={{
          backgroundColor: colors.primary + '20',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 4
        }}>
          <Text style={{
            color: colors.primary,
            fontWeight: '600',
            fontSize: 14
          }}>
            {isRTL ? 'AR' : 'EN'}
          </Text>
        </View>
      ),
      color: 'text-blue-600',
    },
    {
      icon: isDark ? Sun : Moon,
      title: 'Theme',
      subtitle: getThemeSubtitle(),
      onPress: toggleTheme,
      tint: 'warning' as const,
      rightElement: (
        <View style={{
          width: 48,
          height: 24,
          borderRadius: 12,
          backgroundColor: isDark ? colors.primary : colors.border,
          padding: 2,
          justifyContent: 'center'
        }}>
          <Animated.View style={{
            width: 20,
            height: 20,
            backgroundColor: colors.surface,
            borderRadius: 10,
            transform: [{ translateX: isDark ? 24 : 0 }]
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
      tint: 'primary' as const,
    },
  ];

  const supportMenuItems = [
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get assistance',
      href: '/help',
      tint: 'success' as const,
    },
    {
      icon: Headphones,
      title: 'Contact Us',
      subtitle: '24/7 customer service',
      href: '/contact',
      tint: 'primary' as const,
    },
    {
      icon: Star,
      title: 'Rate App',
      subtitle: 'Share your feedback',
      onPress: () => {
        // Handle app rating
      },
      tint: 'warning' as const,
    },
    {
      icon: Shield,
      title: 'Privacy Policy',
      subtitle: 'Your data protection',
      href: '/privacy',
      tint: 'info' as const,
    },
  ];


  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info and StatsCards in a single card */}
        <View
          style={{
            marginTop: insets.top,
            marginHorizontal: 16,
            marginBottom: 16,
            backgroundColor: colors.surface,
            borderRadius: 24,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          {isAuthenticated && user ? (
            <HStack className="items-center mb-4">
              <View style={{
                width: 64,
                height: 64,
                backgroundColor: colors.primary + '20',
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16
              }}>
                {user.avatar ? (
                  <View className="w-16 h-16 rounded-full overflow-hidden">
                    {/* Image would go here */}
                    <View style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text style={{
                        color: colors.textInverse,
                        fontWeight: 'bold',
                        fontSize: 20
                      }}>
                        {(user.name || user.username || user.email || 'U').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={{
                    color: colors.primary,
                    fontWeight: 'bold',
                    fontSize: 20
                  }}>
                    {(user.name || user.username || user.email || 'U').charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <VStack className="flex-1">
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.text
                }}>
                  {user.name || user.username || 'User'}
                </Text>
                {user.email && (
                  <Text style={{
                    color: colors.textSecondary,
                    marginTop: 4
                  }}>
                    {user.email}
                  </Text>
                )}
                <View style={{
                  backgroundColor: colors.success + '20',
                  alignSelf: 'flex-start',
                  marginTop: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 12
                }}>
                  <Text style={{
                    color: colors.success,
                    fontWeight: '600',
                    fontSize: 12
                  }}>
                    Premium Member
                  </Text>
                </View>
              </VStack>
            </HStack>
          ) : (
            <VStack className="items-center mb-4">
              <View style={{
                width: 80,
                height: 80,
                backgroundColor: colors.backgroundSecondary,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}>
                <Icon as={User} size="xl" style={{ color: colors.textTertiary }} />
              </View>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: 8
              }}>
                Welcome Guest
              </Text>
              <Link href="/login" asChild>
                <Pressable style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingHorizontal: 24,
                  paddingVertical: 12
                }}>
                  <Text style={{
                    color: colors.textInverse,
                    fontWeight: '600'
                  }}>
                    Sign In
                  </Text>
                </Pressable>
              </Link>
            </VStack>
          )}
          <StatsCards cartCount={cartCount} compareCount={compareCount} onNavigate={router.push} />
        </View>

        {/* Account Section */}
        {isAuthenticated && (
          <View className="px-5 mt-6">
            <VStack space="sm">
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: 8
              }}>
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
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 8
            }}>
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
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 8
            }}>
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
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 8
            }}>
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
              <Icon as={Smartphone} size="sm" style={{ color: colors.textTertiary }} />
              <Text style={{
                color: colors.textTertiary,
                fontSize: 14
              }}>
                Version 1.0.0
              </Text>
            </HStack>
            <Text style={{
              color: colors.textTertiary,
              fontSize: 12,
              textAlign: 'center'
            }}>
              © 2024 E-Commerce App. All rights reserved.
            </Text>
          </VStack>
        </View>
      </ScrollView>
    </View>
  );
}
