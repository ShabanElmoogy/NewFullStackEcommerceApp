# RTL (Right-to-Left) Implementation Guide

This document explains how RTL support has been implemented in your React Native Expo app without requiring app restart.

## 🚀 What's Been Implemented

### 1. **Core RTL Infrastructure**
- **Language Store** (`store/languageStore.ts`): Manages language state and RTL switching
- **RTL Hook** (`hooks/useRTL.ts`): Provides RTL-aware styling utilities
- **App Configuration** (`app.json`): Added locale support for iOS and Android
- **Layout Wrapper** (`app/_layout.tsx`): RTL wrapper component that handles direction changes

### 2. **RTL Drawer Navigation**
- **Dynamic Drawer Position**: Drawer slides from right in RTL mode, left in LTR mode
- **RTL-Aware Header Components**: Menu button and action buttons positioned correctly
- **RTL Menu Items**: Icons, text, and chevrons properly aligned for RTL
- **RTL Footer Actions**: Sign in/out buttons with proper icon positioning

### 3. **Key Features**
- ✅ **No App Restart Required**: Language and direction change instantly
- ✅ **Cross-Platform Support**: Works on iOS, Android, and Web
- ✅ **Dynamic Re-rendering**: Uses key-based re-rendering for instant updates
- ✅ **TailwindCSS RTL Support**: Added RTL plugin for CSS classes
- ✅ **Proper Text Alignment**: Automatic text alignment based on language direction
- ✅ **RTL Drawer Navigation**: Drawer position and content adapt to RTL direction

## 🔧 How It Works

### Language Store
```typescript
const { language, isRTL, toggleLanguage } = useLanguageStore();
```

The language store handles:
- Language persistence with AsyncStorage
- RTL state management
- I18nManager configuration for native platforms
- Document direction for web platform
- Force re-render using key increment

### RTL Hook
```typescript
const { isRTL, getTextAlign, getFlexDirection, getSpacing } = useRTL();
```

Provides utilities for:
- **Text Alignment**: `getTextAlign('left')` returns 'right' for RTL
- **Flex Direction**: `getFlexDirection('row')` returns 'row-reverse' for RTL
- **Spacing**: `getSpacing(left, right)` swaps margins for RTL
- **Positioning**: `getPosition(left, right)` swaps positions for RTL

## 📱 Usage Examples

### 1. **Basic RTL-Aware Component**
```tsx
import { useRTL } from '@/hooks/useRTL';

function MyComponent() {
  const { isRTL, getTextAlign, getFlexDirection } = useRTL();
  
  return (
    <View style={{ flexDirection: getFlexDirection('row') }}>
      <Icon className={isRTL ? 'ms-2' : 'me-2'} />
      <Text style={{ textAlign: getTextAlign('left') }}>
        Hello World
      </Text>
    </View>
  );
}
```

### 2. **Using TailwindCSS RTL Classes**
```tsx
// Use conditional classes based on RTL state
<View className={`flex-row ${isRTL ? 'flex-row-reverse' : ''}`}>
  <Text className={`${isRTL ? 'text-right' : 'text-left'}`}>
    Content
  </Text>
</View>
```

### 3. **Language Toggle Button**
```tsx
import { useLanguageStore } from '@/store/languageStore';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguageStore();
  
  return (
    <Pressable onPress={toggleLanguage}>
      <Text>{language === 'en' ? 'العربية' : 'English'}</Text>
    </Pressable>
  );
}
```

## 🎯 Testing the Implementation

### 1. **RTL Test Page**
Navigate to `/rtl-test` in your app to see a comprehensive demo of RTL features including:
- Language switching
- Text alignment
- Icon positioning
- Navigation examples
- Product cards with RTL layout

### 2. **Profile Page**
The profile page includes a language toggle that demonstrates RTL switching in a real app context.

## 🔧 Configuration Files

### App Configuration (`app.json`)
```json
{
  "locales": {
    "en": "./locales/en.json",
    "ar": "./locales/ar.json"
  },
  "ios": {
    "infoPlist": {
      "CFBundleAllowMixedLocalizations": true,
      "CFBundleLocalizations": ["en", "ar"]
    }
  }
}
```

### TailwindCSS Configuration (`tailwind.config.js`)
```javascript
module.exports = {
  plugins: [
    require('tailwindcss-rtl'),
  ],
  // ... rest of config
};
```

## 🚨 Important Notes

### For Native Platforms (iOS/Android)
- Uses `I18nManager.forceRTL()` to control layout direction
- Requires `I18nManager.allowRTL(true)` to enable RTL support
- Changes are applied immediately without restart

### For Web Platform
- Sets `document.dir` and `document.body.dir` attributes
- Uses CSS direction property for proper RTL rendering
- Compatible with TailwindCSS RTL classes

### Key-Based Re-rendering
The implementation uses a `key` prop that increments when language changes, forcing React to completely re-render the component tree with the new direction.

## 🎨 Styling Best Practices

### 1. **Use RTL-Aware Margins/Padding**
```tsx
// Instead of fixed margins
<Icon className="mr-2" />

// Use conditional margins
<Icon className={isRTL ? 'ms-2' : 'me-2'} />
```

### 2. **Text Alignment**
```tsx
// Use the RTL hook for dynamic alignment
<Text style={{ textAlign: getTextAlign('left') }}>
  Content
</Text>
```

### 3. **Flex Direction**
```tsx
// Use the RTL hook for proper flex direction
<View style={{ flexDirection: getFlexDirection('row') }}>
  {children}
</View>
```

## 🔄 How to Extend

### Adding New Languages
1. Create new locale file in `/locales/` directory
2. Update `app.json` locales configuration
3. Add language option to language store
4. Update RTL detection logic if needed

### Custom RTL Components
1. Use the `useRTL` hook in your components
2. Apply RTL-aware styling using the provided utilities
3. Test with both LTR and RTL languages

## 🐛 Troubleshooting

### Common Issues
1. **Text not aligning properly**: Ensure you're using `getTextAlign()` from the RTL hook
2. **Icons not flipping**: Use conditional margins with `isRTL` state
3. **Layout not updating**: Check that components are using the RTL state correctly
4. **Web direction not changing**: Verify document direction is being set

### Debug Tips
- Check the RTL state in your components: `console.log('isRTL:', isRTL)`
- Verify I18nManager state: `console.log('RTL Enabled:', I18nManager.isRTL)`
- Test on different platforms to ensure consistency

## 📚 Resources

- [React Native I18nManager Documentation](https://reactnative.dev/docs/i18nmanager)
- [TailwindCSS RTL Plugin](https://github.com/20lives/tailwindcss-rtl)
- [Expo Localization](https://docs.expo.dev/versions/latest/sdk/localization/)

---

Your RTL implementation is now complete and ready for production use! 🎉