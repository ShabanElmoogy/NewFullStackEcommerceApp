# Custom Hooks

This directory contains custom React hooks for various app functionalities.

## New Hooks

### useAppInitialization.ts
Handles app-level initialization tasks:
- API service and language store connection setup
- Android navigation bar initialization
- Theme-based navigation bar styling

### useNavigationBarSetup.ts
Manages Android navigation bar appearance based on theme changes:
- Background color synchronization with app theme
- Button style (light/dark) based on theme mode
- Automatic updates when theme changes

## Usage

```tsx
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { useNavigationBarSetup } from '@/hooks/useNavigationBarSetup';

// In your root component
function RootLayout() {
  useAppInitialization();
  // ... rest of component
}

// In components that need navigation bar updates
function ThemedComponent() {
  useNavigationBarSetup();
  // ... rest of component
}
```

## Features

### useAppInitialization
- **API Integration**: Sets up language getter for API service
- **Language Store**: Configures culture header callback
- **Navigation Bar**: Initial Android navigation bar setup
- **Theme Persistence**: Loads saved theme preferences

### useNavigationBarSetup
- **Theme Reactive**: Automatically updates when theme changes
- **Android Only**: Safely handles platform-specific code
- **Error Handling**: Graceful fallback for navigation bar failures