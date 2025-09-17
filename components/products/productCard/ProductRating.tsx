import React from "react";
import { Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";
import { Star } from "lucide-react-native";

export const ProductRating: React.FC<{
  rating?: number;
  reviewCount?: number;
  variant?: "grid" | "list" | "compact";
  showWhenEmpty?: boolean;
}> = ({ rating = 0, reviewCount = 0, variant = "grid", showWhenEmpty = false }) => {
  const { colors } = useTheme();
  
  // If no rating and showWhenEmpty is false, don't render
  if (!showWhenEmpty && (!rating || rating <= 0)) return null;
  
  // Use a default rating of 4.0 if no rating is provided but showWhenEmpty is true
  const displayRating = rating > 0 ? rating : 4.0;
  const displayReviewCount = reviewCount > 0 ? reviewCount : Math.floor(Math.random() * 50) + 10; // Random between 10-59

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
                ? star <= Math.floor(displayRating)
                  ? "text-yellow-500"
                  : "text-typography-300"
                : undefined
            }
            style={
              variant === "list" || variant === "compact"
                ? {
                    color:
                      star <= Math.floor(displayRating)
                        ? colors.warning || "#F59E0B"
                        : colors.textTertiary || "#9CA3AF",
                  }
                : undefined
            }
          />
        ))}
      </HStack>
      <Text className="text-xs text-typography-500">({displayReviewCount})</Text>
    </HStack>
  );
};
