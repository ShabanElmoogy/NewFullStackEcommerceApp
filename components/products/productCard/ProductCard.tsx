import React from "react";
import { View } from "react-native";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { VStack } from "../../ui/vstack";
import { HStack } from "../../ui/hstack";
import { Text } from "../../ui/text";
import WishlistButton from "../../WishlistButton";
import CompareButton from "../../CompareButton";
import { useLanguageStore } from "@/store/languageStore";
import { useTheme } from "@/hooks/useTheme";
import {
  ProductLinkWrapper,
  QuickViewButton,
  AddToCartButton,
  ProductRating,
  ProductPrice,
  ProductBadges,
  OutOfStockOverlay,
  LowStockBadge,
  LowStockInline,
} from "./ProductCardParts";

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

export default function ProductCard({ product, viewMode = "grid", onPress }: ProductCardProps) {
  const { name, price, image, description, rating = 0, reviewCount = 0, discount, isNew, isTrending, stock = 10 } = product;

  const { isRTL } = useLanguageStore();
  const { colors } = useTheme();

  const isLowStock = (stock ?? 0) < 5;
  const isOutOfStock = (stock ?? 0) === 0;

  // ─────────────────────────────
  // LIST VIEW
  // ─────────────────────────────
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
        <ProductLinkWrapper product={product} onPress={onPress}>
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
                source={{ uri: image || "https://via.placeholder.com/300x300?text=No+Image" }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
                alt={`${name} image`}
              />
              {isOutOfStock && <OutOfStockOverlay label="Out" />}
            </View>

            {/* INFO */}
            <View style={{ flex: 1, gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }} numberOfLines={2}>
                  {name}
                </Text>
                <HStack space="xs">
                  <WishlistButton product={product} size="sm" variant="filled" />
                  <CompareButton product={product} size="sm" variant="icon" />
                </HStack>
              </View>

              <ProductRating rating={rating} reviewCount={reviewCount} variant="list" />

              {description && (
                <Text numberOfLines={2} style={{ fontSize: 14, color: colors.textSecondary }}>
                  {description}
                </Text>
              )}

              <HStack style={{ marginTop: "auto" }} className="items-center justify-between">
                <VStack>
                  <ProductPrice price={price} discount={discount} variant="list" />
                  {isLowStock && !isOutOfStock && <LowStockInline stock={stock} />}
                </VStack>
                <AddToCartButton product={product} variant="compact" />
              </HStack>
            </View>
          </View>
        </ProductLinkWrapper>
      </View>
    );
  }

  // ─────────────────────────────
  // GRID VIEW (default)
  // ─────────────────────────────
  return (
    <View className="flex-1">
      <Card className="flex-1 relative bg-background-0 border border-outline-100">
        {/* Badges */}
        <View className="absolute top-2 flex-row gap-1 z-20" style={{ left: isRTL ? undefined : 8, right: isRTL ? 8 : undefined }}>
          <ProductBadges isNew={isNew} isTrending={isTrending} discount={discount} />
        </View>

        {/* Wishlist + Compare + QuickView */}
        <View className="absolute top-2 z-20 flex-row gap-2" style={{ right: isRTL ? undefined : 8, left: isRTL ? 8 : undefined }}>
          <WishlistButton product={product} size="sm" variant="filled" />
          <CompareButton product={product} size="sm" variant="icon" />
          <QuickViewButton product={product} onPress={onPress} />
        </View>

        <ProductLinkWrapper product={product} onPress={onPress} className="flex-1">
          {/* Image */}
          <View className="h-48 relative overflow-hidden">
            <Image
              source={{ uri: image || "https://via.placeholder.com/300x300?text=No+Image" }}
              className="h-full w-full"
              resizeMode="contain"
              alt={`${name} image`}
            />
            {isOutOfStock && <OutOfStockOverlay />}
            {isLowStock && !isOutOfStock && <LowStockBadge stock={stock} />}
          </View>

          {/* Info */}
          <VStack className="p-3 flex-1" space="xs">
            <Text className="text-sm font-semibold text-typography-900 leading-tight" numberOfLines={2}>
              {name}
            </Text>

            <ProductRating rating={rating} reviewCount={reviewCount} variant="grid" />

            {description && (
              <Text className="text-xs text-typography-600 leading-relaxed" numberOfLines={2}>
                {description}
              </Text>
            )}

            <ProductPrice price={price} discount={discount} variant="grid" />
          </VStack>
        </ProductLinkWrapper>

        <View className="p-3 pt-0">
          <AddToCartButton product={product} />
        </View>
      </Card>
    </View>
  );
}
