import React from 'react';
import { View, Image, ScrollView, Pressable } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Text } from '@/components/ui/text';
import {
  Home,
  Store,
  Search,
  Package,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  ChevronRight,
  Scale,
} from 'lucide-react-native';
import { useAuth } from '@/store/authStore';
import { useWishlist } from '@/store/wishlistStore';
import { useCart } from '@/store/cartStore';
import { useCompareStore } from '@/store/compareStore';
import { useLanguageStore } from '@/store/languageStore';

interface CustomDrawerContentProps {
  navigation: any;
}

export function CustomDrawerContent(props: CustomDrawerContentProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const wishlistCount = useWishlist((state) => state.totalItems());
  const cartCount = useCart((state) => state.totalQuantity());
  const compareCount = useCompareStore((state) => state.getCompareCount());

  const handleNavigation = (route: string) => {
    props.navigation.closeDrawer();
    router.push(route);
  };

  const handleLogout = () => {
    logout();
    props.navigation.closeDrawer();
    router.replace('/login');
  };

  const handleLogin = () => {
    props.navigation.closeDrawer();
    router.push('/login');
  };

  const menuItems = [
    { label: 'Home', icon: Home, route: '/' },
    { label: 'Products', icon: Store, route: '/products' },
    { label: 'Compare', icon: Scale, route: '/compare' },
    { label: 'Search', icon: Search, route: '/search' },
    { label: 'Orders', icon: Package, route: '/orders' },
    { label: 'Wishlist', icon: Heart, route: '/wishlist' },
    { label: 'Cart', icon: ShoppingCart, route: '/cart' },
    { label: 'Profile', icon: User, route: '/profile' },
  ];

  const renderMenuItem = (item: any, index: number) => {
    const isActive = pathname === item.route;
    const count =
      item.route === '/cart' ? cartCount : 
      item.route === '/wishlist' ? wishlistCount : 
      item.route === '/compare' ? compareCount : 0;
    const { isRTL } = useLanguageStore();

    return (
      <Pressable
        key={index}
        onPress={() => handleNavigation(item.route)}
        className={`mx-4 mb-2 rounded-xl overflow-hidden border ${
          isActive ? 'bg-primary-600 border-primary-600' : 'bg-background-0 border-outline-200'
        }`}
      >
        <View className="flex-row items-center justify-between px-3 py-3">
          <View className="flex-row items-center">
            <item.icon
              className={isActive ? 'text-white' : 'text-typography-900'}
              size={22}
            />
            <Text
              className={`font-bold text-base ms-3 ${
                isActive ? 'text-white' : 'text-typography-900'
              }`}
            >
              {item.label}
            </Text>
          </View>

          <View className="flex-row items-center">
            {count > 0 && (
              <View
                className={`px-2 py-1 rounded-full me-2 min-w-7 items-center ${
                  isActive ? 'bg-primary-700' : 'bg-primary-600'
                }`}
              >
                <Text className="text-white text-xs font-extrabold">{count}</Text>
              </View>
            )}
            <ChevronRight
              className={isActive ? 'text-typography-300' : 'text-typography-400'}
              size={18}
              style={{
                transform: [{ scaleX: isRTL ? -1 : 1 }]
              }}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-background-0">
      {/* User Profile Section */}
      {isAuthenticated && user && (
        <View className="items-center py-7 bg-primary-700">
          <Image
            source={{ uri: user?.avatar ?? 'https://via.placeholder.com/90' }}
            className="w-20 h-20 rounded-full border-3 border-tertiary-500 mb-3 mt-2"
          />
          <Text className="text-lg font-extrabold text-white">
            {user?.name || user?.username || user?.email || 'User'}
          </Text>
          {user?.email && (
            <Text className="text-sm text-typography-400 mt-1">{user.email}</Text>
          )}
          <View className="w-5/6 h-px bg-primary-600 mt-4" />
        </View>
      )}

      {/* Scrollable Menu Items */}
      <ScrollView
        className="flex-1 bg-background-50"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 100 }}
      >
        <View className="px-4 mb-2">
          <Text className="text-xs text-typography-500 font-bold tracking-wider">
            BROWSE
          </Text>
        </View>
        {menuItems.map(renderMenuItem)}
      </ScrollView>

      {/* Footer */}
      <View className="bg-background-50 border-t border-outline-200 p-4">
        {isAuthenticated ? (
          <Pressable onPress={handleLogout} className="bg-background-error rounded-xl">
            <View className="flex-row items-center p-3 gap-3">
              <LogOut className="text-error-600 me-3" size={22} />
              <Text className="font-bold text-base text-error-600">Sign Out</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={handleLogin} className="bg-background-success rounded-xl">
            <View className="flex-row items-center p-3 gap-3">
              <User className="text-success-600 me-3" size={22} />
              <Text className="font-bold text-base text-success-600">Sign In</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}