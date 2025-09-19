# Layout Components

This directory contains the refactored layout components that were previously in `_layout.tsx`. The components are now organized into focused, reusable modules.

## Components

### AppContent.tsx
The main content wrapper that combines the app container and navigation stack. Handles navigation bar setup based on theme changes.

### AppContainer.tsx
Provides the main app container with:
- SafeAreaView for proper screen boundaries
- GluestackUI provider for UI components
- GestureHandler root view
- Global header
- Toast manager
- Status bar

### AppStatusBar.tsx
Manages the status bar appearance based on the current theme (light/dark mode).

## Usage

```tsx
import { AppContent, AppContainer, AppStatusBar } from '@/components/layout';

// Use AppContent for the complete app layout
<AppContent />

// Or use individual components for custom layouts
<AppContainer>
  <YourCustomContent />
</AppContainer>
```

## Features

- **Theme-aware**: All components automatically adapt to light/dark theme changes
- **RTL Support**: Integrated with RTL wrapper for right-to-left language support
- **Navigation Bar**: Automatic Android navigation bar styling
- **Toast Integration**: Built-in toast notification system
- **Safe Areas**: Proper handling of device safe areas (notches, etc.)