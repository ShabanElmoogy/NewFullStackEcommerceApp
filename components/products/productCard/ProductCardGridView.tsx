import React from "react";
import { View } from "react-native";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { VStack } from "../../ui/vstack";
import { Text } from "../../ui/text";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";
import { ProductLinkWrapper } from "./ProductLinkWrapper";
import { QuickViewButton } from "./QuickViewButton";
import ShareButton from "./ShareButton";
import { AddToCartButton } from "./AddToCartButton";
import { ProductRating } from "./ProductRating";
import { ProductPrice } from "./ProductPrice";
import { ProductBadges } from "./ProductBadges";
import { OutOfStockOverlay } from "./OutOfStockOverlay";
import { LowStockBadge } from "./LowStockBadge";
import { Product } from "./types";
import { useProductCard } from "./useProductCard";

interface ProductCardGridViewProps {
  product: Product;
  onPress?: (product: Product) => void;
}

export default function ProductCardGridView({ product, onPress }: ProductCardGridViewProps) {
  const {
    name,
    price,
    image,
    description,
    rating,
    reviewCount,
    discount,
    isNew,
    isTrending,
    stock,
    isRTL,
    isOutOfStock,
    isLowStock,
  } = useProductCard(product);

  return (
    <View className="flex-1">
      <Card className="flex-1 relative bg-background-0 border border-outline-100">
        
        {/* Wishlist + Compare + QuickView */}
        <View className="absolute top-2 z-20 flex-row gap-2" style={{ right: isRTL ? undefined : 8, left: isRTL ? 8 : undefined }}>
          <WishlistButton product={product} size="sm" />
          <CompareButton product={product} size="sm" variant="icon" />
          <QuickViewButton product={product} onPress={onPress} />
          <ShareButton product={product} />
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
            
            {/* Badges on Image */}
            <View className="absolute top-2 flex-row gap-1 z-20" style={{ left: isRTL ? undefined : 8, right: isRTL ? 8 : undefined }}>
              <ProductBadges isNew={isNew} isTrending={isTrending} discount={discount} />
            </View>
            
            {isOutOfStock && <OutOfStockOverlay />}
            {isLowStock && !isOutOfStock && <LowStockBadge stock={stock} />}
          </View>

          {/* Info */}
          <VStack className="p-3 flex-1" space="xs">
            <Text className="text-sm font-semibold text-typography-900 leading-tight" numberOfLines={2}>
              {name}
            </Text>

            <ProductRating rating={rating} reviewCount={reviewCount} variant="grid" showWhenEmpty={true} />

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
