import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import React, { useState } from "react";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";
import { useCart } from "@/store/cartStore";
import { useToast } from "./ui/toast";
import { CustomToast } from "./CustomToast";
import { useLanguageStore } from "@/store/languageStore";
import { useTheme } from "@/hooks/useTheme";
import {
  ShoppingCart,
  Star,
  Eye,
  TrendingUp,
  Zap
} from "lucide-react-native";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
    discount?: number;
    isNew?: boolean;
    isTrending?: boolean;
    stock?: number;
  };
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { name, price, image, description, rating = 4.5, reviewCount = 0, discount, isNew, isTrending, stock = 10 } = product;
  const addToCart = useCart((state) => state.addProduct);
  const toast = useToast();
  const { isRTL } = useLanguageStore();
  const { colors } = useTheme();
  const [ratio, setRatio] = useState(1);
  const discountedPrice = discount ? price * (1 - discount / 100) : price;
  const isLowStock = stock < 5;
  const isOutOfStock = stock === 0;

  const handleAddToCart = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addToCart(product);
    toast.show({
      placement: "bottom",
      duration: 2000,
      render: ({ id }) => (
        <CustomToast id={id} message={`${name} added to cart!`} />
      ),
    });
  };

  // Render list view (horizontal layout)
  if (viewMode === 'list') {
    return (
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
        marginBottom: 6,
      }}>
        <Link href={`/product/${product.id}`} asChild>
          <Pressable style={{ opacity: 1 }}>
            <View style={{ padding: 16, flexDirection: 'row', gap: 16 }}>
              {/* Product Image Container */}
              <View style={{
                position: 'relative',
                backgroundColor: colors.backgroundSecondary,
                borderRadius: 8,
                overflow: 'hidden',
                width: 80,
                height: 80,
                flexShrink: 0
              }}>
                <Image
                  source={{ uri: image || 'https://via.placeholder.com/300x300?text=No+Image' }}
                  style={{ width: '100%', height: '100%' }}
                  alt={`${name} image`}
                  resizeMode="contain"
                />

                {/* Stock Status Overlay */}
                {isOutOfStock && (
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: colors.shadow + '99', // 60% opacity
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      color: colors.textInverse,
                      fontWeight: '600',
                      fontSize: 12
                    }}>
                      Out
                    </Text>
                  </View>
                )}
              </View>

              {/* Product Info */}
              <View style={{ flex: 1, gap: 8 }}>
                {/* Product Name and Badges */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, gap: 8 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: colors.text,
                        lineHeight: 20
                      }}
                      numberOfLines={2}
                    >
                      {name}
                    </Text>

                    {/* Badges */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                      {isNew && (
                        <View style={{
                          backgroundColor: colors.success,
                          borderRadius: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 2
                        }}>
                          <Text style={{
                            color: colors.textInverse,
                            fontSize: 12,
                            fontWeight: '600'
                          }}>
                            NEW
                          </Text>
                        </View>
                      )}
                      {isTrending && (
                        <View style={{
                          backgroundColor: colors.warning,
                          borderRadius: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 2
                        }}>
                          <Text style={{
                            color: colors.textInverse,
                            fontSize: 12,
                            fontWeight: '600'
                          }}>
                            HOT
                          </Text>
                        </View>
                      )}
                      {discount && (
                        <View style={{
                          backgroundColor: colors.error,
                          borderRadius: 8,
                          paddingHorizontal: 8,
                          paddingVertical: 2
                        }}>
                          <Text style={{
                            color: colors.textInverse,
                            fontSize: 12,
                            fontWeight: '600'
                          }}>
                            -{discount}%
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Actions: Wishlist + Compare */}
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <WishlistButton
                      product={product}
                      size="sm"
                      variant="filled"
                    />
                    <CompareButton
                      product={product}
                      size="sm"
                      variant="icon"
                    />
                  </View>
                </View>

                {/* Rating */}
                {rating > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          as={Star}
                          size="xs"
                          style={{
                            color: star <= Math.floor(rating) ? colors.warning : colors.textTertiary
                          }}
                        />
                      ))}
                    </View>
                    <Text style={{
                      fontSize: 12,
                      color: colors.textSecondary
                    }}>
                      ({reviewCount})
                    </Text>
                  </View>
                )}

                {/* Description */}
                {description && (
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      lineHeight: 18
                    }}
                    numberOfLines={2}
                  >
                    {description}
                  </Text>
                )}

                {/* Price and Actions */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <View style={{ gap: 4 }}>
                    {discount ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: colors.primary
                        }}>
                          ${discountedPrice.toFixed(2)}
                        </Text>
                        <Text style={{
                          fontSize: 14,
                          color: colors.textTertiary,
                          textDecorationLine: 'line-through'
                        }}>
                          ${price.toFixed(2)}
                        </Text>
                      </View>
                    ) : (
                      <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: colors.primary
                      }}>
                        ${price.toFixed(2)}
                      </Text>
                    )}

                    {/* Low Stock Warning */}
                    {isLowStock && !isOutOfStock && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Icon as={Zap} size="xs" style={{ color: colors.warning }} />
                        <Text style={{
                          fontSize: 12,
                          color: colors.warning,
                          fontWeight: '500'
                        }}>
                          Only {stock} left
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Add to Cart Button */}
                  <Pressable
                    onPress={handleAddToCart}
                    disabled={isOutOfStock}
                    style={{
                      backgroundColor: isOutOfStock ? colors.backgroundSecondary : colors.primary,
                      borderRadius: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      opacity: isOutOfStock ? 0.6 : 1
                    }}
                  >
                    <Icon
                      as={ShoppingCart}
                      size="xs"
                      style={{
                        color: isOutOfStock ? colors.textTertiary : colors.text,
                        marginRight: isRTL ? 0 : 4,
                        marginLeft: isRTL ? 4 : 0
                      }}
                    />
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: isOutOfStock ? colors.textTertiary : colors.text
                    }}>
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Pressable>
        </Link>
      </View>
    );
  }

  // Render grid view (vertical layout) - default
  return (
    <View className="flex-1">
      <Card className="flex-1 relative overflow-hidden bg-background-0 border border-outline-100 shadow-sm">
        {/* Product Badges */}
        <View
          className="absolute top-2 z-20 flex-row gap-1"
          style={{
            left: isRTL ? undefined : 8,
            right: isRTL ? 8 : undefined
          }}
        >
          {isNew && (
            <Badge className="bg-success-500">
              <BadgeText className="text-white text-xs font-semibold">NEW</BadgeText>
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-warning-500">
              <Icon as={TrendingUp} size="xs" className={`text-white ${isRTL ? 'ml-1' : 'mr-1'}`} />
              <BadgeText className="text-white text-xs font-semibold">HOT</BadgeText>
            </Badge>
          )}
          {discount && (
            <Badge className="bg-error-500">
              <BadgeText className="text-white text-xs font-semibold">-{discount}%</BadgeText>
            </Badge>
          )}
        </View>

        {/* Wishlist Button */}
        <View
          className="absolute top-2 z-20"
          style={{
            right: isRTL ? undefined : 8,
            left: isRTL ? 8 : undefined
          }}
        >
          <WishlistButton
            product={product}
            size="sm"
            variant="filled"
          />
        </View>

        {/* Compare Button */}
        <View
          className="absolute top-2 z-20"
          style={{
            right: isRTL ? undefined : 48,
            left: isRTL ? 48 : undefined
          }}
        >
          <CompareButton
            product={product}
            size="sm"
            variant="icon"
          />
        </View>

        {/* Quick View Button */}
        <View
          className="absolute top-2 z-20"
          style={{
            right: isRTL ? undefined : 88,
            left: isRTL ? 88 : undefined
          }}
        >
          <Link href={`/product/${product.id}`} asChild>
            <Pressable className="w-8 h-8 bg-background-0/90 rounded-full items-center justify-center border border-outline-200 active:scale-95">
              <Icon as={Eye} size="xs" className="text-typography-700" />
            </Pressable>
          </Link>
        </View>

        <Link href={`/product/${product.id}`} asChild>
          <Pressable className="flex-1 active:opacity-95">
            {/* Product Image Container */}
            <View className="relative rounded-t-lg overflow-hidden h-48">
              <Image
                source={{ uri: image || 'https://via.placeholder.com/300x300?text=No+Image' }}
                className="h-full w-full absolute inset-0"
                alt={`${name} image`}
                resizeMode="contain"   // ✅ fills while respecting aspect ratio
                style={{ backgroundColor: 'transparent' }}
              />

              {/* Stock Status Overlay */}
              {isOutOfStock && (
                <View className="absolute inset-0 bg-background-900/60 items-center justify-center">
                  <Text className="text-white font-semibold text-sm">Out of Stock</Text>
                </View>
              )}

              {/* Low Stock Warning */}
              {isLowStock && !isOutOfStock && (
                <View
                  className="absolute bottom-2"
                  style={{
                    left: isRTL ? undefined : 8,
                    right: isRTL ? 8 : undefined
                  }}
                >
                  <Badge className="bg-warning-500">
                    <Icon as={Zap} size="xs" className={`text-white ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    <BadgeText className="text-white text-xs">Only {stock} left</BadgeText>
                  </Badge>
                </View>
              )}
            </View>

            {/* Product Info */}
            <VStack className="p-3 flex-1" space="xs">
              {/* Product Name */}
              <Text
                className="text-sm font-semibold text-typography-900 leading-tight"
                numberOfLines={2}
              >
                {name}
              </Text>

              {/* Rating */}
              {rating > 0 && (
                <HStack className="items-center" space="xs">
                  <HStack space="xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        as={Star}
                        size="xs"
                        className={
                          star <= Math.floor(rating)
                            ? 'text-yellow-500 fill-current'
                            : star <= rating
                              ? 'text-yellow-500'
                              : 'text-typography-300'
                        }
                      />
                    ))}
                  </HStack>
                  <Text className="text-xs text-typography-500">
                    ({reviewCount})
                  </Text>
                </HStack>
              )}

              {/* Description */}
              {description && (
                <Text
                  className="text-xs text-typography-600 leading-relaxed"
                  numberOfLines={2}
                >
                  {description}
                </Text>
              )}

              {/* Price Section */}
              <VStack className="mt-auto" space="xs">
                <HStack className="items-center justify-between">
                  <VStack>
                    {discount ? (
                      <HStack className="items-center" space="xs">
                        <Heading size="sm" className="text-primary-600 font-bold">
                          ${discountedPrice.toFixed(2)}
                        </Heading>
                        <Text className="text-xs text-typography-400 line-through">
                          ${price.toFixed(2)}
                        </Text>
                      </HStack>
                    ) : (
                      <Heading size="sm" className="text-primary-600 font-bold">
                        ${price.toFixed(2)}
                      </Heading>
                    )}
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </Pressable>
        </Link>

        {/* Add to Cart Button */}
        <View className="p-3 pt-0">
          <Button
            size="sm"
            onPress={handleAddToCart}
            disabled={isOutOfStock}
            style={{
              backgroundColor: isOutOfStock ? colors.backgroundSecondary : colors.primary,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              opacity: isOutOfStock ? 0.6 : 1
            }}
          >
            <Icon
              as={ShoppingCart}
              size="xs"
              className={`${isRTL ? 'ml-2' : 'mr-2'} ${isOutOfStock ? 'text-typography-400' : 'text-white'}`}
            />
            <ButtonText
              className={`text-xs font-semibold ${isOutOfStock ? 'text-typography-400' : 'text-white'
                }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </ButtonText>
          </Button>
        </View>
      </Card>
    </View>
  );
}
