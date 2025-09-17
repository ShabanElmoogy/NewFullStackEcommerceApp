import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';

export type TabItem = {
  key: string;
  label: string;
  icon?: any; // lucide icon component or similar
};

interface SegmentedTabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  scrollable?: boolean;
}

export default function SegmentedTabs({ tabs, activeKey, onChange, scrollable = false }: SegmentedTabsProps) {
  const { colors, isDark } = useTheme();

  const Container = ({ children }: { children: React.ReactNode }) => (
    <View
      style={{
        backgroundColor: colors.surfaceSecondary,
        borderRadius: 12,
        padding: 4,
      }}
    >
      {children}
    </View>
  );

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = activeKey === tab.key;
    return (
      <Pressable
        key={tab.key}
        onPress={() => onChange(tab.key)}
        style={{
          flex: scrollable ? undefined : 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 8,
          backgroundColor: isActive ? colors.card : 'transparent',
          marginRight: scrollable && index < tabs.length - 1 ? 6 : 0,
          shadowColor: isActive ? colors.shadow : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isActive ? (isDark ? 0.2 : 0.1) : 0,
          shadowRadius: 4,
          elevation: isActive ? 2 : 0,
        }}
      >
        {tab.icon ? (
          <Icon
            as={tab.icon}
            size="sm"
            style={{
              color: isActive ? colors.primary : colors.textSecondary,
              marginRight: 8,
            }}
          />
        ) : null}
        <Text
          style={{
            color: isActive ? colors.primary : colors.textSecondary,
            fontSize: 14,
            fontWeight: isActive ? '700' : '500',
          }}
          numberOfLines={1}
        >
          {tab.label}
        </Text>
      </Pressable>
    );
  };

  if (scrollable) {
    return (
      <Container>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
        >
          {tabs.map(renderTab)}
        </ScrollView>
      </Container>
    );
  }

  return (
    <Container>
      <View style={{ flexDirection: 'row' }}>
        {tabs.map(renderTab)}
      </View>
    </Container>
  );
}
