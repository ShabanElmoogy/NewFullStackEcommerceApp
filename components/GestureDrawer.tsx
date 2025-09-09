import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/authStore';

interface GestureDrawerContentProps {
  onNavigate: (route: string) => void;
}

export function GestureDrawerContent({ onNavigate }: GestureDrawerContentProps) {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {isAuthenticated && user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
          </Text>
        </View>
        <Text style={styles.userName}>
          {isAuthenticated && user?.name ? user.name : 'Guest User'}
        </Text>
        <Text style={styles.userEmail}>
          {isAuthenticated && user?.email ? user.email : 'Sign in to access more features'}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <Pressable style={styles.menuItem} onPress={() => onNavigate('/')}>
          <Text style={styles.menuIcon}>🏠</Text>
          <Text style={styles.menuText}>Home</Text>
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => onNavigate('/cart')}>
          <Text style={styles.menuIcon}>🛒</Text>
          <Text style={styles.menuText}>Cart</Text>
        </Pressable>

        {isAuthenticated && (
          <>
            <Pressable style={styles.menuItem} onPress={() => onNavigate('/wishlist')}>
              <Text style={styles.menuIcon}>❤️</Text>
              <Text style={styles.menuText}>Wishlist</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={() => onNavigate('/profile')}>
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={styles.menuText}>Profile</Text>
            </Pressable>
          </>
        )}

        <Pressable style={styles.menuItem} onPress={() => onNavigate('/help')}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.footerButton, { backgroundColor: isAuthenticated ? '#fee2e2' : '#dbeafe' }]}
          onPress={isAuthenticated ? handleLogout : () => onNavigate('/(auth)/login')}
        >
          <Text style={styles.footerIcon}>
            {isAuthenticated ? '🚪' : '🔑'}
          </Text>
          <Text style={[styles.footerText, { color: isAuthenticated ? '#dc2626' : '#2563eb' }]}>
            {isAuthenticated ? 'Logout' : 'Sign In'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: 'white',
    width: 270,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginHorizontal: 20,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  footer: {
    padding: 20,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  footerIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  footerText: {
    fontWeight: '500',
    fontSize: 16,
  },
});