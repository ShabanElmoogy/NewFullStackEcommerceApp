# Order Status Constants - Translation Implementation

## Overview

The ORDER_STATUS constants and related functions have been enhanced with comprehensive translation support. This implementation provides both backward compatibility and new translation-aware functions for all order status related operations.

## Files Updated

### 1. `constants/orderStatus.ts`
**Enhanced with translation-aware functions**

### 2. `components/orders/OrderTimeline.tsx`
**Updated to use translated timeline steps and status names**

### 3. Translation Files
**Added new translation keys for timeline and status labels**

## New Translation Functions

### Core Translation Functions in `constants/orderStatus.ts`

#### `getTranslatedTimelineSteps(t: TFunction)`
Returns the complete timeline steps with translated titles and descriptions.

```tsx
const { t } = useTranslation();
const timelineSteps = getTranslatedTimelineSteps(t);
// Returns array with translated title and description for each step
```

#### `getTranslatedStatusTitle(t: TFunction, status: OrderStatus)`
Returns the translated status title for headers/timeline.

```tsx
getTranslatedStatusTitle(t, ORDER_STATUS.SHIPPED)
// Returns: "Shipped" (EN) or "تم الشحن" (AR)
```

#### `getTranslatedStatusDescription(t: TFunction, status: OrderStatus)`
Returns the translated status description.

```tsx
getTranslatedStatusDescription(t, ORDER_STATUS.SHIPPED)
// Returns: "Your order has been shipped..." (EN) or "تم شحن طلبك..." (AR)
```

#### `getTranslatedStatusName(t: TFunction, status: OrderStatus)`
Returns the basic translated status name.

```tsx
getTranslatedStatusName(t, ORDER_STATUS.PROCESSING)
// Returns: "Processing" (EN) or "قيد المعالجة" (AR)
```

## Updated Components

### OrderTimeline Component
**File**: `components/orders/OrderTimeline.tsx`

**Changes Made**:
- ✅ **Uses `getTranslatedTimelineSteps()`** for dynamic timeline generation
- ✅ **Translated timeline header** - "Order Timeline" / "الجدول الزمني للطلب"
- ✅ **Translated status labels** - "Current" / "الحالي", "Completed" / "مكتمل"
- ✅ **Translated status summary** - "Current Status" / "الحالة الحالية"
- ✅ **Translated update label** - "Last Updated" / "آخر تحديث"
- ✅ **Dynamic status names** using `getTranslatedStatusName()`

**Usage Example**:
```tsx
<OrderTimeline 
  currentStatus={ORDER_STATUS.SHIPPED}
  createdDate="2024-01-15"
  updatedDate="2024-01-16"
/>
// Timeline automatically shows translated content
```

## Translation Keys Added

### English (`locales/en.json`)
```json
{
  "orders": {
    "orderTimeline": "Order Timeline",
    "current": "Current",
    "completed": "Completed", 
    "currentStatus": "Current Status",
    "lastUpdated": "Last Updated",
    "status": {
      "new": "New",
      "confirmed": "Confirmed",
      "processing": "Processing",
      "shipped": "Shipped",
      "outForDelivery": "Out for Delivery",
      "delivered": "Delivered",
      "cancelled": "Cancelled",
      "returned": "Returned"
    },
    "statusTitles": {
      "new": "Order Placed",
      "confirmed": "Order Confirmed", 
      "processing": "Processing",
      "shipped": "Shipped",
      "outForDelivery": "Out for Delivery",
      "delivered": "Delivered",
      "cancelled": "Cancelled",
      "returned": "Returned"
    },
    "statusDescriptions": {
      "new": "Your order has been placed successfully",
      "confirmed": "Your order has been confirmed and is being prepared",
      "processing": "Your order is being processed and packed",
      "shipped": "Your order has been shipped and is on its way",
      "outForDelivery": "Your order is out for delivery",
      "delivered": "Your order has been delivered successfully",
      "cancelled": "Your order has been cancelled",
      "returned": "Your order has been returned"
    }
  }
}
```

### Arabic (`locales/ar.json`)
```json
{
  "orders": {
    "orderTimeline": "الجدول الزمني للطلب",
    "current": "الحالي",
    "completed": "مكتمل",
    "currentStatus": "الحالة الحالية", 
    "lastUpdated": "آخر تحديث",
    "status": {
      "new": "جديد",
      "confirmed": "مؤكد",
      "processing": "قيد المعالجة",
      "shipped": "تم الشحن",
      "outForDelivery": "في طريقه للتسليم",
      "delivered": "تم التسليم",
      "cancelled": "ملغي",
      "returned": "مُرتجع"
    },
    "statusTitles": {
      "new": "تم تقديم الطلب",
      "confirmed": "تم تأكيد الطلب",
      "processing": "قيد المعالجة", 
      "shipped": "تم الشحن",
      "outForDelivery": "في طريقه للتسليم",
      "delivered": "تم التسليم",
      "cancelled": "تم الإلغاء",
      "returned": "تم الإرجاع"
    },
    "statusDescriptions": {
      "new": "تم تقديم طلبك بنجاح",
      "confirmed": "تم تأكيد طلبك وجاري تحضيره",
      "processing": "جاري معالجة طلبك وتعبئته",
      "shipped": "تم شحن طلبك وهو في الطريق إليك",
      "outForDelivery": "طلبك في طريقه للتسليم",
      "delivered": "تم تسليم طلبك بنجاح",
      "cancelled": "تم إلغاء طلبك",
      "returned": "تم إرجاع طلبك"
    }
  }
}
```

## Backward Compatibility

The implementation maintains full backward compatibility:

- ✅ **Original `ORDER_STATUS` constants** remain unchanged
- ✅ **Legacy `ORDER_TIMELINE_STEPS`** still available for existing code
- ✅ **Existing functions** (`getStatusIndex`, `isStatusCompleted`, etc.) work as before
- ✅ **New translation functions** are additive, not replacing existing functionality

## Usage Examples

### Basic Status Translation
```tsx
import { useTranslation } from 'react-i18next';
import { getTranslatedStatusName, ORDER_STATUS } from '@/constants/orderStatus';

const { t } = useTranslation();
const statusName = getTranslatedStatusName(t, ORDER_STATUS.SHIPPED);
// Shows: "Shipped" (EN) or "تم الشحن" (AR)
```

### Timeline with Translations
```tsx
import { useTranslation } from 'react-i18next';
import { getTranslatedTimelineSteps } from '@/constants/orderStatus';

const { t } = useTranslation();
const timelineSteps = getTranslatedTimelineSteps(t);

timelineSteps.forEach(step => {
  console.log(step.title);        // Translated title
  console.log(step.description);  // Translated description
  console.log(step.status);       // Original status constant
  console.log(step.icon);         // Icon name
});
```

### Order Timeline Component
```tsx
<OrderTimeline 
  currentStatus={order.status}
  createdDate={order.createdAt}
  updatedDate={order.updatedAt}
/>
// Automatically shows all content in user's selected language
```

## Benefits

1. **Complete Translation Coverage**: All order status text is now translatable
2. **Backward Compatibility**: Existing code continues to work without changes
3. **Consistent Translations**: Same status shows same translation across all components
4. **Real-time Language Switching**: No app restart needed
5. **Type Safety**: Full TypeScript support with proper type checking
6. **Maintainable**: Centralized translation logic in constants file
7. **Flexible**: Can be used in any component that needs order status translations

## Components That Can Now Use These Functions

1. **OrderTimeline** ✅ Already updated
2. **OrderStatusBadge** ✅ Already updated  
3. **OrdersFilter** ✅ Already updated
4. **OrderTrackingContent** ✅ Already updated
5. **OrderCard** - Can be updated to use `getTranslatedStatusName()`
6. **OrderStatusBreakdown** - Can be updated to use translation functions
7. **Any new components** that display order status information

## Testing

To test the order status translations:

1. **Switch to Arabic**: All order status text should appear in Arabic
2. **Switch to English**: All status text should revert to English  
3. **Check Timeline**: Timeline steps should show translated titles and descriptions
4. **Verify Status Names**: Status badges and labels should show translated names
5. **Test Consistency**: Same status should show same translation everywhere

The order status translation system now provides comprehensive internationalization support for all order-related functionality while maintaining full backward compatibility with existing code.