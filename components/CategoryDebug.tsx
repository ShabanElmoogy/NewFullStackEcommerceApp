import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from './ui/text';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function CategoryDebug() {
  const { data: productsData } = useProducts();
  const { data: categoriesData } = useCategories();
  
  const products = Array.isArray(productsData) ? productsData : (productsData && productsData.products ? productsData.products : []);
  
  return (
    <View style={{ 
      backgroundColor: '#fff3cd', 
      padding: 16, 
      margin: 16, 
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ffeaa7'
    }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
        🔍 Category Debug Info
      </Text>
      
      <ScrollView style={{ maxHeight: 200 }}>
        <Text style={{ fontSize: 12, marginBottom: 8 }}>
          📊 Categories: {categoriesData?.length || 0}
        </Text>
        
        {categoriesData?.map((cat, index) => (
          <Text key={cat.id} style={{ fontSize: 11, marginBottom: 4 }}>
            • Cat {cat.id}: {cat.nameEn} ({cat.nameAr})
          </Text>
        ))}
        
        <Text style={{ fontSize: 12, marginBottom: 8, marginTop: 8 }}>
          📦 Products: {products?.length || 0}
        </Text>
        
        {products?.slice(0, 3).map((product, index) => (
          <View key={product.id} style={{ marginBottom: 8, padding: 8, backgroundColor: '#f8f9fa' }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
              Product: {product.name}
            </Text>
            <Text style={{ fontSize: 10 }}>
              Category: {JSON.stringify(product.category)}
            </Text>
            <Text style={{ fontSize: 10 }}>
              Category Type: {typeof product.category}
            </Text>
            {typeof product.category === 'object' && product.category && (
              <Text style={{ fontSize: 10 }}>
                Category ID: {product.category.id}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}