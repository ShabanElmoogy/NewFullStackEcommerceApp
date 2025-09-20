# RTL-Aware ChevronRight Implementation

## Overview

This implementation provides an RTL-aware ChevronRight component that automatically adapts to the current language direction (LTR/RTL) in your React Native application.

## How It Works

The `RTLChevronRight` component automatically switches between:
- **LTR (Left-to-Right)**: Shows `ChevronRightIcon` (pointing right →)
- **RTL (Right-to-Left)**: Shows `ChevronLeftIcon` (pointing left ←)

This ensures that the "forward" navigation direction is always visually correct for the user's language.

## Files Created

### 1. `components/ui/icon/RTLChevronRight.tsx`
The main RTL-aware component that handles the directional logic.

### 2. Updated `components/ui/icon/index.tsx`
Added export for the new RTL component.

## Usage

### Basic Usage

```tsx
import { RTLChevronRight } from '@/components/ui/icon';

// Simple usage
<RTLChevronRight size="lg" />

// With styling
<RTLChevronRight 
  size="md" 
  className="ml-2" 
  style={{ color: '#3B82F6' }} 
/>
```

### Migration from Regular ChevronRight

**Before:**
```tsx
import { Icon } from '@/components/ui/icon';
import { ChevronRight } from 'lucide-react-native';

<Icon as={ChevronRight} size="lg" style={{ color: statusColor }} />
```

**After:**
```tsx
import { RTLChevronRight } from '@/components/ui/icon';

<RTLChevronRight size="lg" style={{ color: statusColor }} />
```

## Props

The `RTLChevronRight` component accepts all the same props as the regular Icon component:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xs' \| number` | `'md'` | Icon size |
| `className` | `string` | - | CSS classes |
| `style` | `object` | - | Inline styles |
| `color` | `string` | - | Icon color |

## Examples

### Navigation Lists
```tsx
// Menu items with RTL-aware arrows
const MenuItem = ({ title, onPress }) => (
  <Pressable onPress={onPress} className="flex-row items-center justify-between p-4">
    <Text>{title}</Text>
    <RTLChevronRight size="sm" className="text-gray-400" />
  </Pressable>
);
```

### Cards with Navigation
```tsx
// Order tracking card (already implemented)
<HStack className="items-center justify-between">
  <OrderContent />
  <RTLChevronRight size="lg" style={{ color: statusColor }} />
</HStack>
```

### Settings Screens
```tsx
// Settings options
const SettingRow = ({ label, value }) => (
  <HStack className="items-center justify-between py-3">
    <VStack>
      <Text className="font-medium">{label}</Text>
      <Text className="text-sm text-gray-500">{value}</Text>
    </VStack>
    <RTLChevronRight size="sm" />
  </HStack>
);
```

## Components Already Updated

1. **OrderTrackingCard** - Updated to use RTL-aware chevron for navigation

## Components That Should Be Updated

Based on the search results, these components currently use ChevronRight and should be updated:

1. **CustomDrawerContent** (`components/layout/CustomDrawerContent.tsx`)
2. **CategoriesSection** (`components/home/CategoriesSection.tsx`)
3. **OrderTrackingLoader** (`components/home/order-tracking/OrderTrackingLoader.tsx`)
4. **Profile Screen** (`app/profile.tsx`)
5. **Product Detail Screen** (`app/product/[id].tsx`)
6. **Orders Screen** (`app/orders.tsx`)
7. **Menu Screen** (`app/(tabs)/menu.tsx`)

## Migration Steps

For each component using ChevronRight:

1. **Replace the import:**
   ```tsx
   // Remove these
   import { ChevronRight } from 'lucide-react-native';
   import { Icon } from '@/components/ui/icon';
   
   // Add this
   import { RTLChevronRight } from '@/components/ui/icon';
   ```

2. **Update the usage:**
   ```tsx
   // Replace this
   <Icon as={ChevronRight} size="lg" style={{ color: colors.primary }} />
   
   // With this
   <RTLChevronRight size="lg" style={{ color: colors.primary }} />
   ```

## Testing

To test the RTL functionality:

1. Change the app language to Arabic or Hebrew
2. Verify that chevron arrows point in the correct direction:
   - In LTR: Arrows point right (→)
   - In RTL: Arrows point left (←)

## Benefits

1. **Automatic RTL Support**: No manual handling of direction logic
2. **Consistent UX**: Users see the correct directional indicators
3. **Easy Migration**: Simple drop-in replacement for existing ChevronRight usage
4. **Type Safety**: Full TypeScript support with proper prop types
5. **Performance**: Minimal overhead, only checks RTL state once per render

## Technical Details

The component uses the existing `useRTL` hook to determine the current language direction and conditionally renders either `ChevronRightIcon` or `ChevronLeftIcon` accordingly.

The logic is simple:
- `isRTL = false` → Show `ChevronRightIcon` (points right)
- `isRTL = true` → Show `ChevronLeftIcon` (points left, which is "forward" in RTL)

This ensures that the visual direction always matches the user's expectation of "forward" navigation in their language context.