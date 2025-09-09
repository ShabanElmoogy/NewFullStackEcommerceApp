import React from 'react';
import { useRouter } from 'expo-router';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from '@/components/ui/drawer';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import {
  Home,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  Heart,
  HelpCircle,
} from 'lucide-react-native';
import { useAuth } from '@/store/authStore';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    onClose();
    setTimeout(() => router.push(href), 50);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerBackdrop />
      <DrawerContent className="w-[270px] md:w-[300px]">
        <DrawerHeader className="justify-center flex-col gap-2">
          {isAuthenticated && user ? (
            <>
              <Avatar size="2xl">
                <AvatarFallbackText>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallbackText>
              </Avatar>
              <VStack className="justify-center items-center">
                <Text size="lg">{user.name || 'User'}</Text>
                <Text size="sm" className="text-typography-600">
                  {user.email || 'user@example.com'}
                </Text>
              </VStack>
            </>
          ) : (
            <>
              <Avatar size="2xl">
                <AvatarFallbackText>G</AvatarFallbackText>
              </Avatar>
              <VStack className="justify-center items-center">
                <Text size="lg">Guest User</Text>
                <Text size="sm" className="text-typography-600">
                  Sign in to access more features
                </Text>
              </VStack>
            </>
          )}
        </DrawerHeader>

        <Divider className="my-4" />

        <DrawerBody contentContainerClassName="gap-2">
          <Pressable 
            className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
            onPress={() => handleNavigation('/')}
          >
            <Icon as={Home} size="lg" className="text-typography-600" />
            <Text>Home</Text>
          </Pressable>

          <Pressable 
            className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
            onPress={() => handleNavigation('/cart')}
          >
            <Icon as={ShoppingCart} size="lg" className="text-typography-600" />
            <Text>Cart</Text>
          </Pressable>

          {isAuthenticated && (
            <>
              <Pressable 
                className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
                onPress={() => handleNavigation('/wishlist')}
              >
                <Icon as={Heart} size="lg" className="text-typography-600" />
                <Text>Wishlist</Text>
              </Pressable>

              <Pressable 
                className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
                onPress={() => handleNavigation('/profile')}
              >
                <Icon as={User} size="lg" className="text-typography-600" />
                <Text>Profile</Text>
              </Pressable>
            </>
          )}

          <Pressable 
            className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
            onPress={() => handleNavigation('/help')}
          >
            <Icon as={HelpCircle} size="lg" className="text-typography-600" />
            <Text>Help</Text>
          </Pressable>
        </DrawerBody>

        <DrawerFooter>
          {isAuthenticated ? (
            <Button
              className="w-full gap-2"
              variant="outline"
              action="secondary"
              onPress={handleLogout}
            >
              <ButtonText>Logout</ButtonText>
              <ButtonIcon as={LogOut} />
            </Button>
          ) : (
            <Button
              className="w-full gap-2"
              onPress={() => handleNavigation('/(auth)/login')}
            >
              <ButtonText>Sign In</ButtonText>
              <ButtonIcon as={LogIn} />
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}