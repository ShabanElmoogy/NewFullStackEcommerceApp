import React from 'react';
import { HStack } from '@/components/ui/hstack';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import WishlistButton from './WishlistButton';
import CartButton from './CartButton';

export default function HeaderActions() {
  return (
    <HStack className="items-center gap-3 px-2" space="md">
      <LanguageToggle />
      <ThemeToggle />
      <WishlistButton />
      <CartButton />
    </HStack>
  );
}