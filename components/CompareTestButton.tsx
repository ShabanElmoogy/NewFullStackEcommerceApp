import React from 'react';
import { View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { useCompareStore } from '@/store/compareStore';
import { useToast } from '@/components/ui/toast';
import { CustomToast } from './CustomToast';

// Test component to add sample products for comparison testing
export default function CompareTestButton() {
  const { addToCompare, clearCompare, getCompareCount } = useCompareStore();
  const toast = useToast();

  const sampleProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 999,
      image: "https://via.placeholder.com/300x300?text=iPhone+15+Pro",
      description: "Latest iPhone with A17 Pro chip",
      rating: 4.8,
      reviewCount: 1250,
      discount: 10,
      isNew: true,
      stock: 15,
      brand: "Apple",
      category: "Smartphones",
      specifications: {
        "Display": "6.1-inch Super Retina XDR",
        "Processor": "A17 Pro chip",
        "Storage": "128GB",
        "Camera": "48MP Main + 12MP Ultra Wide",
        "Battery": "Up to 23 hours video playback",
        "OS": "iOS 17"
      },
      features: ["Face ID", "Wireless Charging", "Water Resistant", "5G", "MagSafe"]
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: 1199,
      image: "https://via.placeholder.com/300x300?text=Galaxy+S24+Ultra",
      description: "Premium Android flagship with S Pen",
      rating: 4.7,
      reviewCount: 980,
      discount: 15,
      isTrending: true,
      stock: 8,
      brand: "Samsung",
      category: "Smartphones",
      specifications: {
        "Display": "6.8-inch Dynamic AMOLED 2X",
        "Processor": "Snapdragon 8 Gen 3",
        "Storage": "256GB",
        "Camera": "200MP Main + 50MP Periscope",
        "Battery": "5000mAh",
        "OS": "Android 14"
      },
      features: ["S Pen", "Wireless Charging", "Water Resistant", "5G", "DeX Mode"]
    },
    {
      id: 3,
      name: "Google Pixel 8 Pro",
      price: 899,
      image: "https://via.placeholder.com/300x300?text=Pixel+8+Pro",
      description: "AI-powered photography flagship",
      rating: 4.6,
      reviewCount: 750,
      stock: 12,
      brand: "Google",
      category: "Smartphones",
      specifications: {
        "Display": "6.7-inch LTPO OLED",
        "Processor": "Google Tensor G3",
        "Storage": "128GB",
        "Camera": "50MP Main + 48MP Ultra Wide",
        "Battery": "5050mAh",
        "OS": "Android 14"
      },
      features: ["Magic Eraser", "Wireless Charging", "Water Resistant", "5G", "Pure Android"]
    }
  ];

  const addSampleProducts = () => {
    sampleProducts.forEach(product => {
      addToCompare(product);
    });
    
    toast.show({
      placement: "bottom",
      duration: 3000,
      render: ({ id }) => (
        <CustomToast 
          id={id} 
          message={`Added ${sampleProducts.length} sample products for comparison testing!`}
        />
      ),
    });
  };

  const clearAllProducts = () => {
    clearCompare();
    toast.show({
      placement: "bottom",
      duration: 2000,
      render: ({ id }) => (
        <CustomToast 
          id={id} 
          message="Cleared all products from comparison"
        />
      ),
    });
  };

  const compareCount = getCompareCount();

  return (
    <VStack className="p-4" space="sm">
      <Button onPress={addSampleProducts} className="bg-blue-500">
        <ButtonText className="text-white">Add Sample Products ({compareCount}/4)</ButtonText>
      </Button>
      
      {compareCount > 0 && (
        <Button onPress={clearAllProducts} className="bg-red-500">
          <ButtonText className="text-white">Clear All Products</ButtonText>
        </Button>
      )}
    </VStack>
  );
}