import { useAuth } from "../store/authStore"; // adjust import path

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

export async function createOrder(items: any[]) {
  const token = useAuth.getState().token;

  if (!token) {
    throw new Error('No authentication token found');
  }

  if (!items || items.length === 0) {
    throw new Error('No items provided for order creation');
  }

  // Format the request body according to the API specification
  const orderData = {
    status: "New",
    stripePaymentIntentId: null,
    items: items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }))
  };

  console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

  const res = await fetch(`${API_URL}/api/v1/Orders/Create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to create order:', res.status, res.statusText, errorText);
    throw new Error(`Failed to create order: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('Order created successfully:', data);
  return data;
}

export async function getUserOrders(): Promise<Order[]> {
  const { token, user } = useAuth.getState();

  if (!token) {
    throw new Error('No authentication token found');
  }

  if (!user) {
    throw new Error('No user found in auth store');
  }

  // Extract userId from user object - try different possible field names
  const userId = user.id || user.userId || user.sub || user.nameid;
  
  if (!userId) {
    throw new Error('No user ID found in user object');
  }

  console.log('Fetching orders for user:', userId);

  const res = await fetch(`${API_URL}/api/v1/Orders/GetByUserId/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch orders:', res.status, res.statusText, errorText);
    throw new Error(`Failed to fetch user orders: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('Orders fetched successfully:', data);
  
  // Ensure each order has items array
  const ordersWithItems = data.map((order: any) => ({
    ...order,
    items: order.items || []
  }));
  
  return ordersWithItems;
}

export async function getOrderById(orderId: number): Promise<Order> {
  const token = useAuth.getState().token;

  if (!token) {
    throw new Error('No authentication token found');
  }

  if (!orderId || isNaN(orderId)) {
    throw new Error('Invalid order ID');
  }

  console.log('Fetching order details for ID:', orderId);

  const res = await fetch(`${API_URL}/api/v1/Orders/${orderId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch order:', res.status, res.statusText, errorText);
    throw new Error(`Failed to fetch order: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log('Order details fetched successfully:', data);
  
  // Ensure order has items array
  const orderWithItems = {
    ...data,
    items: data.items || []
  };
  
  return orderWithItems;
}
