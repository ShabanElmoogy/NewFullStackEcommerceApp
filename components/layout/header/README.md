# 📱 Header Components

This folder contains the separated components that make up the GlobalHeader.

## 🏗️ **Structure**

```
header/
├── BrandLogo.tsx          # Shop logo/brand with home navigation
├── ThemeToggle.tsx        # Light/Dark/System theme switcher
├── LanguageToggle.tsx     # English/Arabic language switcher
├── WishlistButton.tsx     # Wishlist icon with count badge
├── CartButton.tsx         # Cart icon with count badge
├── HeaderActions.tsx      # Groups all action buttons
├── index.ts              # Exports all components
└── README.md             # This documentation
```

## 🎯 **Components Overview**

### **BrandLogo**
- Displays "Shop" brand text
- Navigates to home when pressed
- Optimized to prevent unnecessary navigation when already on home

### **ThemeToggle**
- Cycles through: Light → Dark → System
- Shows appropriate icon (Sun/Moon/Monitor)
- Colored background indicator

### **LanguageToggle**
- Toggles between English and Arabic
- Globe icon with green background
- Integrates with RTL layout system

### **WishlistButton**
- Heart icon with red background
- Shows count badge when items exist
- RTL-aware badge positioning

### **CartButton**
- Shopping cart icon with blue background
- Shows count badge when items exist
- RTL-aware badge positioning

### **HeaderActions**
- Groups all action buttons together
- Maintains consistent spacing
- Easy to reorder or modify buttons

## 🚀 **Usage**

### **Import Individual Components**
```typescript
import { BrandLogo, ThemeToggle, CartButton } from '@/components/layout/header';

// Use individually
<BrandLogo />
<ThemeToggle />
<CartButton />
```

### **Import All Actions**
```typescript
import { HeaderActions } from '@/components/layout/header';

// Use grouped actions
<HeaderActions />
```

### **Custom Header Layout**
```typescript
import { BrandLogo, LanguageToggle, CartButton } from '@/components/layout/header';

function CustomHeader() {
  return (
    <HStack className="items-center justify-between px-4 py-3">
      <BrandLogo />
      <HStack space="md">
        <LanguageToggle />
        <CartButton />
      </HStack>
    </HStack>
  );
}
```

## 🎨 **Customization**

### **Modify Button Order**
Edit `HeaderActions.tsx`:
```typescript
<HStack className="items-center" space="md">
  <CartButton />        // Move cart first
  <WishlistButton />
  <ThemeToggle />
  <LanguageToggle />
</HStack>
```

### **Add New Action Button**
1. Create new component in this folder
2. Add to `HeaderActions.tsx`
3. Export in `index.ts`

### **Custom Styling**
Each component uses the theme system:
```typescript
const { colors } = useTheme();

// Customize colors
backgroundColor: colors.primary + '20'  // 20% opacity
color: colors.primary
```

## 🔧 **Performance Benefits**

- **Separated Concerns**: Each component has single responsibility
- **Optimized Re-renders**: Components only re-render when their data changes
- **Memoized Handlers**: Navigation handlers are optimized with useCallback
- **Modular**: Easy to add, remove, or modify individual buttons

## 📱 **Responsive Design**

- **RTL Support**: All components support right-to-left layouts
- **Badge Positioning**: Count badges adjust for RTL/LTR automatically
- **Touch Targets**: All buttons have 40x40 minimum touch area
- **Visual Feedback**: Active states provide immediate user feedback

## 🧪 **Testing**

Each component can be tested individually:
```typescript
// Test BrandLogo navigation
fireEvent.press(screen.getByText('Shop'));

// Test theme toggle
fireEvent.press(screen.getByTestId('theme-toggle'));

// Test cart button with count
expect(screen.getByText('3')).toBeInTheDocument();
```

## 🔄 **Migration from Old GlobalHeader**

The old monolithic GlobalHeader has been split into:
- ✅ **BrandLogo** (was inline Pressable)
- ✅ **ThemeToggle** (was handleThemeToggle function)
- ✅ **LanguageToggle** (was toggleLanguage call)
- ✅ **WishlistButton** (was inline wishlist Pressable)
- ✅ **CartButton** (was inline cart Pressable)
- ✅ **HeaderActions** (groups all actions)

All functionality remains the same, but now it's modular and maintainable!