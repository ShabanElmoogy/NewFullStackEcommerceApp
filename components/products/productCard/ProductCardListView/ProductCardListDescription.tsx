import React from "react";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";

export interface ProductCardListDescriptionProps { description?: string }

const ProductCardListDescription: React.FC<ProductCardListDescriptionProps> = ({ description }) => {
  const { colors } = useTheme();
  if (!description) return null;
  return (
    <Text numberOfLines={2} className="text-[13px] leading-[18px] mb-2" style={{ color: colors.textSecondary }} ellipsizeMode="tail">
      {description}
    </Text>
  );
};

export default ProductCardListDescription;
