import React, { useState } from "react";
import { Pressable } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/store/cartStore";
import { Toast } from "toastify-react-native";
import { ToastType } from "@/types/toastType";
import { ShoppingCart, Check, Loader } from "lucide-react-native";
import { Product } from "./types";

export const AddToCartButton: React.FC<{
  product: Product;
  variant?: "default" | "compact";
}> = ({ product, variant = "default" }) => {
  const addToCart = useCart((state) => state.addProduct);
  const { colors } = useTheme();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const stock = typeof product.stock === "number" ? product.stock : 10;
  const isOutOfStock = stock === 0;

  const handleAddToCart = async (e: any) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    if (isOutOfStock || isAddingToCart) return;

    try {
      setIsAddingToCart(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      addToCart(product as any);
      setShowSuccess(true);

      Toast.show({
        type: ToastType.SUCCESS,
        text1: "Success!",
        text2: "Your action was completed successfully",
        visibilityTime: 3000,
        position: "top",
      });

      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getButtonContent = () => {
    if (isAddingToCart) {
      return { icon: Loader, text: "Adding...", iconProps: { className: "animate-spin" } } as const;
    }
    if (showSuccess) {
      return { icon: Check, text: "Added!", iconProps: {} } as const;
    }
    if (isOutOfStock) {
      return { icon: ShoppingCart, text: "Out of Stock", iconProps: {} } as const;
    }
    return { icon: ShoppingCart, text: variant === "compact" ? "Add" : "Add to Cart", iconProps: {} } as const;
  };

  const { icon, text, iconProps } = getButtonContent();
  const buttonColor = showSuccess ? colors.success : isOutOfStock ? colors.backgroundSecondary : colors.primary;
  const textColor = showSuccess ? colors.text : isOutOfStock ? colors.textTertiary : colors.text;

  if (variant === "compact") {
    return (
      <Pressable
        onPress={handleAddToCart}
        disabled={isOutOfStock || isAddingToCart}
        style={{
          backgroundColor: buttonColor,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          opacity: isOutOfStock && !showSuccess ? 0.6 : 1,
          flexDirection: "row",
          alignItems: "center",
          transform: [{ scale: showSuccess ? 1.05 : 1 }],
        }}
      >
        <Icon as={icon} size="xs" style={{ color: textColor }} {...iconProps} />
        <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: "600", color: textColor }}>{text}</Text>
      </Pressable>
    );
  }

  return (
    <Button
      size="sm"
      onPress={handleAddToCart}
      disabled={isOutOfStock || isAddingToCart}
      style={{
        backgroundColor: buttonColor,
        opacity: isOutOfStock && !showSuccess ? 0.6 : 1,
        transform: [{ scale: showSuccess ? 1.02 : 1 }],
      }}
    >
      <Icon
        as={icon}
        size="xs"
        className={showSuccess ? "text-white" : isOutOfStock ? "text-typography-400" : "text-white"}
        {...iconProps}
      />
      <ButtonText className={`text-xs font-semibold ${showSuccess ? "text-white" : isOutOfStock ? "text-typography-400" : "text-white"}`}>
        {text}
      </ButtonText>
    </Button>
  );
};
