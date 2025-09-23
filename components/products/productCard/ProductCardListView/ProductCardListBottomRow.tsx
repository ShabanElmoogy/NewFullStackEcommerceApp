import React from "react";
import { View, I18nManager } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { useTheme } from "@/hooks/useTheme";
import { useRTL } from "@/hooks/useRTL";
import { useTranslation } from "react-i18next";
import { AddToCartButton } from "../AddToCartButton";
import ShareButton from "../ShareButton";
import { ProductPrice } from "../ProductPrice";
import { Product } from "../types";

export interface ProductCardListBottomRowProps {
  product: Product;
  price: number;
  discount?: number;
  stock?: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

const ProductCardListBottomRow: React.FC<ProductCardListBottomRowProps> = ({ product, price, discount, stock, isLowStock, isOutOfStock }) => {
  const { colors } = useTheme();
  const { isRTL } = useRTL();
  const rtl = isRTL || I18nManager.isRTL;
  const { t } = useTranslation();

  return (
    <HStack className="items-center justify-between pt-3 border-t" style={{ flexDirection: rtl ? 'row-reverse' : 'row', borderTopColor: colors.border + '20' }}>
      <View className="flex-1 min-w-0">
        <ProductPrice price={price} discount={discount} variant="list" />
        {isLowStock && !isOutOfStock && (
          <View className="mt-1">
            <Text className="text-[11px] text-orange-500 font-semibold" style={{ textAlign: rtl ? 'right' : 'left' }}>
              {t('products.lowStock', { count: stock })}
            </Text>
          </View>
        )}
      </View>

      <HStack className="items-center gap-3" style={{ flexDirection: rtl ? 'row-reverse' : 'row', marginHorizontal: 12 }}>
        <AddToCartButton product={product} variant="compact" />
        <ShareButton product={product} />
      </HStack>
    </HStack>
  );
};

export default ProductCardListBottomRow;
