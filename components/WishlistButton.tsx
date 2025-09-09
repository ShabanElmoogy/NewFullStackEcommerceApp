import React from 'react';
import { Pressable } from 'react-native';
import { Icon } from './ui/icon';
import { Heart } from 'lucide-react-native';
import { useWishlist } from '@/store/wishlistStore';
import { useToast } from './ui/toast';
import { CustomToast } from './CustomToast';

interface WishlistButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'ghost';
}

export default function WishlistButton({ 
  product, 
  size = 'md',
  variant = 'ghost'
}: WishlistButtonProps) {
  const { addProduct, removeProduct, isInWishlist } = useWishlist();
  const toast = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeProduct(product.id);
    } else {
      addProduct(product);
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return 'xs';
      case 'lg': return 'lg';
      default: return 'md';
    }
  };

  const getStyles = () => {
    const baseStyles = "rounded-full items-center justify-center active:scale-95";
    const sizeStyles = {
      sm: "w-8 h-8 p-1",
      md: "w-10 h-10 p-2",
      lg: "w-12 h-12 p-3"
    };

    if (inWishlist) {
      switch (variant) {
        case 'filled':
          return `${baseStyles} ${sizeStyles[size]} bg-error-500`;
        case 'outline':
          return `${baseStyles} ${sizeStyles[size]} border-2 border-error-500 bg-background-0`;
        default:
          return `${baseStyles} ${sizeStyles[size]} bg-error-100`;
      }
    } else {
      switch (variant) {
        case 'filled':
          return `${baseStyles} ${sizeStyles[size]} bg-background-200`;
        case 'outline':
          return `${baseStyles} ${sizeStyles[size]} border-2 border-typography-300 bg-background-0`;
        default:
          return `${baseStyles} ${sizeStyles[size]} bg-background-100 active:bg-background-200`;
      }
    }
  };

  const getIconColor = () => {
    if (inWishlist) {
      return variant === 'filled' ? 'text-white' : 'text-error-500';
    } else {
      return variant === 'filled' ? 'text-white' : 'text-typography-600';
    }
  };

  return (
    <Pressable
      onPress={handleToggleWishlist}
      className={getStyles()}
    >
      <Icon 
        as={Heart} 
        size={getSize()} 
        className={`${getIconColor()} ${inWishlist ? 'fill-current' : ''}`}
      />
    </Pressable>
  );
}