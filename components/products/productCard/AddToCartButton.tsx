import React, { useState, useCallback, useRef, useEffect } from "react";
import { Pressable, Animated, Easing } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/store/cartStore";
import { Toast } from "toastify-react-native";
import { ToastType } from "@/types/toastType";
import { ShoppingCart, Check, Loader } from "lucide-react-native";
import { Product } from "./types";

interface AddToCartButtonProps {
  product: Product;
  variant?: "default" | "compact";
  onAddToCart?: (product: Product) => void;
  disabled?: boolean;
  className?: string;
  stableLayout?: boolean; // New prop to prevent movement in cards
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  product, 
  variant = "default",
  onAddToCart,
  disabled = false,
  className = "",
  stableLayout = false // When true, prevents animations that cause layout shifts
}) => {
  const addToCart = useCart((state) => state.addProduct);
  const { colors } = useTheme();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation values - only used when stableLayout is false
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Spinning animation for loader (only when not in stable layout mode)
  useEffect(() => {
    if (isAddingToCart && !stableLayout) {
      const spinAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      
      spinAnimation.start();
      return () => spinAnimation.stop();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isAddingToCart, stableLayout]);

  // More robust stock handling
  const stock = typeof product.stock === "number" ? product.stock : 10;
  const isOutOfStock = stock <= 0;
  const isDisabled = disabled || isOutOfStock || isAddingToCart;

  const handleAddToCart = useCallback(async (e: any) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    
    if (isDisabled) return;

    try {
      setIsAddingToCart(true);
      
      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      addToCart(product as any);
      setShowSuccess(true);

      // Call optional callback
      onAddToCart?.(product);

      Toast.show({
        type: ToastType.SUCCESS,
        text1: "🛒 Added to Cart!",
        text2: `${product.name || "Item"} has been added to your cart`,
        visibilityTime: 3000,
      });

      // Reset success state after animation
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      
      Toast.show({
        type: ToastType.ERROR,
        text1: "Error",
        text2: "Failed to add item to cart. Please try again.",
        visibilityTime: 3000,
        position: "top",
      });
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, addToCart, onAddToCart, isDisabled]);

  const getButtonContent = useCallback(() => {
    if (isAddingToCart) {
      return { 
        icon: Loader, 
        text: "Adding...", 
        iconProps: stableLayout ? {} : { className: "animate-spin" }
      } as const;
    }
    if (showSuccess) {
      return { 
        icon: Check, 
        text: "Added!", 
        iconProps: {} 
      } as const;
    }
    if (isOutOfStock) {
      return { 
        icon: ShoppingCart, 
        text: "Out of Stock", 
        iconProps: {} 
      } as const;
    }
    return { 
      icon: ShoppingCart, 
      text: variant === "compact" ? "Add" : "Add to Cart", 
      iconProps: {} 
    } as const;
  }, [isAddingToCart, showSuccess, isOutOfStock, variant, stableLayout]);

  const { icon, text, iconProps } = getButtonContent();
  
  // Improved color logic
  const getButtonColor = () => {
    if (showSuccess) return colors.success;
    if (isOutOfStock) return colors.backgroundSecondary;
    return colors.primary;
  };

  const getTextColor = () => {
    if (showSuccess) return colors.text;
    if (isOutOfStock) return colors.textTertiary;
    return colors.text;
  };

  const buttonColor = getButtonColor();
  const textColor = getTextColor();

  // Improved animation transform - only apply when not in stable layout mode
  const getTransform = () => {
    if (stableLayout) {
      return []; // No transforms in stable layout mode
    }
    return [
      { scale: showSuccess ? (variant === "compact" ? 1.05 : 1.02) : 1 }
    ];
  };

  // Rotation interpolation for spinning icon
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (variant === "compact") {
    return (
      <Pressable
        onPress={handleAddToCart}
        disabled={isDisabled}
        className={className}
        style={{
          backgroundColor: buttonColor,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          opacity: isDisabled && !showSuccess ? 0.6 : 1,
          flexDirection: "row",
          alignItems: "center",
          transform: getTransform(),
        }}
        accessibilityRole="button"
        accessibilityLabel={`${text} ${product.name || "item"}`}
        accessibilityState={{ disabled: isDisabled }}
      >
        {!stableLayout && isAddingToCart ? (
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Icon 
              as={icon} 
              size="xs" 
              style={{ color: textColor }} 
              {...iconProps} 
            />
          </Animated.View>
        ) : (
          <Icon 
            as={icon} 
            size="xs" 
            style={{ color: textColor }} 
            {...iconProps} 
          />
        )}
        
        <Text 
          style={{ 
            marginLeft: 4, 
            fontSize: 12, 
            fontWeight: "600", 
            color: textColor 
          }}
        >
          {text}
        </Text>
      </Pressable>
    );
  }

  return (
    <Button
      size="sm"
      onPress={handleAddToCart}
      disabled={isDisabled}
      className={className}
      style={{
        backgroundColor: buttonColor,
        opacity: isDisabled && !showSuccess ? 0.6 : 1,
        transform: getTransform(),
      }}
      accessibilityLabel={`${text} ${product.name || "item"}`}
      accessibilityState={{ disabled: isDisabled }}
    >
      {!stableLayout && isAddingToCart ? (
        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolate }],
          }}
        >
          <Icon
            as={icon}
            size="xs"
            className={
              showSuccess 
                ? "text-white" 
                : isOutOfStock 
                  ? "text-typography-400" 
                  : "text-white"
            }
            {...iconProps}
          />
        </Animated.View>
      ) : (
        <Icon
          as={icon}
          size="xs"
          className={
            showSuccess 
              ? "text-white" 
              : isOutOfStock 
                ? "text-typography-400" 
                : "text-white"
          }
          {...iconProps}
        />
      )}

      <ButtonText 
        className={`text-xs font-semibold ${
          showSuccess 
            ? "text-white" 
            : isOutOfStock 
              ? "text-typography-400" 
              : "text-white"
        }`}
      >
        {text}
      </ButtonText>
    </Button>
  );
};