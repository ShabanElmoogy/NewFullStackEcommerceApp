import React from 'react';
import {
  ScrollView,
  View,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import {
  ShoppingBag,
  Star,
  Heart,
  TrendingUp,
  Gift,
  Zap,
  ChevronRight,
  Search,
  Grid3X3,
  Shirt,
  Smartphone,
  Home as HomeIcon,
  Gamepad2,
  Book,
  Car,
  Sparkles,
  Crown,
} from 'lucide-react-native';
import { useProducts } from '@/hooks/useProducts';
import ProductItem from '../components/ProductListItem';
import { LanguageToggleButton } from '@/components/LanguageToggleButton';

const { width: screenWidth } = Dimensions.get('window');

// Modern categories with theme-aware colors
const categories = [
  { 
    id: 1, 
    name: 'Fashion', 
    icon: Shirt, 
    themeClass: 'bg-coral-coral-light border-coral-rose',
    iconClass: 'text-coral-rose',
    textClass: 'text-coral-rose-dark'
  },
  { 
    id: 2, 
    name: 'Electronics', 
    icon: Smartphone, 
    themeClass: 'bg-ocean-sky-tint border-ocean-cyan',
    iconClass: 'text-ocean-cyan',
    textClass: 'text-ocean-deep'
  },
  { 
    id: 3, 
    name: 'Home & Garden', 
    icon: HomeIcon, 
    themeClass: 'bg-forest-green-tint border-forest-green',
    iconClass: 'text-forest-green',
    textClass: 'text-forest-green-darkest'
  },
  { 
    id: 4, 
    name: 'Gaming', 
    icon: Gamepad2, 
    themeClass: 'bg-vibrant-ice-blue border-vibrant-blue',
    iconClass: 'text-vibrant-blue',
    textClass: 'text-vibrant-navy'
  },
  { 
    id: 5, 
    name: 'Books', 
    icon: Book, 
    themeClass: 'bg-peach-peach-tint border-peach-orange',
    iconClass: 'text-peach-orange',
    textClass: 'text-peach-brown'
  },
  { 
    id: 6, 
    name: 'Automotive', 
    icon: Car, 
    themeClass: 'bg-lavender-purple-tint border-lavender-purple',
    iconClass: 'text-lavender-purple',
    textClass: 'text-lavender-purple-darkest'
  },
];

// Modern hero banners with theme integration
const heroBanners = [
  {
    id: 1,
    title: 'Summer Sale',
    subtitle: 'Up to 70% Off',
    description: 'Get the best deals on fashion items',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    buttonText: 'Shop Now',
    themeClass: 'bg-sunset-orange',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Fresh Collection',
    description: 'Discover the latest trends',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop',
    buttonText: 'Explore',
    themeClass: 'bg-forest-green',
    icon: Sparkles,
  },
  {
    id: 3,
    title: 'Tech Deals',
    subtitle: 'Smart Savings',
    description: 'Latest gadgets at best prices',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop',
    buttonText: 'Browse',
    themeClass: 'bg-midnight-blue',
    icon: Crown,
  },
];

// Modern Hero Banner Component with theme integration
const HeroBanner = ({ banner, index }: { banner: any; index: number }) => (
  <Pressable
    onPress={() => router.push('/products')}
    className="rounded-2xl overflow-hidden shadow-lg active:scale-[0.98]"
    style={{
      width: screenWidth - 32,
      height: 200,
      marginHorizontal: 8,
    }}
  >
    <Image
      source={{ uri: banner.image }}
      className="w-full h-full absolute inset-0"
      resizeMode="cover"
    />
    
    {/* Gradient Overlay */}
    <View className="flex-1 bg-black/40 p-5 justify-end">
      {/* Icon Badge */}
      <View className="absolute top-4 left-4">
        <View className="bg-white/20 backdrop-blur-sm rounded-full p-2">
          <banner.icon color="white" size={20} />
        </View>
      </View>
      
      {/* Content */}
      <VStack className="space-y-1">
        <Text className="text-white text-2xl font-extrabold">
          {banner.title}
        </Text>
        <Text className="text-white text-base font-semibold">
          {banner.subtitle}
        </Text>
        <Text className="text-white/90 text-sm mb-3">
          {banner.description}
        </Text>
        
        {/* CTA Button */}
        <Button
          size="sm"
          className="bg-white self-start px-6 py-2 rounded-full active:scale-95"
        >
          <ButtonText className="text-content-primary font-bold text-sm">
            {banner.buttonText}
          </ButtonText>
        </Button>
      </VStack>
    </View>
  </Pressable>
);

// Modern Category Item Component
const CategoryItem = ({ category }: { category: any }) => (
  <Pressable
    onPress={() => router.push('/products')}
    className="items-center mx-2 my-2 active:scale-95"
  >
    <View className={`w-[70px] h-[70px] rounded-full items-center justify-center mb-2 border-2 shadow-soft-1 ${category.themeClass}`}>
      <category.icon className={category.iconClass} size={32} />
    </View>
    <Text className={`text-xs font-semibold text-center ${category.textClass}`}>
      {category.name}
    </Text>
  </Pressable>
);

// Modern Section Header Component
const SectionHeader = ({ title, subtitle, onSeeAll }: { title: string; subtitle?: string; onSeeAll?: () => void }) => (
  <HStack className="justify-between items-center px-4 mb-4">
    <VStack className="space-y-1">
      <Text className="text-content-primary text-xl font-extrabold">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-content-secondary text-sm">
          {subtitle}
        </Text>
      )}
    </VStack>
    {onSeeAll && (
      <Pressable 
        onPress={onSeeAll} 
        className="flex-row items-center active:opacity-70"
      >
        <Text className="text-interactive-primary text-sm font-semibold mr-1">
          See All
        </Text>
        <ChevronRight className="text-interactive-primary" size={16} />
      </Pressable>
    )}
  </HStack>
);

// Modern Quick Actions Component
const QuickActions = () => (
  <HStack className="px-4 mb-6 space-x-3">
    <Pressable
      onPress={() => router.push('/search')}
      className="flex-1 bg-surface-secondary border border-border-subtle p-4 rounded-xl flex-row items-center justify-center active:bg-surface-tertiary"
    >
      <Search className="text-content-secondary mr-2" size={20} />
      <Text className="text-content-primary text-sm font-semibold">Search</Text>
    </Pressable>
    
    <Pressable
      onPress={() => router.push('/products')}
      className="flex-1 bg-surface-secondary border border-border-subtle p-4 rounded-xl flex-row items-center justify-center active:bg-surface-tertiary"
    >
      <Grid3X3 className="text-content-secondary mr-2" size={20} />
      <Text className="text-content-primary text-sm font-semibold">Browse All</Text>
    </Pressable>
  </HStack>
);

// Modern Deals Banner Component
const DealsBanner = () => (
  <View className="mx-4 mb-6">
    <Pressable
      onPress={() => router.push('/products')}
      className="bg-gradient-to-r from-vibrant-yellow to-sunset-orange-light rounded-2xl p-5 flex-row items-center border border-sunset-orange/20 shadow-soft-2 active:scale-[0.98]"
    >
      <VStack className="flex-1 space-y-2">
        <HStack className="items-center space-x-2">
          <View className="bg-sunset-orange rounded-full p-1">
            <Zap className="text-white" size={16} />
          </View>
          <Text className="text-sunset-brown text-base font-extrabold">
            Flash Deals
          </Text>
        </HStack>
        
        <Text className="text-sunset-brown/80 text-sm">
          Limited time offers on selected items
        </Text>
        
        <Badge className="bg-sunset-orange self-start">
          <BadgeText className="text-white text-xs font-bold">
            Ends in 2h 45m
          </BadgeText>
        </Badge>
      </VStack>
      
      <View className="bg-white/20 rounded-full p-3">
        <Gift className="text-sunset-orange" size={32} />
      </View>
    </Pressable>
  </View>
);

export default function HomeScreen() {
  const { data, isLoading, error } = useProducts();
  
  // Handle case where data might be an object with products array or direct array
  const products = Array.isArray(data) ? data : (data && data.products ? data.products : []);
  const featuredProducts = products.slice(0, 6);
  const trendingProducts = products.slice(6, 12);

  return (
    <ScrollView
      className="flex-1 bg-surface-primary"
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Banner Carousel */}
      <View className="mt-4 mb-6">
        <FlatList
          data={heroBanners}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={screenWidth - 16}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 8 }}
          renderItem={({ item, index }) => <HeroBanner banner={item} index={index} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* Language Toggle Button for Testing */}
      <LanguageToggleButton />

      {/* Quick Actions */}
      <QuickActions />

      {/* Categories */}
      <SectionHeader 
        title="Shop by Category" 
        subtitle="Find what you're looking for"
        onSeeAll={() => router.push('/products')}
      />
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, marginBottom: 32 }}
        renderItem={({ item }) => <CategoryItem category={item} />}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Deals Banner */}
      <DealsBanner />

      {/* Featured Products */}
      <SectionHeader 
        title="Featured Products" 
        subtitle="Hand-picked just for you"
        onSeeAll={() => router.push('/products')}
      />
      {isLoading ? (
        <View className="h-48 justify-center items-center">
          <ActivityIndicator size="large" className="text-interactive-primary" />
        </View>
      ) : (
        <FlatList
          data={featuredProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, marginBottom: 32 }}
          renderItem={({ item }) => (
            <View style={{ width: 180, marginHorizontal: 4 }}>
              <ProductItem product={item} />
            </View>
          )}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        />
      )}

      {/* Trending Now */}
      <SectionHeader 
        title="Trending Now" 
        subtitle="What's popular today"
        onSeeAll={() => router.push('/products')}
      />
      {isLoading ? (
        <View className="h-48 justify-center items-center">
          <ActivityIndicator size="large" className="text-interactive-primary" />
        </View>
      ) : (
        <FlatList
          data={trendingProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, marginBottom: 32 }}
          renderItem={({ item }) => (
            <View style={{ width: 180, marginHorizontal: 4 }}>
              <ProductItem product={item} />
            </View>
          )}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        />
      )}

      {/* Bottom Spacer */}
      <View className="h-8" />
    </ScrollView>
  );
}