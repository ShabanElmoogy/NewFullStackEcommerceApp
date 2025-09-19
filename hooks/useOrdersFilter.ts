import { useState, useMemo } from 'react';
import { Order } from '@/api/orders';
import { FilterOptions } from '@/components/orders/OrdersFilter';

export function useOrdersFilter(orders: Order[] | undefined) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    dateRange: 'all',
    sortBy: 'newest',
  });
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    let filtered = [...orders];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(order => {
        // Search by order ID
        if (order.id.toString().includes(query)) return true;
        
        // Search by order status
        if (order.status.toLowerCase().includes(query)) return true;
        
        // Search by user name
        if (order.userName?.toLowerCase().includes(query)) return true;
        
        // Search by product names in items
        if (order.items && order.items.some(item => 
          item.productName?.toLowerCase().includes(query)
        )) return true;
        
        return false;
      });
    }

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter(order => 
        filters.status.includes(order.status)
      );
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdOn);
        
        switch (filters.dateRange) {
          case 'today':
            return orderDate >= today;
          
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return orderDate >= weekAgo;
          
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            return orderDate >= monthAgo;
          
          case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(today.getFullYear() - 1);
            return orderDate >= yearAgo;
          
          case 'custom':
            if (filters.customDateStart && filters.customDateEnd) {
              return orderDate >= filters.customDateStart && orderDate <= filters.customDateEnd;
            }
            return true;
          
          default:
            return true;
        }
      });
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
        
        case 'oldest':
          return new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime();
        
        case 'amount_high':
          const totalA = calculateOrderTotal(a);
          const totalB = calculateOrderTotal(b);
          return totalB - totalA;
        
        case 'amount_low':
          const totalA2 = calculateOrderTotal(a);
          const totalB2 = calculateOrderTotal(b);
          return totalA2 - totalB2;
        
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, filters, searchQuery]);

  const calculateOrderTotal = (order: Order): number => {
    if (!order.items || !Array.isArray(order.items)) {
      return 0;
    }
    
    return order.items.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
  };

  const getFilterSummary = () => {
    const activeFilters: string[] = [];
    
    if (filters.status.length > 0) {
      if (filters.status.length === 1) {
        activeFilters.push(`Status: ${filters.status[0]}`);
      } else {
        activeFilters.push(`${filters.status.length} statuses`);
      }
    }
    
    if (filters.dateRange !== 'all') {
      const dateLabels = {
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
        year: 'This Year',
        custom: 'Custom Range'
      };
      activeFilters.push(dateLabels[filters.dateRange]);
    }
    
    if (filters.sortBy !== 'newest') {
      const sortLabels = {
        oldest: 'Oldest First',
        amount_high: 'Amount: High to Low',
        amount_low: 'Amount: Low to High',
        newest: 'Newest First'
      };
      activeFilters.push(`Sort: ${sortLabels[filters.sortBy]}`);
    }
    
    return activeFilters;
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      dateRange: 'all',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = () => {
    return filters.status.length > 0 || 
           filters.dateRange !== 'all' || 
           filters.sortBy !== 'newest';
  };

  return {
    filters,
    setFilters,
    filteredOrders: filteredAndSortedOrders,
    filterSummary: getFilterSummary(),
    clearFilters,
    hasActiveFilters: hasActiveFilters(),
    totalCount: orders?.length || 0,
    filteredCount: filteredAndSortedOrders.length,
    searchQuery,
    setSearchQuery,
  };
}
