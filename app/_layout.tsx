import '@/global.css';
import { router, usePathname } from 'expo-router';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Menu,
  ShoppingCart,
  Heart,
  Home,
  Store,
  Search,
  User,
  LogOut,
  ChevronRight,
  Package,
} from 'lucide-react-native';
import { Pressable, View, Image, ScrollView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../store/authStore';
import { useWishlist } from '@/store/wishlistStore';
import { useCart } from '@/store/cartStore';

const queryClient = new QueryClient();

// -------------------
// Custom Drawer Content
// -------------------
function CustomDrawerContent(props: any) {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const wishlistCount = useWishlist((state) => state.totalItems());
  const cartCount = useCart((state) => state.totalQuantity());

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
    { label: 'Search', icon: Search, route: '/search' },
    { label: 'Orders', icon: Package, route: '/orders' },
    { label: 'Wishlist', icon: Heart, route: '/wishlist' },
    { label: 'Cart', icon: ShoppingCart, route: '/cart' },
    { label: 'Profile', icon: User, route: '/profile' },
  ];

  const renderMenuItem = (item: any, index: number) => {
    const isActive = pathname === item.route;
    const count = item.route === '/cart' ? cartCount : item.route === '/wishlist' ? wishlistCount : 0;

    return (
      <Pressable
        key={index}
        onPress={() => handleNavigation(item.route)}
        className={`mx-4 mb-2 rounded-xl overflow-hidden border ${isActive
            ? 'bg-primary-600 border-primary-600'
            : 'bg-background-0 border-outline-200'
          }`}
      >
        <View className="flex-row items-center justify-between px-3 py-3">
          <HStack className="items-center">
            <item.icon
              className={isActive ? 'text-white' : 'text-typography-900'}
              size={22}
              style={{ marginRight: 12 }}
            />
            <Text className={`font-bold text-base ${isActive ? 'text-white' : 'text-typography-900'
              }`}>
              {item.label}
            </Text>
          </HStack>

          <HStack className="items-center">
            {count > 0 && (
              <View className={`px-2 py-1 rounded-full mr-2 min-w-7 items-center ${isActive ? 'bg-primary-700' : 'bg-primary-600'
                }`}>
                <Text className="text-white text-xs font-extrabold">{count}</Text>
              </View>
            )}
            <ChevronRight
              className={isActive ? 'text-typography-300' : 'text-typography-400'}
              size={18}
            />
          </HStack>
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
            <Text className="text-sm text-typography-400 mt-1">
              {user.email}
            </Text>
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
            <HStack className="items-center p-3">
              <LogOut className="text-error-600 mr-3" size={22} />
              <Text className="font-bold text-base text-error-600">Sign Out</Text>
            </HStack>
          </Pressable>
        ) : (
          <Pressable onPress={handleLogin} className="bg-background-success rounded-xl">
            <HStack className="items-center p-3">
              <User className="text-success-600 mr-3" size={22} />
              <Text className="font-bold text-base text-success-600">Sign In</Text>
            </HStack>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// -------------------
// Header Right Component
// -------------------
function DrawerHeaderRight() {
  const wishlistCount = useWishlist((state) => state.totalItems());
  const cartCount = useCart((state) => state.totalQuantity());

  return (
    <HStack className="mr-4 flex-row">
      {/* Wishlist */}
      <Pressable onPress={() => router.push('/wishlist')} className="p-2">
        <View>
          <Heart className="text-typography-700" size={24} />
          {wishlistCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-error-500 rounded-lg px-1 min-w-4 items-center">
              <Text className="text-white text-xs font-bold">
                {wishlistCount}
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      {/* Cart */}
      <Pressable onPress={() => router.push('/cart')} className="p-2">
        <View>
          <ShoppingCart className="text-typography-700" size={24} />
          {cartCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-error-500 rounded-lg px-1 min-w-4 items-center">
              <Text className="text-white text-xs font-bold">
                {cartCount}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </HStack>
  );
}


// -------------------
// Root Layout
// -------------------
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1 bg-background-0" edges={['right', 'bottom']}>
        <GluestackUIProvider mode="light">
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
              drawerContent={(props) => <CustomDrawerContent {...props} />}
              screenOptions={({ navigation }) => ({
                headerLeft: () => (
                  <Pressable onPress={() => navigation.openDrawer()} className="ml-4 p-2" android_ripple={{ color: 'rgba(0,0,0,0.1)' }}>
                    <Menu className="text-content-primary" size={24} />
                  </Pressable>
                ),
                headerRight: () => <DrawerHeaderRight />,
                headerTitleAlign: 'center',
                headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
                drawerStyle: {
                  width: Platform.OS === 'web' ? 320 : '85%',
                  maxWidth: 360,
                  backgroundColor: 'rgb(var(--color-background-50))'
                },
                drawerType: Platform.OS === 'web' ? 'slide' : 'front',
                overlayColor: Platform.OS === 'web' ? 'transparent' : 'rgba(0,0,0,0.5)',
                swipeEdgeWidth: Platform.OS === 'web' ? 0 : undefined,
                keyboardDismissMode: 'on-drag',
                sceneContainerStyle: { backgroundColor: 'rgb(var(--color-background-0))' },
              })}
            >
              <Drawer.Screen name="index" options={{ title: 'Home' }} />
              <Drawer.Screen name="products" options={{ title: 'Products' }} />
              <Drawer.Screen name="orders" options={{ title: 'Orders' }} />
              <Drawer.Screen name="cart" options={{ title: 'Cart' }} />
              <Drawer.Screen name="wishlist" options={{ title: 'Wishlist' }} />
            </Drawer>
          </GestureHandlerRootView>
        </GluestackUIProvider>
      </SafeAreaView>
    </QueryClientProvider>
  );
}
