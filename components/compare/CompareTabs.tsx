import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { TrendingUp, Info, Check } from 'lucide-react-native';

export interface CompareTabsProps {
  activeTab: 'overview' | 'specs' | 'features';
  onChange: (k: 'overview' | 'specs' | 'features') => void;
}

export function CompareTabs({ activeTab, onChange }: CompareTabsProps) {
  const { colors, isDark } = useTheme();
  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: TrendingUp },
    { key: 'specs' as const, label: 'Specifications', icon: Info },
    { key: 'features' as const, label: 'Features', icon: Check },
  ];
  return (
    <View className="px-4 pb-3">
      <View
        className="flex-row rounded-xl p-1"
        style={{ backgroundColor: colors.surfaceSecondary }}
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              className="flex-1 flex-row items-center justify-center py-3 px-3 rounded-lg"
              style={{
                backgroundColor: selected ? colors.card : 'transparent',
                shadowColor: selected ? colors.shadow : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: selected ? (isDark ? 0.2 : 0.1) : 0,
                shadowRadius: 4,
                elevation: selected ? 2 : 0,
              }}
            >
              <Icon
                as={tab.icon}
                size="sm"
                style={{ color: selected ? colors.primary : colors.textSecondary, marginRight: 8 }}
              />
              <Text
                className={selected ? 'font-bold' : 'font-medium'}
                style={{ color: selected ? colors.primary : colors.textSecondary, fontSize: 14 }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default CompareTabs;
