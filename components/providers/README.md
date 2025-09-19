# Provider Components

This directory contains provider components that wrap the app with necessary context providers and global state management.

## Components

### AppProviders.tsx
The main provider wrapper that combines all necessary providers:
- QueryProvider (React Query)
- ThemeProvider (Theme management)
- RTLWrapper (Right-to-left language support)

### QueryProvider.tsx
Provides React Query configuration with optimized default settings:
- 5-minute stale time
- 10-minute garbage collection time
- Retry configuration
- Window focus refetch disabled

## Usage

```tsx
import { AppProviders } from '@/components/providers';

// Wrap your app with all providers
<AppProviders>
  <YourApp />
</AppProviders>

// Or use individual providers
import { QueryProvider } from '@/components/providers';

<QueryProvider>
  <YourComponent />
</QueryProvider>
```

## Configuration

The QueryProvider includes optimized defaults:
- **Stale Time**: 5 minutes (data considered fresh)
- **GC Time**: 10 minutes (cache cleanup)
- **Retry**: 2 attempts for queries, 1 for mutations
- **Refetch on Focus**: Disabled for better UX