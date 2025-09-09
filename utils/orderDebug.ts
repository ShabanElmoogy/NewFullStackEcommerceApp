import { Order, OrderItem } from '@/api/orders';

export const debugOrderData = (orders: Order[] | undefined) => {
  console.log('=== ORDER DEBUG INFO ===');
  console.log('Orders received:', orders);
  console.log('Orders count:', orders?.length || 0);
  
  if (orders && orders.length > 0) {
    orders.forEach((order, index) => {
      console.log(`\n--- Order ${index + 1} (ID: ${order.id}) ---`);
      console.log('Status:', order.status);
      console.log('User:', order.userName);
      console.log('Created:', order.createdOn);
      console.log('Items count:', order.items?.length || 0);
      
      if (order.items && order.items.length > 0) {
        console.log('Items:');
        order.items.forEach((item, itemIndex) => {
          console.log(`  ${itemIndex + 1}. ${item.productName}`);
          console.log(`     Price: $${item.price}, Qty: ${item.quantity}`);
          console.log(`     Total: $${(item.price * item.quantity).toFixed(2)}`);
        });
        
        const orderTotal = order.items.reduce((total, item) => 
          total + (item.price * item.quantity), 0
        );
        console.log(`Order Total: $${orderTotal.toFixed(2)}`);
      } else {
        console.log('No items in this order');
      }
    });
  } else {
    console.log('No orders found');
  }
  console.log('=== END ORDER DEBUG ===\n');
};

export const debugSingleOrder = (order: Order | undefined) => {
  console.log('=== SINGLE ORDER DEBUG ===');
  console.log('Order received:', order);
  
  if (order) {
    console.log('Order ID:', order.id);
    console.log('Status:', order.status);
    console.log('User:', order.userName);
    console.log('Created:', order.createdOn);
    console.log('Items count:', order.items?.length || 0);
    
    if (order.items && order.items.length > 0) {
      console.log('Items:');
      order.items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.productName}`);
        console.log(`     Price: $${item.price}, Qty: ${item.quantity}`);
        console.log(`     Total: $${(item.price * item.quantity).toFixed(2)}`);
      });
      
      const orderTotal = order.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      console.log(`Order Total: $${orderTotal.toFixed(2)}`);
    } else {
      console.log('No items in this order');
    }
  } else {
    console.log('No order data');
  }
  console.log('=== END SINGLE ORDER DEBUG ===\n');
};