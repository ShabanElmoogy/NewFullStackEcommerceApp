import React from "react";
import { View, I18nManager } from "react-native";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";
import { useRTL } from "@/hooks/useRTL";
import { useTranslation } from "react-i18next";

export interface ProductCardListImageSectionProps {
  name: string;
  image?: string;
  hasDiscount: boolean;
  isOutOfStock: boolean;
  discount?: number;
}

const ProductCardListImageSection: React.FC<ProductCardListImageSectionProps> = ({ name, image, hasDiscount, isOutOfStock, discount }) => {
  const { colors } = useTheme();
  const { isRTL } = useRTL();
  const rtl = isRTL || I18nManager.isRTL;
  const { t } = useTranslation();

  return (
    <View
      className="w-[90px] h-[90px] rounded-xl overflow-hidden relative"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      <Image
        source={{ uri: image || "https://via.placeholder.com/300x300?text=No+Image" }}
        className="w-full h-full rounded-xl"
        resizeMode="cover"
        alt={`${name} image`}
      />

      {hasDiscount && (
        <View
          className="absolute top-1.5 px-1.5 py-0.5 rounded-md bg-red-500"
          style={{ ...(rtl ? { right: 6 } : { left: 6 }) }}
        >
          <Text className="text-white text-[10px] font-bold">
            {t('products.discount', { discount })}
          </Text>
        </View>
      )}

      {isOutOfStock && (
        <View className="absolute inset-0 bg-black/70 rounded-xl justify-center items-center">
          <Text className="text-white text-xs font-bold text-center">
            {t('products.outOfStock')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProductCardListImageSection;
