import React from "react";
import { Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";
import { Star } from "lucide-react-native";

export const ProductRating: React.FC<{
  rating?: number;
  reviewCount?: number;
  variant?: "grid" | "list";
}> = ({ rating = 0, reviewCount = 0, variant = "grid" }) => {
  const { colors } = useTheme();
  if (!rating || rating <= 0) return null;

  return (
    <HStack space="xs" className="items-center">
      <HStack space="xs">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            as={Star}
            size="xs"
            className={
              variant === "grid"
                ? star <= Math.floor(rating)
                  ? "text-yellow-500"
                  : "text-typography-300"
                : undefined
            }
            style={
              variant === "list"
                ? {
                    color:
                      star <= Math.floor(rating)
                        ? colors.warning
                        : colors.textTertiary,
                  }
                : undefined
            }
          />
        ))}
      </HStack>
      <Text className="text-xs text-typography-500">({reviewCount})</Text>
    </HStack>
  );
};
