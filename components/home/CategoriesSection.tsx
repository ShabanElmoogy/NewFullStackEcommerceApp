import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon, RTLChevronRight } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { useRTL } from '@/hooks/useRTL';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { useCategories } from '@/hooks/useCategories';
import { getCategoryConfigs } from '@/utils/categoryUtils';

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

  // Prepare categories with icons/colors
  const displayCategories = React.useMemo(() => {
    if (!categoriesData) return [] as any[];
    const getName = (c: any) => language === 'ar' ? (c.nameAr || c.nameEn || '') : (c.nameEn || c.nameAr || '');
    return getCategoryConfigs(
      categoriesData.filter((c: any) => !c.isDeleted),
      colors,
      isDark,
      getName
    );
  }, [categoriesData, colors, isDark, language]);

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

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingHorizontal: 4, 
            paddingRight: isRTL ? 4 : 20,
            paddingLeft: isRTL ? 20 : 4
          }}
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <View style={{ flexDirection: getFlexDirection('row'), gap: 12 }}>
            {isLoading && (
              Array.from({ length: 6 }).map((_, index) => (
                <View
                  key={`skeleton-${index}`}
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
              ))
            )}

            {!isLoading && !isError && displayCategories.length === 0 && (
              <Text style={{ color: colors.textSecondary }}>
                {t('productFilter.loading.noCategories')}
              </Text>
            )}

            {!isLoading && displayCategories.map((category: any, index: number) => {
              const label = language === 'ar' ? (category.nameAr || category.nameEn || '') : (category.nameEn || category.nameAr || '');
              const IconComp = category.icon;
              return (
                <AnimatedPressable
                  key={category.id ?? index}
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
                    backgroundColor: category.lightColor || colors.backgroundSecondary, 
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <View
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 28,
                        height: 28,
                        backgroundColor: category.color,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon as={IconComp} size="sm" style={{ color: colors.textInverse }} />
                    </View>
                  </View>

                  <VStack style={{ padding: 16 }}>
                    <Text style={{
                      fontWeight: 'bold',
                      color: colors.text,
                      fontSize: 14
                    }} numberOfLines={1}>
                      {label}
                    </Text>
                  </VStack>
                </AnimatedPressable>
              );
            })}
          </View>
        </ScrollView>
      </VStack>
    </Animated.View>
  );
}
