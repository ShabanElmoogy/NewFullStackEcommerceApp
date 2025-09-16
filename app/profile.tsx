import React, { useMemo } from 'react';
import { View, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useColorScheme } from 'nativewind';

import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallbackText } from '@/components/ui/avatar';

import {
  User,
  Edit3,
  Bell,
  ShieldCheck,
  Lock,
  MapPin,
  CreditCard,
  HelpCircle,
  Mail,
  Globe,
  Info,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';

import { useAuth } from '@/store/authStore';
import { useSettings } from '@/store/settingsStore';
import { useLanguageStore } from '@/store/languageStore';
import i18n from '@/utils/i18n';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mt-6">
      <Text className="text-xs font-extrabold text-content-secondary ml-4 mb-2 tracking-wider">
        {title.toUpperCase()}
      </Text>
      <View className="bg-surface-primary border-t border-b border-border-default">
        {children}
      </View>
    </View>
  );
}

function RowItem({
  icon: Icon,
  label,
  value,
  onPress,
  right,
  last,
}: {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <Pressable onPress={onPress} android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
      <HStack
        className={`items-center justify-between px-4 py-3 ${!last ? 'border-b border-border-subtle' : ''}`}
      >
        <HStack className="items-center">
          <Icon className="text-content-primary mr-3" size={20} />
          <Text className="text-base text-content-primary font-semibold">{label}</Text>
          {value ? (
            <Text className="ml-2 text-xs text-content-secondary">{value}</Text>
          ) : null}
        </HStack>
        {right ?? <ChevronRight className="text-content-tertiary" size={18} />}
      </HStack>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuth();
  const { colorScheme } = useColorScheme();
  const {
    orderNotifications,
    promotionNotifications,
    appNotifications,
    setOrderNotifications,
    setPromotionNotifications,
    setAppNotifications,
  } = useSettings();

  const { language, toggleLanguage } = useLanguageStore();
  const t = (key: string) => i18n.t(key);

  const version = useMemo(() => {
    // Expo 53: Constants.expoConfig is available; fallback just in case
    // @ts-ignore
    return Constants?.expoConfig?.version || Constants?.manifest?.version || '1.0.0';
  }, []);

  const displayName = user?.name || user?.username || user?.email || 'User';
  const avatarUrl = user?.avatar || 'https://via.placeholder.com/128';

  const handleSignOut = () => {
    Alert.alert(t('profile.signoutTitle'), t('profile.signoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.signoutBtn'),
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Header */}
        <View className="bg-primary-600 py-6 px-4">
          <HStack className="items-center">
            <Avatar size="xl" className="bg-surface-inverse">
              <AvatarImage source={{ uri: avatarUrl }} />
              <AvatarFallbackText>{displayName?.slice(0, 2)}</AvatarFallbackText>
            </Avatar>
            <View className="ml-4 flex-1">
              <Text className="text-content-inverse text-lg font-extrabold">{displayName}</Text>
              {!!user?.email && (
                <Text className="text-content-tertiary text-sm mt-1">{user.email}</Text>
              )}
              <HStack className="mt-3">
                {isAuthenticated ? (
                  <Pressable
                    onPress={() => router.push('/profile/edit')}
                    className="bg-tertiary-600 px-3 py-2 rounded-lg"
                  >
                    <HStack className="items-center">
                      <Edit3 className="text-content-inverse mr-2" size={16} />
                      <Text className="text-content-inverse font-bold">
                        {t('profile.editProfile')}
                      </Text>
                    </HStack>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => router.push('/login')}
                    className="bg-tertiary-600 px-3 py-2 rounded-lg"
                  >
                    <HStack className="items-center">
                      <User className="text-content-inverse mr-2" size={16} />
                      <Text className="text-content-inverse font-bold">{t('auth.signin')}</Text>
                    </HStack>
                  </Pressable>
                )}
              </HStack>
            </View>
          </HStack>
        </View>

        {/* Preferences */}
        <Section title={t('profile.preferences')}>
          <RowItem
            icon={Globe}
            label={t('profile.language')}
            value={language.toUpperCase()}
            onPress={toggleLanguage}
            last
          />
        </Section>

        {/* Notifications */}
        <Section title={t('profile.notifications')}>
          <RowItem
            icon={Bell}
            label={t('profile.orderNotifications')}
            right={<Switch value={orderNotifications} onValueChange={setOrderNotifications} />}
          />
          <RowItem
            icon={ShieldCheck}
            label={t('profile.promotionNotifications')}
            right={<Switch value={promotionNotifications} onValueChange={setPromotionNotifications} />}
          />
          <RowItem
            icon={Info}
            label={t('profile.appUpdates')}
            right={<Switch value={appNotifications} onValueChange={setAppNotifications} />}
            last
          />
        </Section>

        {/* Account */}
        <Section title={t('profile.account')}>
          <RowItem icon={MapPin} label={t('profile.addresses')} />
          <RowItem icon={CreditCard} label={t('profile.payments')} />
          <RowItem icon={Lock} label={t('profile.changePassword')} onPress={() => router.push('/reset-password')} last />
        </Section>

        {/* Support */}
        <Section title={t('profile.support')}>
          <RowItem icon={HelpCircle} label={t('profile.help')} />
          <RowItem icon={Mail} label={t('profile.contactSupport')} />
          <RowItem icon={FileText} label={t('profile.terms')} />
          <RowItem icon={Shield} label={t('profile.privacy')} last />
        </Section>

        {/* About */}
        <Section title={t('profile.about')}>
          <RowItem icon={Info} label={t('profile.version')} value={String(version)} last />
        </Section>

        {/* Danger Zone */}
        {isAuthenticated && (
          <View className="mt-6 px-4">
            <Pressable
              onPress={handleSignOut}
              android_ripple={{ color: 'rgba(220, 38, 38, 0.1)' }}
              className="bg-feedbackSurface-error rounded-xl"
            >
              <HStack className="items-center p-4">
                <LogOut className="text-feedback-error mr-3" size={20} />
                <Text className="text-feedback-error font-extrabold text-base">{t('profile.signoutBtn')}</Text>
              </HStack>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
