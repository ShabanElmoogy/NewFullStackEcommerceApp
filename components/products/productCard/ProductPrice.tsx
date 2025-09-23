import React from "react";
import { View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";
import { useRTL } from "@/hooks/useRTL";
import { useTranslation } from "react-i18next";

export const ProductPrice: React.FC<{
  price: number;
  discount?: number;
  variant?: "grid" | "list";
  currency?: string;
}> = ({ price, discount, variant = "grid", currency = "USD" }) => {
  const { colors } = useTheme();
  const { getFlexDirection } = useRTL();
  const { i18n } = useTranslation();

  const discountedPrice = discount ? price * (1 - discount / 100) : price;
  // Format helper
  const formatPrice = (value: number) =>
    `${value.toFixed(2)} ${currency}`;

  if (variant === "list") {
    return (
      <VStack>
        {discount ? (
          <View
            className="items-center gap-2"
            style={{ flexDirection: getFlexDirection("row") }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary }}>
              {formatPrice(discountedPrice)}
            </Text>
            <Text style={{ fontSize: 14, textDecorationLine: "line-through", color: colors.textTertiary }}>
              {formatPrice(price)}
            </Text>
          </View>
        ) : (
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary }}>
            {formatPrice(price)}
          </Text>
        )}
      </VStack>
    );
  }

  return (
    <VStack>
      {discount ? (
        <View
          className="items-center gap-1"
          style={{ flexDirection: getFlexDirection("row") }}
        >
          <Heading size="sm" className="text-primary-600 font-bold">
            {discountedPrice}
          </Heading>
          <Text className="text-xs text-typography-400 line-through">
            {price}
          </Text>
        </View>
      ) : (
        <Heading size="sm" className="text-primary-600 font-bold">
          {price}
        </Heading>
      )}
    </VStack>
  );
};
