import React from "react";
import { I18nManager } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ProductLinkWrapper } from "../ProductLinkWrapper";
import { Product } from "../types";
import { useProductCard } from "../useProductCard";
import { useRTL } from "@/hooks/useRTL";
import {
  ProductCardListImageSection,
  ProductCardListHeader,
  ProductCardListDescription,
  ProductCardListBottomRow,
  ProductCardListRating,
} from ".";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

interface ProductCardListViewProps {
  product: Product;
  onPress?: (product: Product) => void;
}

export default function ProductCardListView({ product, onPress }: ProductCardListViewProps) {
  const {
    name,
    price,
    image,
    description,
    rating,
    reviewCount,
    discount,
    stock,
    isOutOfStock,
    isLowStock,
    hasDiscount,
  } = useProductCard(product);

  const { colors } = useTheme();
  const { isRTL } = useRTL();
  const rtl = isRTL || I18nManager.isRTL;

  return (
    <VStack
      className="rounded-[18px] border mb-2 overflow-hidden shadow-sm"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <ProductLinkWrapper product={product} onPress={onPress}>
        <VStack className="p-4">
          {/* Top Section - Image and Action Buttons */}
          <HStack className="gap-4 mb-3">
            <ProductCardListImageSection
              name={name}
              image={image}
              hasDiscount={hasDiscount}
              isOutOfStock={isOutOfStock}
              discount={discount}
            />

            <VStack className="flex-1 min-w-0">
              <ProductCardListHeader name={name} product={product} />
              <ProductCardListRating rating={rating} reviewCount={reviewCount} />
              <ProductCardListDescription description={description} />
            </VStack>
          </HStack>

          {/* Bottom Section - Price and Add to Cart */}
          <ProductCardListBottomRow
            product={product}
            price={price}
            discount={discount}
            stock={stock}
            isLowStock={isLowStock}
            isOutOfStock={isOutOfStock}
          />
        </VStack>
      </ProductLinkWrapper>
    </VStack>
  );
}
