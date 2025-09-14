import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Image,
  Pressable,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Copy,
  ShoppingCart,
  Heart,
  RotateCcw,
  CheckSquare,
  Square,
  Eye,
} from 'lucide-react-native';
import { useUserOrders } from '@/hooks/useOrders';
import { OrderItem } from '@/api/orders';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { SafeToast } from '@/components/SafeToast';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { OrderStatus } from '@/constants/orderStatus';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContent,
  AccordionContentText,
  AccordionIcon,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Status color mapping (same as orders screen)
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'new':
    case 'pending':
      return { bg: '#FEF3C7', text: '#92400E', icon: Clock };
    case 'processing':
      return { bg: '#DBEAFE', text: '#1E40AF', icon: Package };
    case 'shipped':
      return { bg: '#E0E7FF', text: '#3730A3', icon: Truck };
    case 'delivered':
      return { bg: '#D1FAE5', text: '#065F46', icon: CheckCircle };
    case 'cancelled':
      return { bg: '#FEE2E2', text: '#991B1B', icon: AlertCircle };
    default:
      return { bg: '#F3F4F6', text: '#374151', icon: Package };
  }
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate totals
const calculateSubtotal = (items: OrderItem[] | undefined) => {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  
  return items.reduce((total, item) => {
    const itemTotal = (item.price || 0) * (item.quantity || 0);
    return total + itemTotal;
  }, 0);
};

// Order Item Component
const OrderItemDetail = ({ 
  item, 
  selectionMode, 
  isSelected, 
  onToggleSelect 
}: { 
  item: OrderItem;
  selectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
}) => (
  <Pressable
    onPress={selectionMode ? onToggleSelect : undefined}
    style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: selectionMode && isSelected ? 2 : 1,
      borderColor: selectionMode && isSelected ? '#3B82F6' : '#E5E7EB',
    }}
  >
    <HStack style={{ alignItems: 'center' }}>
      {selectionMode && (
        <Pressable onPress={onToggleSelect} style={{ marginRight: 12, padding: 4 }}>
          {isSelected ? (
            <CheckSquare color="#3B82F6" size={24} />
          ) : (
            <Square color="#6B7280" size={24} />
          )}
        </Pressable>
      )}
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 12,
          marginRight: 16,
          backgroundColor: '#F3F4F6',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Package color="#6B7280" size={32} />
      </View>
      <VStack style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
          {item.productName}
        </Text>
        <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
          Product ID: {item.productId}
        </Text>
        <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <VStack>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              ${item.price.toFixed(2)} × {item.quantity}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  </Pressable>
);

// Info Card Component
const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    }}
  >
    <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 16 }}>
      {title}
    </Text>
    {children}
  </View>
);

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const orderId = parseInt(id as string);
  
  // State for item selection
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  
  // Store hooks
  const addToCart = useCart((state) => state.addProduct);
  const addToWishlist = useWishlist((state) => state.addProduct);
  const toast = useToast();
  
  // Use the orders list query to get all orders, then find the specific one
  const { data: orders, isLoading, error } = useUserOrders();
  
  // Find the specific order from the orders list
  const order = orders?.find(o => o.id === orderId);

  // Handle back navigation
  const handleGoBack = () => {
    router.replace('/orders');
  };

  // Helper functions
  const toggleItemSelection = (itemId: number) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const selectAllItems = () => {
    if (!order?.items) return;
    const allItemIds = new Set(order.items.map(item => item.id));
    setSelectedItems(allItemIds);
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const getSelectedOrderItems = () => {
    if (!order?.items) return [];
    return order.items.filter(item => selectedItems.has(item.id));
  };

  const convertOrderItemToProduct = (orderItem: OrderItem) => ({
    id: orderItem.productId,
    name: orderItem.productName,
    price: orderItem.price,
    image: undefined, // Order items don't have images
  });

  const handleRepeatOrder = () => {
    const itemsToAdd = selectionMode && selectedItems.size > 0 
      ? getSelectedOrderItems() 
      : order?.items || [];

    if (itemsToAdd.length === 0) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <SafeToast placement="top">
            <View style={{ backgroundColor: '#FEE2E2', padding: 16, borderRadius: 8 }}>
              <Text style={{ color: '#991B1B', fontWeight: '600' }}>
                No items selected to add to cart
              </Text>
            </View>
          </SafeToast>
        ),
      });
      return;
    }

    itemsToAdd.forEach(orderItem => {
      const product = convertOrderItemToProduct(orderItem);
      // Add the item multiple times based on original quantity
      for (let i = 0; i < orderItem.quantity; i++) {
        addToCart(product);
      }
    });

    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <SafeToast placement="top">
          <View style={{ backgroundColor: '#D1FAE5', padding: 16, borderRadius: 8 }}>
            <Text style={{ color: '#065F46', fontWeight: '600' }}>
              {itemsToAdd.length} item{itemsToAdd.length !== 1 ? 's' : ''} added to cart! 🛒
            </Text>
          </View>
        </SafeToast>
      ),
    });

    // Exit selection mode and clear selection
    setSelectionMode(false);
    clearSelection();
  };

  const handleAddToWishlist = () => {
    const itemsToAdd = selectionMode && selectedItems.size > 0 
      ? getSelectedOrderItems() 
      : order?.items || [];

    if (itemsToAdd.length === 0) {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <SafeToast placement="top">
            <View style={{ backgroundColor: '#FEE2E2', padding: 16, borderRadius: 8 }}>
              <Text style={{ color: '#991B1B', fontWeight: '600' }}>
                No items selected to add to wishlist
              </Text>
            </View>
          </SafeToast>
        ),
      });
      return;
    }

    itemsToAdd.forEach(orderItem => {
      const product = convertOrderItemToProduct(orderItem);
      addToWishlist(product);
    });

    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <SafeToast placement="top">
          <View style={{ backgroundColor: '#FEF3C7', padding: 16, borderRadius: 8 }}>
            <Text style={{ color: '#92400E', fontWeight: '600' }}>
              {itemsToAdd.length} item{itemsToAdd.length !== 1 ? 's' : ''} added to wishlist! ❤️
            </Text>
          </View>
        </SafeToast>
      ),
    });

    // Exit selection mode and clear selection
    setSelectionMode(false);
    clearSelection();
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      clearSelection();
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 16 }}>Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <AlertCircle color="#EF4444" size={60} style={{ marginBottom: 16 }} />
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
          Failed to load orders
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
          {error.message}
        </Text>
        <Button onPress={handleGoBack}>
          <ButtonText>Go Back</ButtonText>
        </Button>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <AlertCircle color="#EF4444" size={60} style={{ marginBottom: 16 }} />
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
          Order not found
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
          The order you are looking for does not exist or has been removed.
        </Text>
        <Button onPress={handleGoBack}>
          <ButtonText>Go Back</ButtonText>
        </Button>
      </View>
    );
  }

  const statusConfig = getStatusColor(order.status);
  const StatusIcon = statusConfig.icon;
  const subtotal = calculateSubtotal(order.items);
  const tax = subtotal * 0.1; // Assuming 10% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['bottom']}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        <HStack style={{ alignItems: 'center', marginBottom: 16 }}>
          <Pressable onPress={handleGoBack} style={{ marginRight: 16, padding: 8 }}>
            <ArrowLeft color="#111827" size={24} />
          </Pressable>
          <VStack style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827' }}>
              Order #{order.id}
            </Text>
            <HStack style={{ alignItems: 'center', marginTop: 4 }}>
              <Calendar color="#6B7280" size={16} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 14, color: '#6B7280' }}>
                {formatDate(order.createdOn)}
              </Text>
            </HStack>
          </VStack>
          <Badge style={{ backgroundColor: statusConfig.bg }}>
            <HStack style={{ alignItems: 'center' }}>
              <StatusIcon color={statusConfig.text} size={16} style={{ marginRight: 6 }} />
              <BadgeText style={{ color: statusConfig.text, fontSize: 14, fontWeight: '700' }}>
                {order.status}
              </BadgeText>
            </HStack>
          </Badge>
        </HStack>
      </View>

      {/* Collapsible Sections */}
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Accordion
          type="multiple"
          defaultValue={['tracking', 'details']}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#E5E7EB',
          }}
        >
          {/* Order Tracking Section */}
          <AccordionItem value="tracking">
            <AccordionHeader>
              <AccordionTrigger>
                <HStack style={{ alignItems: 'center', flex: 1 }}>
                  <Truck color="#3B82F6" size={20} style={{ marginRight: 12 }} />
                  <AccordionTitleText style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                    Order Tracking
                  </AccordionTitleText>
                </HStack>
                <AccordionIcon as={ChevronDown} />
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <View style={{ paddingHorizontal: 4, paddingBottom: 8 }}>
                <OrderTimeline
                  currentStatus={order.status as OrderStatus}
                  createdDate={order.createdOn}
                  updatedDate={order.updatedOn}
                />
              </View>
            </AccordionContent>
          </AccordionItem>

          {/* Order Details Section */}
          <AccordionItem value="details">
            <AccordionHeader>
              <AccordionTrigger>
                <HStack style={{ alignItems: 'center', flex: 1 }}>
                  <Package color="#3B82F6" size={20} style={{ marginRight: 12 }} />
                  <AccordionTitleText style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                    Order Details
                  </AccordionTitleText>
                </HStack>
                <AccordionIcon as={ChevronDown} />
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <VStack style={{ gap: 20, paddingHorizontal: 4, paddingBottom: 8 }}>
                {/* Order Items */}
                <VStack style={{ gap: 16 }}>
                  <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                      Items ({order.items?.length || 0})
                    </Text>
                    {order.items && order.items.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={toggleSelectionMode}
                      >
                        <ButtonText style={{ fontSize: 12 }}>
                          {selectionMode ? 'Cancel' : 'Select'}
                        </ButtonText>
                      </Button>
                    )}
                  </HStack>

                  {selectionMode && order.items && order.items.length > 0 && (
                    <HStack style={{ gap: 8 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={selectAllItems}
                        style={{ flex: 1 }}
                      >
                        <ButtonText style={{ fontSize: 12 }}>Select All</ButtonText>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={clearSelection}
                        style={{ flex: 1 }}
                      >
                        <ButtonText style={{ fontSize: 12 }}>Clear All</ButtonText>
                      </Button>
                    </HStack>
                  )}

                  {selectionMode && selectedItems.size > 0 && (
                    <View style={{ 
                      backgroundColor: '#EBF8FF', 
                      padding: 12, 
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#3B82F6'
                    }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E40AF', textAlign: 'center' }}>
                        {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                      </Text>
                    </View>
                  )}

                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <OrderItemDetail 
                        key={index} 
                        item={item}
                        selectionMode={selectionMode}
                        isSelected={selectedItems.has(item.id)}
                        onToggleSelect={() => toggleItemSelection(item.id)}
                      />
                    ))
                  ) : (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, color: '#6B7280', fontStyle: 'italic' }}>
                        No items found in this order
                      </Text>
                    </View>
                  )}
                </VStack>

                {/* Order Summary */}
                <VStack style={{ gap: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                    Order Summary
                  </Text>
                  <VStack style={{ gap: 8 }}>
                    <HStack style={{ justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, color: '#6B7280' }}>Subtotal</Text>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                        ${subtotal.toFixed(2)}
                      </Text>
                    </HStack>
                    <HStack style={{ justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, color: '#6B7280' }}>Tax</Text>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                        ${tax.toFixed(2)}
                      </Text>
                    </HStack>
                    <HStack style={{ justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, color: '#6B7280' }}>Shipping</Text>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                        {shipping === 0 ? 'Free' : `${shipping.toFixed(2)}`}
                      </Text>
                    </HStack>
                    <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }} />
                    <HStack style={{ justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827' }}>Total</Text>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827' }}>
                        ${total.toFixed(2)}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>

                {/* Customer Information */}
                <VStack style={{ gap: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                    Customer Information
                  </Text>
                  <HStack style={{ alignItems: 'center' }}>
                    <User color="#6B7280" size={20} style={{ marginRight: 12 }} />
                    <VStack>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                        {order.userName}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>
                        User ID: {order.userId}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>

                {/* Payment Information */}
                {order.stripePaymentIntentId && order.stripePaymentIntentId !== 'string' && (
                  <VStack style={{ gap: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                      Payment Information
                    </Text>
                    <HStack style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      <HStack style={{ alignItems: 'center' }}>
                        <CreditCard color="#6B7280" size={20} style={{ marginRight: 12 }} />
                        <VStack>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                            Payment ID
                          </Text>
                          <Text style={{ fontSize: 12, color: '#6B7280', fontFamily: 'monospace' }}>
                            {order.stripePaymentIntentId.substring(0, 20)}...
                          </Text>
                        </VStack>
                      </HStack>
                      <Pressable style={{ padding: 8 }}>
                        <Copy color="#6B7280" size={16} />
                      </Pressable>
                    </HStack>
                  </VStack>
                )}

                {/* Order Actions */}
                {order.items && order.items.length > 0 && (
                  <VStack style={{ gap: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                      Order Actions
                    </Text>
                    <VStack style={{ gap: 12 }}>
                      <Button
                        onPress={handleRepeatOrder}
                        style={{ backgroundColor: '#3B82F6' }}
                      >
                        <HStack style={{ alignItems: 'center', gap: 8 }}>
                          <RotateCcw color="#FFFFFF" size={20} />
                          <ButtonText style={{ color: '#FFFFFF' }}>
                            {selectionMode && selectedItems.size > 0 
                              ? `Repeat Selected Items (${selectedItems.size})` 
                              : 'Repeat Entire Order'}
                          </ButtonText>
                        </HStack>
                      </Button>
                      
                      <Button
                        variant="outline"
                        onPress={handleAddToWishlist}
                        style={{ borderColor: '#EC4899' }}
                      >
                        <HStack style={{ alignItems: 'center', gap: 8 }}>
                          <Heart color="#EC4899" size={20} />
                          <ButtonText style={{ color: '#EC4899' }}>
                            {selectionMode && selectedItems.size > 0 
                              ? `Add Selected to Wishlist (${selectedItems.size})` 
                              : 'Add All to Wishlist'}
                          </ButtonText>
                        </HStack>
                      </Button>
                    </VStack>
                  </VStack>
                )}
              </VStack>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>

      {/* General Actions */}
      <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
        <Button
          onPress={() => router.push('/products')}
          style={{ marginBottom: 12 }}
        >
          <ButtonText>Continue Shopping</ButtonText>
        </Button>
        
        {order.status.toLowerCase() === 'delivered' && (
          <Button variant="outline">
            <ButtonText>Leave a Review</ButtonText>
          </Button>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}