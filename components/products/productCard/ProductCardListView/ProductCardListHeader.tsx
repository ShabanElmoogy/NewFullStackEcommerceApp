import React from "react";
import { View, I18nManager } from "react-native";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";
import { useRTL } from "@/hooks/useRTL";
import { HStack } from "@/components/ui/hstack";
import WishlistButton from "../WishlistButton";
import CompareButton from "../CompareButton";
import { Product } from "../types";

export interface ProductCardListHeaderProps { name: string; product: Product }

const ProductCardListHeader: React.FC<ProductCardListHeaderProps> = ({ name, product }) => {
  const { colors } = useTheme();
  const { isRTL } = useRTL();
  const rtl = isRTL || I18nManager.isRTL;

  return (
    <HStack className="items-start mb-2 gap-2" style={{ flexDirection: rtl ? 'row-reverse' : 'row' }}>
      <View className="flex-1 min-w-0">
        <Text className="text-base font-bold leading-5" style={{ color: colors.text }} numberOfLines={2} ellipsizeMode="tail">
          {name}
        </Text>
      </View>

      <HStack className="gap-1 shrink-0 items-start" style={{ flexDirection: rtl ? 'row-reverse' : 'row' }}>
        <WishlistButton product={product} size="sm" />
        <CompareButton product={product} size="sm" variant="icon" />
      </HStack>
    </HStack>
  );
};

export default ProductCardListHeader;
