import React from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import ProductCard from '../productCard/ProductCard';
import { useTheme } from '@/hooks/useTheme';

interface ProductsListProps {
  products: any[];
  viewMode: 'grid' | 'list';
  numColumns: number;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function ProductsList({
  products,
  viewMode,
  numColumns,
  refreshing,
  onRefresh,
}: ProductsListProps) {
  const { colors } = useTheme();

  return (
    <FlatList
      data={products}
      key={`${viewMode}-${numColumns}`} // 🔑 ensures remount
      numColumns={numColumns}
      keyExtractor={(item, i) => `${viewMode}-${item.id ?? i}`}
      renderItem={({ item }) => <ProductCard product={item} viewMode={viewMode} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
      columnWrapperStyle={numColumns > 1 ? { gap: 16 } : undefined}
      ItemSeparatorComponent={() => <View className="h-4" />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={false}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={6}
      className="flex-1"
    />
  );
}