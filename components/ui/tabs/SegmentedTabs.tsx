import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';

export type TabItem = {
  key: string;
  label: string;
  icon?: any; // lucide icon component or similar
  iconColor?: string; // custom icon color
  iconBgColor?: string; // custom icon background color
};

interface SegmentedTabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  scrollable?: boolean;
}

export default function SegmentedTabs({ tabs, activeKey, onChange, scrollable = false }: SegmentedTabsProps) {
  const { colors, isDark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const tabRefs = useRef<{ [key: string]: View | null }>({});

  // Auto-scroll to active tab when activeKey changes
  useEffect(() => {
    if (scrollable && scrollViewRef.current && tabRefs.current[activeKey]) {
      const activeTabRef = tabRefs.current[activeKey];
      if (activeTabRef) {
        activeTabRef.measureLayout(
          scrollViewRef.current as any,
          (x, y, width, height) => {
            // Calculate the position to center the active tab
            const scrollToX = Math.max(0, x - 50); // 50px padding from left edge
            scrollViewRef.current?.scrollTo({
              x: scrollToX,
              animated: true,
            });
          },
          () => {
            // Fallback if measureLayout fails
          }
        );
      }
    }
  }, [activeKey, scrollable]);

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
    
    // For active tabs, use theme-based colors (black in light mode, white in dark mode)
    // For inactive tabs, use custom colors or fallback
    const iconColor = isActive 
      ? (isDark ? '#FFFFFF' : '#000000') // White in dark mode, black in light mode
      : (tab.iconColor || colors.textSecondary);
    
    const iconBgColor = isActive 
      ? (tab.iconColor || colors.primary) // Use the original vibrant color as background when active
      : (tab.iconBgColor || colors.textSecondary + '15');
    
    return (
      <View
        key={tab.key}
        ref={(ref) => {
          tabRefs.current[tab.key] = ref;
        }}
      >
        <Pressable
          onPress={() => onChange(tab.key)}
          style={{
            flex: scrollable ? undefined : 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: isActive ? colors.card : 'transparent',
            marginRight: scrollable && index < tabs.length - 1 ? 8 : 0,
            shadowColor: isActive ? colors.shadow : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isActive ? (isDark ? 0.2 : 0.1) : 0,
            shadowRadius: 4,
            elevation: isActive ? 2 : 0,
            minWidth: scrollable ? 120 : undefined,
          }}
        >
        {tab.icon ? (
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: iconBgColor,
                marginRight: 10,
                shadowColor: iconColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isActive ? 0.15 : 0.08,
                shadowRadius: 4,
                elevation: isActive ? 3 : 1,
              }}
            >
              <Icon
                as={tab.icon}
                size="sm"
                style={{
                  color: iconColor,
                }}
              />
            </View>
          ) : null}
          <Text
            style={{
              color: isActive ? (isDark ? '#FFFFFF' : '#000000') : colors.textSecondary,
              fontSize: 14,
              fontWeight: isActive ? '700' : '600',
              textAlign: 'center',
            }}
            numberOfLines={1}
          >
            {tab.label}
          </Text>
        </Pressable>
      </View>
    );
  };

  if (scrollable) {
    return (
      <Container>
        <ScrollView
          ref={scrollViewRef}
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
