import React, { useRef, useState } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ShoppingCart, Loader, Check } from 'lucide-react-native';
import type { Product } from '@/store/cartStore';
import { useCart } from '@/store/cartStore';
import { useToast } from '@/components/ui/toast';
import { CustomToast } from '@/components/CustomToast';
import { useTheme } from '@/hooks/useTheme';

export type AddToCartButtonProps = {
  product: Product;
  quantity?: number;
  inStock?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: ViewStyle | ViewStyle[];
  label?: string; // default "Add to Cart"
  addedMessage?: string; // default "Added to cart"
  outOfStockMessage?: string; // default "Out of stock"
  showToast?: boolean; // default true
  toastPlacement?: 'top' | 'bottom'; // default 'bottom'
  leftIcon?: any; // default ShoppingCart icon
  onAdded?: () => void; // callback after successful add
  animate?: boolean; // default true
  successFlashMs?: number; // default 900
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  inStock = true,
  size = 'sm',
  className,
  style,
  label = 'Add to Cart',
  addedMessage = 'Added to cart',
  outOfStockMessage = 'Out of stock',
  showToast = true,
  toastPlacement = 'bottom',
  leftIcon = ShoppingCart,
  onAdded,
  animate = true,
  successFlashMs = 900,
}) => {
  const addProduct = useCart((s) => s.addProduct);
  const toast = useToast();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const btnScale = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  const runAnimations = () => {
    if (!animate) return;
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.97, duration: 90, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.timing(iconScale, { toValue: 1.2, duration: 110, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = (e?: any) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();

    if (loading) return;

    if (!inStock) {
      if (showToast) {
        toast.show({
          placement: toastPlacement,
          duration: 2500,
          render: ({ id }) => <CustomToast id={id} message={outOfStockMessage} />,
        });
      }
      return;
    }

    setLoading(true);
    addProduct(product, quantity);

    runAnimations();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), successFlashMs);

    if (showToast) {
      const qtyText = quantity > 1 ? ` × ${quantity}` : '';
      toast.show({
        placement: toastPlacement,
        duration: 2500,
        render: ({ id }) => (
          <CustomToast id={id} message={`${addedMessage}${qtyText}`} />
        ),
      });
    }

    setLoading(false);
    onAdded?.();
  };

  const currentLabel = !inStock
    ? outOfStockMessage
    : loading
    ? 'Adding...'
    : justAdded
    ? 'Added!'
    : label;

  const CurrentIcon = !inStock ? ShoppingCart : loading ? Loader : justAdded ? Check : leftIcon;

  const backgroundColor = !inStock
    ? colors.backgroundSecondary
    : justAdded
    ? colors.success
    : colors.primary;

  const content = (
    <Button
      size={size}
      onPress={handlePress}
      className={className}
      style={[{ backgroundColor }, style as any]}
    >
      <Animated.View style={{ transform: [{ scale: animate ? iconScale : 1 }], marginRight: 8 }}>
        <Icon as={CurrentIcon} size="xs" className={!inStock ? 'text-typography-400' : 'text-white'} />
      </Animated.View>
      <ButtonText className={!inStock ? 'text-typography-400' : 'text-white font-semibold'}>
        {currentLabel}
      </ButtonText>
    </Button>
  );

  if (!animate) {
    return content;
  }

  return <Animated.View style={{ transform: [{ scale: btnScale }] }}>{content}</Animated.View>;
};

export default AddToCartButton;
