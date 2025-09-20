import React, { useEffect } from 'react';
import {
  ScrollView,
  View,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import {
  Package,
  Calendar,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
} from 'lucide-react-native';
import { useUserOrders } from '@/hooks/useOrders';
import { useAuth } from '@/store/authStore';
import { Order, OrderItem } from '@/api/orders';
import { useOrdersFilter } from '@/hooks/useOrdersFilter';
import { OrdersFilter, OrdersSearch } from '@/components/orders';
import { ORDER_STATUS } from '@/constants/orderStatus';

// Status color mapping
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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate total price
const calculateTotal = (items: OrderItem[] | undefined) => {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  
  return items.reduce((total, item) => {
    const itemTotal = (item.price || 0) * (item.quantity || 0);
    return total + itemTotal;
  }, 0);
};

// Order Item Component
const OrderItemCard = ({ item }: { item: OrderItem }) => (
  <HStack style={{ alignItems: 'center', paddingVertical: 8 }}>
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Package color="#6B7280" size={24} />
    </View>
    <VStack style={{ flex: 1 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 2 }}>
        {item.productName}
      </Text>
      <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
        Qty: {item.quantity} × ${item.price.toFixed(2)}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </VStack>
  </HStack>
);

// Order Card Component
const OrderCard = ({ order }: { order: Order }) => {
  const statusConfig = getStatusColor(order.status);
  const StatusIcon = statusConfig.icon;
  const total = calculateTotal(order.items);

  return (
    <Pressable
      onPress={() => router.push(`/order/${order.id}`)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      {/* Header */}
      <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <VStack>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 2 }}>
            Order #{order.id}
          </Text>
          <HStack style={{ alignItems: 'center' }}>
            <Calendar color="#6B7280" size={14} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              {formatDate(order.createdOn)}
            </Text>
          </HStack>
        </VStack>
        
        <Badge style={{ backgroundColor: statusConfig.bg }}>
          <HStack style={{ alignItems: 'center' }}>
            <StatusIcon color={statusConfig.text} size={14} style={{ marginRight: 4 }} />
            <BadgeText style={{ color: statusConfig.text, fontSize: 12, fontWeight: '700' }}>
              {order.status}
            </BadgeText>
          </HStack>
        </Badge>
      </HStack>

      {/* Order Items */}
      <VStack style={{ marginBottom: 12 }}>
        {order.items && order.items.length > 0 ? (
          <>
            {order.items.slice(0, 2).map((item, index) => (
              <OrderItemCard key={index} item={item} />
            ))}
            {order.items.length > 2 && (
              <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center', marginTop: 8 }}>
                +{order.items.length - 2} more items
              </Text>
            )}
          </>
        ) : (
          <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center', fontStyle: 'italic' }}>
            No items found
          </Text>
        )}
      </VStack>

      {/* Footer */}
      <HStack style={{ justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <VStack>
          <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Total Amount</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>
            ${total.toFixed(2)}
          </Text>
        </VStack>
        
        <HStack style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#3B82F6', marginRight: 4 }}>
            View Details
          </Text>
          <ChevronRight color="#3B82F6" size={16} />
        </HStack>
      </HStack>
    </Pressable>
  );
};

// Empty State Component
const EmptyState = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
    <ShoppingBag color="#9CA3AF" size={80} style={{ marginBottom: 16 }} />
    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
      No Orders Yet
    </Text>
    <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
      Start shopping to see your orders here
    </Text>
    <Button onPress={() => router.push('/products')} style={{ paddingHorizontal: 24 }}>
      <ButtonText>Start Shopping</ButtonText>
    </Button>
  </View>
);

// Main Orders Screen
export default function OrdersScreen() {
  const { user, isAuthenticated } = useAuth();
  const { data: orders, isLoading, error, refetch } = useUserOrders();
  const params = useLocalSearchParams();
  
  // Filter and search functionality
  const {
    filters,
    setFilters,
    filteredOrders,
    filteredCount,
    totalCount,
    searchQuery,
    setSearchQuery,
    hasActiveFilters,
  } = useOrdersFilter(orders);

  // Handle URL parameters to auto-filter for non-received orders
  useEffect(() => {
    if (params.filter === 'non-received') {
      // Set filter to show only non-received orders
      const nonReceivedStatuses = [
        ORDER_STATUS.NEW,
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.SHIPPED,
        ORDER_STATUS.OUT_FOR_DELIVERY,
      ];
      
      setFilters(prev => ({
        ...prev,
        status: nonReceivedStatuses,
      }));
    }
  }, [params.filter, setFilters]);

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16, textAlign: 'center' }}>
          Please sign in to view your orders
        </Text>
        <Button onPress={() => router.push('/login')}>
          <ButtonText>Sign In</ButtonText>
        </Button>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 16 }}>Loading your orders...</Text>
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
        <Button onPress={() => refetch()}>
          <ButtonText>Try Again</ButtonText>
        </Button>
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return <EmptyState />;
  }

  // Show empty state if no filtered results
  if (filteredOrders.length === 0 && (hasActiveFilters || searchQuery.trim())) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F9FAFB' }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 }}>
            My Orders
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>
            {totalCount} total order{totalCount !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Search */}
        <OrdersSearch
          onSearchChange={setSearchQuery}
          value={searchQuery}
        />

        {/* Filter */}
        <OrdersFilter
          onFilterChange={setFilters}
          activeFilters={filters}
          orderCount={filteredCount}
        />

        {/* No Results */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingTop: 60 }}>
          <Package color="#9CA3AF" size={80} style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
            No Orders Found
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
            {searchQuery.trim() 
              ? `No orders match "${searchQuery}"`
              : "No orders match your current filters"
            }
          </Text>
          <Button 
            onPress={() => {
              setSearchQuery('');
              setFilters({
                status: [],
                dateRange: 'all',
                sortBy: 'newest',
              });
            }} 
            style={{ paddingHorizontal: 24 }}
          >
            <ButtonText>Clear Filters</ButtonText>
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 }}>
          {params.filter === 'non-received' ? 'Track Your Orders' : 'My Orders'}
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280' }}>
          {params.filter === 'non-received' 
            ? `${filteredCount} pending order${filteredCount !== 1 ? 's' : ''}`
            : `${filteredCount} of ${totalCount} order${totalCount !== 1 ? 's' : ''}${hasActiveFilters || searchQuery.trim() ? ' (filtered)' : ''}`
          }
        </Text>
      </View>

      {/* Search */}
      <OrdersSearch
        onSearchChange={setSearchQuery}
        value={searchQuery}
      />

      {/* Filter */}
      <OrdersFilter
        onFilterChange={setFilters}
        activeFilters={filters}
        orderCount={filteredCount}
      />

      {/* Orders List */}
      {filteredOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}

      {/* Bottom Spacer */}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}
