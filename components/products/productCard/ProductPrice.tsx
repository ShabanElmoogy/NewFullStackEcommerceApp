import React from "react";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";

export const ProductPrice: React.FC<{
  price: number;
  discount?: number;
  variant?: "grid" | "list";
}> = ({ price, discount, variant = "grid" }) => {
  const { colors } = useTheme();
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  if (variant === "list") {
    return (
      <VStack>
        {discount ? (
          <HStack space="sm" className="items-center">
            <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary }}>
              ${discountedPrice.toFixed(2)}
            </Text>
            <Text style={{ fontSize: 14, textDecorationLine: "line-through", color: colors.textTertiary }}>
              ${price.toFixed(2)}
            </Text>
          </HStack>
        ) : (
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.primary }}>
            ${price.toFixed(2)}
          </Text>
        )}
      </VStack>
    );
  }

  return (
    <VStack>
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
  );
};
