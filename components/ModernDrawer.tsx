import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/authStore';

export function ModernDrawerContent(props: any) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleNavigation = (route: string) => {
    props.navigation.closeDrawer();
    router.push(route);
  };

  const handleLogout = () => {
    logout();
    props.navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
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
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <DrawerItem
          label="Home"
          icon={() => <Text style={styles.menuIcon}>🏠</Text>}
          onPress={() => handleNavigation('/')}
          labelStyle={styles.menuText}
        />
        
        <DrawerItem
          label="Cart"
          icon={() => <Text style={styles.menuIcon}>🛒</Text>}
          onPress={() => handleNavigation('/cart')}
          labelStyle={styles.menuText}
        />

        {isAuthenticated && (
          <>
            <DrawerItem
              label="Wishlist"
              icon={() => <Text style={styles.menuIcon}>❤️</Text>}
              onPress={() => handleNavigation('/wishlist')}
              labelStyle={styles.menuText}
            />
            
            <DrawerItem
              label="Profile"
              icon={() => <Text style={styles.menuIcon}>👤</Text>}
              onPress={() => handleNavigation('/profile')}
              labelStyle={styles.menuText}
            />
          </>
        )}

        <DrawerItem
          label="Help"
          icon={() => <Text style={styles.menuIcon}>❓</Text>}
          onPress={() => handleNavigation('/help')}
          labelStyle={styles.menuText}
        />
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.footerButton, { backgroundColor: isAuthenticated ? '#fee2e2' : '#dbeafe' }]}
          onPress={isAuthenticated ? handleLogout : () => handleNavigation('/(auth)/login')}
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e9ecef',
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
  },
  scrollContent: {
    paddingTop: 10,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
    marginLeft: -16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
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