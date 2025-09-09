# Layout Components

This folder contains all the layout-related components that were previously in the main `_layout.tsx` file. The components have been organized for better maintainability and reusability.

## File Structure

```
components/layout/
├── CustomDrawerContent.tsx    # Main drawer content with menu items
├── DrawerHeaderComponents.tsx # Header left and right components
├── RTLWrapper.tsx            # RTL support wrapper component
├── DrawerNavigator.tsx       # Main drawer navigator configuration
├── index.ts                  # Barrel exports for all components
└── README.md                 # This documentation file
```

## Components Overview

### CustomDrawerContent.tsx
- **Purpose**: Renders the main drawer content including user profile, menu items, and footer
- **Features**: 
  - User profile section with avatar and info
  - Dynamic menu items with active state highlighting
  - Badge counts for cart and wishlist
  - RTL-aware styling using Tailwind classes
  - Sign in/out functionality

### DrawerHeaderComponents.tsx
- **Purpose**: Contains header components for the drawer navigation
- **Components**:
  - `DrawerHeaderLeft`: Menu button to open drawer
  - `DrawerHeaderRight`: Cart and wishlist icons with badge counts
- **Features**: RTL-aware positioning and badge placement

### RTLWrapper.tsx
- **Purpose**: Handles RTL (Right-to-Left) language support
- **Features**:
  - Initializes language on app start
  - Forces RTL layout for native platforms
  - Manages re-rendering when language changes
  - Avoids interfering with drawer positioning

### DrawerNavigator.tsx
- **Purpose**: Main drawer navigator configuration
- **Features**:
  - Drawer positioning and styling
  - Screen definitions
  - Header configuration
  - RTL-aware drawer behavior

### index.ts
- **Purpose**: Barrel file for clean imports
- **Exports**: All layout components for easy importing

## Usage

The main `_layout.tsx` file now imports these organized components:

```tsx
import { RTLWrapper, DrawerNavigator } from '@/components/layout';
```

## Benefits of This Organization

1. **Better Maintainability**: Each component has a single responsibility
2. **Easier Testing**: Components can be tested individually
3. **Improved Reusability**: Components can be reused in other parts of the app
4. **Cleaner Code**: Main layout file is now much simpler and focused
5. **Better Developer Experience**: Easier to find and modify specific functionality

## RTL Support

All components in this folder support RTL (Right-to-Left) languages:
- Uses Tailwind RTL classes (`ms-*`, `me-*`) for automatic direction adaptation
- Proper icon flipping for chevrons and directional elements
- Badge positioning that adapts to text direction
- Drawer positioning that works correctly in both LTR and RTL modes

## Customization

To customize the layout:
1. Modify individual component files for specific changes
2. Update the drawer configuration in `DrawerNavigator.tsx`
3. Add new menu items in `CustomDrawerContent.tsx`
4. Adjust RTL behavior in `RTLWrapper.tsx`