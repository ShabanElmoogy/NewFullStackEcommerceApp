import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ArrowLeft, Package, MapPin, Phone } from 'lucide-react-native';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { getOrderById, Order } from '@/api/orders';
import { OrderStatus } from '@/constants/orderStatus';

export default function OrderTrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!orderId) return;
    
    try {
      setError(null);
      const orderData = await getOrderById(parseInt(orderId));
      setOrder(orderData);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrder();
  };

  const calculateTotal = () => {
    if (!order?.items) return 0;
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-600 text-center mb-4">
            {error || 'Order not found'}
          </Text>
          <Button onPress={() => router.back()}>
            <ButtonText>Go Back</ButtonText>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <HStack className="items-center justify-between">
            <HStack className="items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.back()}
                className="p-2"
              >
                <Icon as={ArrowLeft} size="sm" className="text-gray-600" />
              </Button>
              <VStack>
                <Text className="text-lg font-semibold text-gray-900">
                  Track Order
                </Text>
                <Text className="text-sm text-gray-600">
                  Order #{order.id}
                </Text>
              </VStack>
            </HStack>
          </HStack>
        </View>

        <View className="p-4 space-y-4">
          {/* Order Summary Card */}
          <View className="bg-white rounded-lg p-4">
            <HStack className="items-center justify-between mb-3">
              <HStack className="items-center space-x-2">
                <Icon as={Package} size="sm" className="text-blue-600" />
                <Text className="font-semibold text-gray-900">
                  Order Summary
                </Text>
              </HStack>
              <Text className="text-sm text-gray-600">
                {new Date(order.createdOn).toLocaleDateString()}
              </Text>
            </HStack>

            <VStack className="space-y-2">
              <HStack className="justify-between">
                <Text className="text-gray-600">Items</Text>
                <Text className="font-medium">{order.items.length}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text className="text-gray-600">Total Amount</Text>
                <Text className="font-semibold text-green-600">
                  ${calculateTotal().toFixed(2)}
                </Text>
              </HStack>
              {order.stripePaymentIntentId && (
                <HStack className="justify-between">
                  <Text className="text-gray-600">Payment ID</Text>
                  <Text className="text-xs text-gray-500 font-mono">
                    {order.stripePaymentIntentId.slice(-8)}
                  </Text>
                </HStack>
              )}
            </VStack>
          </View>

          {/* Order Timeline */}
          <OrderTimeline
            currentStatus={order.status as OrderStatus}
            createdDate={order.createdOn}
            updatedDate={order.updatedOn}
          />

          {/* Order Items */}
          <View className="bg-white rounded-lg p-4">
            <Text className="font-semibold text-gray-900 mb-3">
              Order Items
            </Text>
            <VStack className="space-y-3">
              {order.items.map((item) => (
                <View key={item.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <HStack className="justify-between items-start">
                    <VStack className="flex-1">
                      <Text className="font-medium text-gray-900">
                        {item.productName}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </Text>
                    </VStack>
                    <Text className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </HStack>
                </View>
              ))}
            </VStack>
          </View>

          {/* Delivery Information */}
          <View className="bg-white rounded-lg p-4">
            <HStack className="items-center space-x-2 mb-3">
              <Icon as={MapPin} size="sm" className="text-green-600" />
              <Text className="font-semibold text-gray-900">
                Delivery Information
              </Text>
            </HStack>
            <VStack className="space-y-2">
              <Text className="text-gray-600">
                Delivering to: {order.userName}
              </Text>
              <Text className="text-sm text-gray-500">
                We'll notify you when your order is out for delivery
              </Text>
            </VStack>
          </View>

          {/* Support Section */}
          <View className="bg-white rounded-lg p-4">
            <HStack className="items-center space-x-2 mb-3">
              <Icon as={Phone} size="sm" className="text-blue-600" />
              <Text className="font-semibold text-gray-900">
                Need Help?
              </Text>
            </HStack>
            <Text className="text-gray-600 mb-3">
              Have questions about your order? Contact our support team.
            </Text>
            <Button variant="outline" size="sm">
              <ButtonText>Contact Support</ButtonText>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}