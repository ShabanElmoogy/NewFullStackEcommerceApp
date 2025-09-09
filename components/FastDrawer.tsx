import React from 'react';
import { Modal, View, Pressable, Text as RNText } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/authStore';

const DRAWER_WIDTH = 270;

interface FastDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FastDrawer({ isOpen, onClose }: FastDrawerProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable 
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
      >
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: DRAWER_WIDTH,
            backgroundColor: 'white',
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={() => {}}>
            {/* Header */}
            <View style={{ padding: 20, alignItems: 'center', paddingTop: 60 }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#f0f0f0',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10
              }}>
                <RNText style={{ fontSize: 32, fontWeight: 'bold', color: '#666' }}>
                  {isAuthenticated && user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                </RNText>
              </View>
              <RNText style={{ fontSize: 18, fontWeight: 'bold' }}>
                {isAuthenticated && user?.name ? user.name : 'Guest User'}
              </RNText>
              <RNText style={{ fontSize: 14, color: '#666', marginTop: 5 }}>
                {isAuthenticated && user?.email ? user.email : 'Sign in to access more features'}
              </RNText>
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 20 }} />

            {/* Menu Items */}
            <View style={{ flex: 1, paddingTop: 20 }}>
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginHorizontal: 10 }}
                onPress={() => handleNavigation('/')}
              >
                <RNText style={{ fontSize: 24, marginRight: 15 }}>🏠</RNText>
                <RNText style={{ fontSize: 16 }}>Home</RNText>
              </Pressable>

              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginHorizontal: 10 }}
                onPress={() => handleNavigation('/cart')}
              >
                <RNText style={{ fontSize: 24, marginRight: 15 }}>🛒</RNText>
                <RNText style={{ fontSize: 16 }}>Cart</RNText>
              </Pressable>

              {isAuthenticated && (
                <>
                  <Pressable
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginHorizontal: 10 }}
                    onPress={() => handleNavigation('/wishlist')}
                  >
                    <RNText style={{ fontSize: 24, marginRight: 15 }}>❤️</RNText>
                    <RNText style={{ fontSize: 16 }}>Wishlist</RNText>
                  </Pressable>

                  <Pressable
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginHorizontal: 10 }}
                    onPress={() => handleNavigation('/profile')}
                  >
                    <RNText style={{ fontSize: 24, marginRight: 15 }}>👤</RNText>
                    <RNText style={{ fontSize: 16 }}>Profile</RNText>
                  </Pressable>
                </>
              )}

              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', padding: 15, marginHorizontal: 10 }}
                onPress={() => handleNavigation('/help')}
              >
                <RNText style={{ fontSize: 24, marginRight: 15 }}>❓</RNText>
                <RNText style={{ fontSize: 16 }}>Help</RNText>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={{ padding: 20 }}>
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 15,
                  borderRadius: 8,
                  backgroundColor: isAuthenticated ? '#fee2e2' : '#dbeafe',
                }}
                onPress={isAuthenticated ? handleLogout : () => handleNavigation('/(auth)/login')}
              >
                <RNText style={{ fontSize: 20, marginRight: 10 }}>
                  {isAuthenticated ? '🚪' : '🔑'}
                </RNText>
                <RNText style={{ color: isAuthenticated ? '#dc2626' : '#2563eb', fontWeight: '500', fontSize: 16 }}>
                  {isAuthenticated ? 'Logout' : 'Sign In'}
                </RNText>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}