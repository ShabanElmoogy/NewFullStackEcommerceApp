# Order Tracking Components

This folder contains the modular components that make up the OrderTrackingCard feature.

## Component Structure

```
order-tracking/
├── OrderTrackingCard.tsx      # Main container component
├── OrderTrackingLoader.tsx    # Loading state component
├── OrderTrackingHeader.tsx    # Status icon component
├── OrderTrackingContent.tsx   # Order information content
├── OrderStatusBreakdown.tsx   # Status breakdown with counts
├── OrderTrackingFooter.tsx    # Footer with navigation hint
├── index.ts                   # Export barrel
└── README.md                  # This documentation
```

## Components Overview

### OrderTrackingCard
- **Purpose**: Main container that orchestrates all sub-components
- **Responsibilities**: 
  - Handles navigation logic
  - Manages loading states
  - Determines status colors based on priority
  - Coordinates data flow between components

### OrderTrackingLoader
- **Purpose**: Displays skeleton loading state
- **Responsibilities**:
  - Shows placeholder content while data is loading
  - Maintains consistent visual structure

### OrderTrackingHeader
- **Purpose**: Displays the appropriate status icon
- **Responsibilities**:
  - Renders status-specific icons (Package, Truck, MapPin, Clock)
  - Applies status-specific colors

### OrderTrackingContent
- **Purpose**: Shows order information and status text
- **Responsibilities**:
  - Displays "Track Your Orders" heading
  - Shows contextual status messages
  - Renders order details (ID, date)

### OrderStatusBreakdown
- **Purpose**: Shows detailed breakdown when multiple orders exist
- **Responsibilities**:
  - Displays individual status counts with icons
  - Uses predefined status colors
  - Shows up to 4 different statuses

### OrderTrackingFooter
- **Purpose**: Provides navigation feedback and loading states
- **Responsibilities**:
  - Shows loading indicator during navigation
  - Displays "tap to view" hint when idle

## Color System

Each order status has a predefined color from `ORDER_STATUS_COLORS`:

- **New**: Blue (#3B82F6)
- **Confirmed**: Green (#10B981)
- **Processing**: Amber (#F59E0B)
- **Shipped**: Purple (#8B5CF6)
- **Out for Delivery**: Red (#EF4444)
- **Delivered**: Emerald (#059669)
- **Cancelled**: Gray (#6B7280)
- **Returned**: Red (#DC2626)

## Usage

```tsx
import { OrderTrackingCard } from '@/components/home/order-tracking';

// Basic usage
<OrderTrackingCard />

// With custom navigation handler
<OrderTrackingCard onNavigate={(route) => customNavigate(route)} />
```

## Data Flow

1. `OrderTrackingCard` fetches data using `useNonReceivedOrders` hook
2. Determines priority status color based on most urgent order
3. Passes relevant data to each sub-component
4. Sub-components render their specific UI sections
5. User interaction triggers navigation through the main component

## Benefits of This Structure

- **Modularity**: Each component has a single responsibility
- **Reusability**: Components can be used independently if needed
- **Maintainability**: Easy to modify individual parts without affecting others
- **Testability**: Each component can be tested in isolation
- **Readability**: Clear separation of concerns makes code easier to understand