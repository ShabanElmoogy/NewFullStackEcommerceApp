import React, { useRef, useEffect } from 'react';
import { View, FlatList, Pressable, Image, I18nManager } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { RTLChevronRight } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { useRTL } from '@/hooks/useRTL';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useCategories } from '@/hooks/useCategories';
import { useRTLFlatList } from '@/hooks/useRTLFlatList';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoriesSectionProps {
  onNavigate: (route: string) => void;
}

export default function CategoriesSection({ onNavigate }: CategoriesSectionProps) {
  const { colors, isDark } = useTheme();
  const { isRTL, getFlexDirection } = useRTL();
  const { t, i18n } = useTranslation();

  // Fetch real categories from API
  const { data: categoriesData, isLoading, isError } = useCategories();

  const language: 'en' | 'ar' = i18n.language === 'ar' ? 'ar' : 'en';

  // Prepare categories from API (no icons, use real image)
  const displayCategories = React.useMemo(() => {
    if (!categoriesData) return [] as any[];
    const filteredCategories = categoriesData.filter((c: any) => !c.isDeleted);
    return filteredCategories;
  }, [categoriesData]);

  // Use RTL FlatList hook
  const { flatListRef, getRTLProps } = useRTLFlatList(displayCategories);
  const rtlProps = getRTLProps(true); // true for horizontal

  return (
    <Animated.View
      entering={FadeInUp.delay(900)}
      style={{ paddingHorizontal: 20}}
    >
      <VStack space="md">
        <HStack className="items-center justify-between">
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text
          }}>
            {t('home.categories')}
          </Text>
          <Pressable onPress={() => onNavigate('/products')}>
            <HStack className="items-center">
              <Text style={{
                color: colors.primary,
                fontWeight: '600',
                marginRight: 4
              }}>
                {t('home.viewAll')}
              </Text>
              <RTLChevronRight size="sm" style={{ color: colors.primary }} />
            </HStack>
          </Pressable>
        </HStack>

        <View>
          {isLoading ? (
            <FlatList
              horizontal
              key={`skeleton-${isRTL}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingHorizontal: 4, 
                paddingRight: 20,
                paddingLeft: 20
              }}
              data={Array.from({ length: 6 })}
              keyExtractor={(_, index) => `skeleton-${index}`}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={({ index }) => (
                <View
                  style={{
                    width: 140,
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <View style={{ height: 90, backgroundColor: colors.backgroundSecondary }} />
                  <VStack style={{ padding: 16 }}>
                    <View style={{ height: 14, backgroundColor: colors.border, borderRadius: 7, marginBottom: 8, width: '70%' }} />
                    <View style={{ height: 12, backgroundColor: colors.border, borderRadius: 6, width: '50%' }} />
                  </VStack>
                </View>
              )}
            />
          ) : !isError && displayCategories.length === 0 ? (
            <Text style={{ color: colors.textSecondary, paddingHorizontal: 20 }}>
              {t('productFilter.loading.noCategories')}
            </Text>
          ) : (
            <FlatList
              {...rtlProps}
              ref={flatListRef}
              data={displayCategories}
              keyExtractor={(item) => item.id?.toString() || ''}
              horizontal
              contentContainerStyle={{ 
                paddingHorizontal: 4, 
                paddingRight: 20,
                paddingLeft: 20
              }}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={({ item: category, index }) => {
                const label = language === 'ar' ? (category.nameAr || category.nameEn || '') : (category.nameEn || category.nameAr || '');
                return (
                  <AnimatedPressable
                    entering={FadeInRight.delay(1000 + index * 100)}
                    onPress={() => onNavigate(`/products?categoryId=${category.id}&categoryName=${encodeURIComponent(label)}`)}
                    style={{
                      width: 140,
                      backgroundColor: colors.surface,
                      borderRadius: 20,
                      overflow: 'hidden',
                      shadowColor: colors.shadow,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.1,
                      shadowRadius: 16,
                      elevation: 6,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <View style={{ 
                      height: 90, 
                      backgroundColor: colors.backgroundSecondary
                    }}>
                      {category.image ? (
                        <Image
                          source={{ uri: category.image }}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="cover"
                        />
                      ) : null}
                    </View>

                    <VStack style={{ padding: 16 }}>
                      <Text style={{
                        fontWeight: 'bold',
                        color: colors.text,
                        fontSize: 14,
                        textAlign: isRTL ? 'right' : 'left'
                      }} numberOfLines={1}>
                        {label}
                      </Text>
                    </VStack>
                  </AnimatedPressable>
                );
              }}
              // Performance optimizations
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              windowSize={7}
              initialNumToRender={3}
            />
          )}
        </View>
      </VStack>
    </Animated.View>
  );
}
