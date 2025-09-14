import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";
import { useCart } from "@/store/cartStore";
import { useToast } from "./ui/toast";
import { CustomToast } from "./CustomToast";
import { useLanguageStore } from "@/store/languageStore";
import { useTheme } from "@/hooks/useTheme";
import { ShoppingCart, Star, Eye, TrendingUp, Zap, Check, Loader } from "lucide-react-native";

// Expo Router safe import
let Link: any = null;
try {
  const ExpoRouter = require("expo-router");
  Link = ExpoRouter.Link;
} catch {
  console.warn("expo-router not available, falling back to onPress navigation");
}

interface Product {
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
}

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  onPress?: (product: Product) => void;
}

export default function ProductCard({
  product,
  viewMode = "grid",
  onPress,
}: ProductCardProps) {
  const {
    name,
    price,
    image,
    description,
    rating = 4.5,
    reviewCount = 0,
    discount,
    isNew,
    isTrending,
    stock = 10,
  } = product;

  const addToCart = useCart((state) => state.addProduct);
  const toast = useToast();
  const { isRTL } = useLanguageStore();
  const { colors } = useTheme();
  const [ratio] = useState(1);
  
  // Enhanced UX states
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const discountedPrice = discount ? price * (1 - discount / 100) : price;
  const isLowStock = stock < 5;
  const isOutOfStock = stock === 0;

  // Add to Cart handler with loading + toast
  const handleAddToCart = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAddingToCart) return;

    try {
      setIsAddingToCart(true);
      // Simulated async delay for nicer UX (optional)
      await new Promise((resolve) => setTimeout(resolve, 300));
      addToCart(product as any);
      setShowSuccess(true);
      toast.show({
        placement: "bottom",
        duration: 5000,
        render: ({ id }) => (
          <CustomToast id={id} message={`${name} added to cart!`} icon={Check} />
        ),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.show({
        placement: "bottom",
        duration: 3000,
        render: ({ id }) => <CustomToast id={id} message="Failed to add item to cart" />,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  /** Wrapper for product content */
  const ProductContent = ({ children, ...props }: any) => {
    if (Link && !onPress) {
      return (
        <Link href={`/product/${product.id}`} asChild>
          <Pressable {...props}>{children}</Pressable>
        </Link>
      );
    }
    return (
      <Pressable
        onPress={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPress?.(product);
        }}
        {...props}
      >
        {children}
      </Pressable>
    );
  };

  /** Quick View Button */
  const QuickViewButton = () => (
    <Pressable
      onPress={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onPress?.(product);
      }}
      className="w-8 h-8 bg-background-0/90 rounded-full items-center justify-center border border-outline-200 active:scale-95"
    >
      <Icon as={Eye} size="xs" className="text-typography-700" />
    </Pressable>
  );

  /** Enhanced Add to Cart Button */
  const AddToCartInlineButton = ({ variant = "default" }: { variant?: "default" | "compact" }) => {
    const getButtonContent = () => {
      if (isAddingToCart) {
        return { icon: Loader, text: "Adding...", iconProps: { className: "animate-spin" } };
      }
      if (showSuccess) {
        return { icon: Check, text: "Added!", iconProps: {} };
      }
      if (isOutOfStock) {
        return { icon: ShoppingCart, text: "Out of Stock", iconProps: {} };
      }
      return { icon: ShoppingCart, text: variant === "compact" ? "Add" : "Add to Cart", iconProps: {} };
    };

    const { icon, text, iconProps } = getButtonContent();
    const buttonColor = showSuccess ? colors.success : isOutOfStock ? colors.backgroundSecondary : colors.primary;
    const textColor = showSuccess ? colors.text : isOutOfStock ? colors.textTertiary : colors.text;

    if (variant === "compact") {
      return (
        <Pressable
          onPress={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          style={{
            backgroundColor: buttonColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
            opacity: isOutOfStock && !showSuccess ? 0.6 : 1,
            flexDirection: "row",
            alignItems: "center",
            transform: [{ scale: showSuccess ? 1.05 : 1 }],
          }}
        >
          <Icon as={icon} size="xs" style={{ color: textColor }} {...iconProps} />
          <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: "600", color: textColor }}>{text}</Text>
        </Pressable>
      );
    }

    return (
      <Button
        size="sm"
        onPress={handleAddToCart}
        disabled={isOutOfStock || isAddingToCart}
        style={{
          backgroundColor: buttonColor,
          opacity: isOutOfStock && !showSuccess ? 0.6 : 1,
          transform: [{ scale: showSuccess ? 1.02 : 1 }],
        }}
      >
        <Icon
          as={icon}
          size="xs"
          className={showSuccess ? "text-white" : isOutOfStock ? "text-typography-400" : "text-white"}
          {...iconProps}
        />
        <ButtonText
          className={`text-xs font-semibold ${showSuccess ? "text-white" : isOutOfStock ? "text-typography-400" : "text-white"}`}
        >
          {text}
        </ButtonText>
      </Button>
    );
  };

  /** ─────────────────────────────
   * LIST VIEW
   * ───────────────────────────── */
  if (viewMode === "list") {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 6,
          overflow: "hidden",
        }}
      >
        <ProductContent>
          <View style={{ padding: 16, flexDirection: "row", gap: 16 }}>
            {/* IMAGE */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: colors.backgroundSecondary,
              }}
            >
              <Image
                source={{
                  uri:
                    image ||
                    "https://via.placeholder.com/300x300?text=No+Image",
                }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
                alt={`${name} image`}
              />
              {isOutOfStock && (
                <View className="absolute inset-0 bg-black/50 items-center justify-center">
                  <Text className="text-white font-semibold text-xs">Out</Text>
                </View>
              )}
            </View>

            {/* INFO */}
            <View style={{ flex: 1, gap: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                  numberOfLines={2}
                >
                  {name}
                </Text>
                <HStack space="xs">
                  <WishlistButton product={product} size="sm" variant="filled" />
                  <CompareButton product={product} size="sm" variant="icon" />
                </HStack>
              </View>

              {rating > 0 && (
                <HStack space="xs" className="items-center">
                  <HStack space="xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        as={Star}
                        size="xs"
                        style={{
                          color:
                            star <= Math.floor(rating)
                              ? colors.warning
                              : colors.textTertiary,
                        }}
                      />
                    ))}
                  </HStack>
                  <Text className="text-xs text-typography-500">
                    ({reviewCount})
                  </Text>
                </HStack>
              )}

              {description && (
                <Text
                  numberOfLines={2}
                  style={{ fontSize: 14, color: colors.textSecondary }}
                >
                  {description}
                </Text>
              )}

              <HStack
                style={{ marginTop: "auto" }}
                className="items-center justify-between"
              >
                <VStack>
                  {discount ? (
                    <HStack space="sm" className="items-center">
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: colors.primary,
                        }}
                      >
                        ${discountedPrice.toFixed(2)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          textDecorationLine: "line-through",
                          color: colors.textTertiary,
                        }}
                      >
                        ${price.toFixed(2)}
                      </Text>
                    </HStack>
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: colors.primary,
                      }}
                    >
                      ${price.toFixed(2)}
                    </Text>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <HStack space="xs" className="items-center">
                      <Icon as={Zap} size="xs" style={{ color: colors.warning }} />
                      <Text style={{ fontSize: 12, color: colors.warning }}>
                        Only {stock} left
                      </Text>
                    </HStack>
                  )}
                </VStack>

                <AddToCartInlineButton variant="compact" />
              </HStack>
            </View>
          </View>
        </ProductContent>
      </View>
    );
  }

  /** ─────────────────────────────
   * GRID VIEW (default)
   * ───────────────────────────── */
  return (
    <View className="flex-1">
      <Card className="flex-1 relative bg-background-0 border border-outline-100">
        {/* Badges */}
        <View
          className="absolute top-2 flex-row gap-1 z-20"
          style={{ left: isRTL ? undefined : 8, right: isRTL ? 8 : undefined }}
        >
          {isNew && (
            <Badge className="bg-success-500">
              <BadgeText className="text-white text-xs font-semibold">NEW</BadgeText>
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-warning-500">
              <Icon as={TrendingUp} size="xs" className="text-white mr-1" />
              <BadgeText className="text-white text-xs font-semibold">HOT</BadgeText>
            </Badge>
          )}
          {discount && (
            <Badge className="bg-error-500">
              <BadgeText className="text-white text-xs font-semibold">
                -{discount}%
              </BadgeText>
            </Badge>
          )}
        </View>

        {/* Wishlist + Compare + QuickView */}
        <View
          className="absolute top-2 z-20 flex-row gap-2"
          style={{ right: isRTL ? undefined : 8, left: isRTL ? 8 : undefined }}
        >
          <WishlistButton product={product} size="sm" variant="filled" />
          <CompareButton product={product} size="sm" variant="icon" />
          <QuickViewButton />
        </View>

        <ProductContent className="flex-1">
          {/* Image */}
          <View className="h-48 relative overflow-hidden">
            <Image
              source={{
                uri:
                  image || "https://via.placeholder.com/300x300?text=No+Image",
              }}
              className="h-full w-full"
              resizeMode="contain"
              alt={`${name} image`}
            />
            {isOutOfStock && (
              <View className="absolute inset-0 bg-black/60 items-center justify-center">
                <Text className="text-white font-semibold text-sm">Out of Stock</Text>
              </View>
            )}
            {isLowStock && !isOutOfStock && (
              <View className="absolute bottom-2 right-2">
                <Badge className="bg-warning-500">
                  <Icon as={Zap} size="xs" className="text-white mr-1" />
                  <BadgeText className="text-white text-xs">
                    Only {stock} left
                  </BadgeText>
                </Badge>
              </View>
            )}
          </View>

          {/* Info */}
          <VStack className="p-3 flex-1" space="xs">
            <Text
              className="text-sm font-semibold text-typography-900 leading-tight"
              numberOfLines={2}
            >
              {name}
            </Text>

            {rating > 0 && (
              <HStack space="xs" className="items-center">
                <HStack space="xs">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      as={Star}
                      size="xs"
                      className={
                        star <= Math.floor(rating)
                          ? "text-yellow-500"
                          : "text-typography-300"
                      }
                    />
                  ))}
                </HStack>
                <Text className="text-xs text-typography-500">
                  ({reviewCount})
                </Text>
              </HStack>
            )}

            {description && (
              <Text
                className="text-xs text-typography-600 leading-relaxed"
                numberOfLines={2}
              >
                {description}
              </Text>
            )}

            <VStack className="mt-auto">
              {discount ? (
                <HStack space="xs" className="items-center">
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
          </VStack>
        </ProductContent>

        <View className="p-3 pt-0">
          <AddToCartInlineButton />
        </View>
      </Card>
    </View>
  );
}
