import { apiService } from './apiService';
import { useAuth } from "../store/authStore"; // adjust import path
import { ORDER_URLS } from '@/constants';

// Keep existing interfaces
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  createdOn: string;
  updatedOn?: string;
  isDeleted: boolean;
}

export interface Order {
  id: number;
  status: string;
  userId: string;
  userName: string;
  stripePaymentIntentId?: string;
  items: OrderItem[];
  createdOn: string;
  updatedOn?: string;
  isDeleted: boolean;
}

export interface CreateOrderRequest {
  status: string;
  stripePaymentIntentId?: string | null;
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateOrderStatusRequest {
  status: string;
}

// Order API functions using the new API service
export async function createOrder(items: any[]): Promise<Order> {
  if (!items || items.length === 0) {
    throw new Error('No items provided for order creation');
  }

  // Format the request body according to the API specification
  const orderData: CreateOrderRequest = {
    status: "New",
    stripePaymentIntentId: null,
    items: items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }))
  };


  const response = await apiService.post<Order>(ORDER_URLS.CREATE, orderData, { requiresAuth: true });
  return response;
}

export async function getUserOrders(): Promise<Order[]> {
  const { user } = useAuth.getState();

  if (!user) {
    throw new Error('No user found in auth store');
  }

  // Extract userId from user object - try different possible field names
  const userId = user.id || user.userId || user.sub || user.nameid;
  
  if (!userId) {
    throw new Error('No user ID found in user object');
  }


  const response = await apiService.get<Order[]>(ORDER_URLS.GET_BY_USER_ID(userId), { requiresAuth: true });
  
  // Ensure each order has items array
  const ordersWithItems = response.map((order: any) => ({
    ...order,
    items: order.items || []
  }));
  
  return ordersWithItems;
}

export async function getOrderById(orderId: number): Promise<Order> {
  if (!orderId || isNaN(orderId)) {
    throw new Error('Invalid order ID');
  }


  const response = await apiService.get<Order>(ORDER_URLS.GET_BY_ID(orderId), { requiresAuth: true });
  
  // Ensure order has items array
  const orderWithItems = {
    ...response,
    items: response.items || []
  };
  
  return orderWithItems;
}

export async function updateOrderStatus(orderId: number, status: string): Promise<Order> {
  const updateData: UpdateOrderStatusRequest = { status };
  return await apiService.put<Order>(ORDER_URLS.UPDATE_STATUS(orderId), updateData, { requiresAuth: true });
}

export async function cancelOrder(orderId: number): Promise<void> {
  await apiService.post(ORDER_URLS.CANCEL(orderId), {}, { requiresAuth: true });
}

// Helper functions
export async function getOrdersByStatus(status: string): Promise<Order[]> {
  const orders = await getUserOrders();
  return orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
}

export async function getActiveOrders(): Promise<Order[]> {
  const orders = await getUserOrders();
  return orders.filter(order => !order.isDeleted);
}
