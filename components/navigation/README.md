# Navigation Components

This directory contains navigation-related components for the app's routing structure.

## Components

### AppStack.tsx
Defines the main navigation stack with all app routes:
- Tab navigation group
- Authentication routes (login, register)
- Main app screens (cart, wishlist, orders, etc.)
- Dynamic routes (product/[id], order/[id], etc.)

## Routes Configuration

The AppStack includes the following routes:
- `(tabs)` - Main tab navigation
- `(auth)/login` - Login screen
- `(auth)/register` - Registration screen
- `cart` - Shopping cart
- `compare` - Product comparison
- `wishlist` - User wishlist
- `orders` - Orders list
- `orders/track/[orderId]` - Order tracking
- `profile` - User profile
- `product/[id]` - Product details
- `order/[id]` - Order details

## Usage

```tsx
import { AppStack } from '@/components/navigation';

// Use in your layout
<AppStack />
```

## Features

- **File-based Routing**: Uses Expo Router for automatic route generation
- **Hidden Headers**: All screens have headers disabled for custom header implementation
- **Dynamic Routes**: Supports parameterized routes like [id] and [orderId]