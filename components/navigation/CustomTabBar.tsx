import React from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { 
  Home, 
  Store, 
  Scale, 
  Menu,
  ShoppingCart,
  Heart
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useLanguageStore } from '@/store/languageStore';
import { useTheme } from '@/hooks/useTheme';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withTiming,
  interpolate
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

interface TabItemProps {
  route: any;
  index: number;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  isRTL: boolean;
}

const TabItem: React.FC<TabItemProps> = ({
  route,
  index,
  isFocused,
  onPress,
  onLongPress,
  cartCount,
  wishlistCount,
  compareCount,
  isRTL
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const iconScale = useSharedValue(1);

  const getTabIcon = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return Home;
      case 'products':
        return Store;
      case 'compare':
        return Scale;
      case 'menu':
        return Menu;
      default:
        return Home;
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Home';
      case 'products':
        return 'Products';
      case 'compare':
        return 'Compare';
      case 'menu':
        return 'Menu';
      default:
        return routeName;
    }
  };

  const getBadgeCount = (routeName: string) => {
    switch (routeName) {
      case 'compare':
        return compareCount;
      default:
        return 0;
    }
  };

  const IconComponent = getTabIcon(route.name);
  const label = getTabLabel(route.name);
  const badgeCount = getBadgeCount(route.name);

  React.useEffect(() => {
    if (isFocused) {
      scale.value = withSpring(1.1, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(-2, { damping: 15, stiffness: 150 });
      iconScale.value = withSpring(1.2, { damping: 15, stiffness: 150 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      iconScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }
  }, [isFocused]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [1, 1.1], [0, 1]);
    return {
      opacity,
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(isFocused ? 1.1 : 1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedContainerStyle, { flex: 1, alignItems: 'center', paddingVertical: 8 }]}
    >
      {/* Active background indicator */}
      <Animated.View
        style={[
          animatedBackgroundStyle,
          {
            position: 'absolute',
            top: 4,
            left: 8,
            right: 8,
            bottom: 4,
            backgroundColor: colors.primary + '20', // 20% opacity
            borderRadius: 16,
          }
        ]}
      />

      {/* Icon container with badge */}
      <View style={{ position: 'relative', marginBottom: 4 }}>
        <Animated.View style={animatedIconStyle}>
          <Icon
            as={IconComponent}
            size="md"
            style={{ color: isFocused ? colors.tabActive : colors.tabInactive }}
          />
        </Animated.View>
        
        {/* Badge */}
        {badgeCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -6,
              right: -8,
              backgroundColor: colors.error,
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
              borderWidth: 2,
              borderColor: colors.tabBackground,
            }}
          >
            <Text
              style={{
                color: colors.textInverse,
                fontSize: 11,
                fontWeight: 'bold',
                lineHeight: 16,
              }}
            >
              {badgeCount > 99 ? '99+' : badgeCount.toString()}
            </Text>
          </View>
        )}
      </View>

      {/* Label */}
      <Text
        style={{
          fontSize: 11,
          fontWeight: isFocused ? '600' : '500',
          color: isFocused ? colors.tabActive : colors.tabInactive,
          textAlign: 'center',
        }}
        numberOfLines={1}
      >
        {label}
      </Text>

      {/* Active indicator dot */}
      {isFocused && (
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            width: 4,
            height: 4,
            backgroundColor: colors.tabActive,
            borderRadius: 2,
          }}
        />
      )}
    </AnimatedPressable>
  );
};

export const CustomTabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const cartCount = useCart((state) => state.totalQuantity());
  const wishlistCount = useWishlist((state) => state.totalItems());
  const compareCount = useCompareStore((state) => state.getCompareCount());
  const { isRTL } = useLanguageStore();
  const { colors, isDark } = useTheme();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Background */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.tabBackground + (isDark ? 'F0' : 'F5'), // 95% opacity
          backdropFilter: 'blur(20px)',
        }}
      />

      {/* Top border */}
      <View
        style={{
          height: 1,
          backgroundColor: colors.border,
        }}
      />

      {/* Tab items container */}
      <HStack
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 4,
          alignItems: 'center',
          justifyContent: 'space-around',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabItem
              key={route.key}
              route={route}
              index={index}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              compareCount={compareCount}
              isRTL={isRTL}
            />
          );
        })}
      </HStack>

          </View>
  );
};
