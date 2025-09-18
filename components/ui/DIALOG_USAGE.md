# ReusableDialog Component Usage Guide

The `ReusableDialog` component is a comprehensive, customizable dialog system for React Native applications. It provides various dialog types with consistent styling and behavior.

## Features

- 🎨 **Multiple Dialog Types**: Info, Success, Warning, Error, and Confirmation dialogs
- 🎯 **Customizable Actions**: Support for custom action buttons with different styles
- 🎭 **Theme Integration**: Automatically adapts to your app's theme (light/dark mode)
- 📱 **Mobile Optimized**: Designed specifically for React Native with proper touch handling
- 🔧 **Flexible Configuration**: Extensive customization options
- 🪝 **Custom Hook**: Easy-to-use hook for dialog management

## Basic Usage

### 1. Using the useDialog Hook (Recommended)

```tsx
import React from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import ReusableDialog from '@/components/ui/ReusableDialog';
import { useDialog } from '@/hooks/useDialog';

const MyComponent = () => {
  const {
    dialogState,
    showInfoDialog,
    showSuccessDialog,
    showErrorDialog,
    showConfirmDialog,
    hideDialog,
  } = useDialog();

  const handleShowInfo = () => {
    showInfoDialog('Information', 'This is an informational message.');
  };

  const handleShowConfirm = () => {
    showConfirmDialog(
      'Delete Item',
      'Are you sure you want to delete this item?',
      () => {
        console.log('Item deleted');
        showSuccessDialog('Success', 'Item deleted successfully!');
      }
    );
  };

  return (
    <>
      <Button onPress={handleShowInfo}>
        <ButtonText>Show Info</ButtonText>
      </Button>
      
      <Button onPress={handleShowConfirm}>
        <ButtonText>Delete Item</ButtonText>
      </Button>

      <ReusableDialog
        isOpen={dialogState.isOpen}
        onClose={hideDialog}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
        onConfirm={dialogState.onConfirm}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        actions={dialogState.actions}
        showCloseButton={dialogState.showCloseButton}
        closeOnBackdropPress={dialogState.closeOnBackdropPress}
      />
    </>
  );
};
```

### 2. Using Individual Dialog Components

```tsx
import React, { useState } from 'react';
import { InfoDialog, SuccessDialog, ConfirmDialog } from '@/components/ui/ReusableDialog';

const MyComponent = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <InfoDialog
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Information"
        message="This is an info dialog."
      />

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Success"
        message="Operation completed successfully!"
      />

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onConfirm={() => {
          console.log('Confirmed');
          setShowConfirm(false);
        }}
      />
    </>
  );
};
```

## Dialog Types

### 1. Info Dialog
- **Icon**: Info icon
- **Color**: Primary theme color
- **Use Case**: General information, notifications

### 2. Success Dialog
- **Icon**: Check circle
- **Color**: Success green
- **Use Case**: Successful operations, confirmations

### 3. Warning Dialog
- **Icon**: Alert triangle
- **Color**: Warning orange/yellow
- **Use Case**: Cautions, important notices

### 4. Error Dialog
- **Icon**: Alert circle
- **Color**: Error red
- **Use Case**: Error messages, failures

### 5. Confirm Dialog
- **Icon**: Alert triangle
- **Color**: Warning orange/yellow
- **Use Case**: Confirmation prompts, destructive actions

## Advanced Usage

### Custom Actions

```tsx
const handleCustomActions = () => {
  showDialog({
    title: 'Custom Actions',
    message: 'Choose your action:',
    type: 'info',
    actions: [
      {
        text: 'Cancel',
        onPress: hideDialog,
        variant: 'outline',
        colorScheme: 'secondary',
      },
      {
        text: 'Save Draft',
        onPress: () => {
          console.log('Draft saved');
          hideDialog();
        },
        variant: 'outline',
        colorScheme: 'primary',
      },
      {
        text: 'Publish',
        onPress: () => {
          console.log('Published');
          hideDialog();
        },
        variant: 'solid',
        colorScheme: 'success',
      },
    ],
  });
};
```

### Loading State

```tsx
const handleLoading = () => {
  showDialog({
    title: 'Processing',
    message: 'Please wait...',
    type: 'info',
    actions: [
      {
        text: 'Processing...',
        onPress: () => {},
        isLoading: true,
      },
    ],
    showCloseButton: false,
    closeOnBackdropPress: false,
  });
};
```

### Non-Dismissible Dialog

```tsx
const handleNonDismissible = () => {
  showDialog({
    title: 'Important',
    message: 'You must make a choice.',
    type: 'warning',
    showCloseButton: false,
    closeOnBackdropPress: false,
    actions: [
      {
        text: 'Option A',
        onPress: () => {
          console.log('Option A selected');
          hideDialog();
        },
      },
      {
        text: 'Option B',
        onPress: () => {
          console.log('Option B selected');
          hideDialog();
        },
      },
    ],
  });
};
```

## Props Reference

### ReusableDialogProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls dialog visibility |
| `onClose` | `() => void` | - | Called when dialog should close |
| `title` | `string` | - | Dialog title |
| `message` | `string` | - | Dialog message content |
| `type` | `DialogType` | `'info'` | Dialog type (info, success, warning, error, confirm) |
| `size` | `string` | `'md'` | Dialog size (xs, sm, md, lg, full) |
| `onConfirm` | `() => void` | - | Confirmation callback (for confirm type) |
| `confirmText` | `string` | `'Confirm'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `actions` | `Action[]` | - | Custom action buttons |
| `showCloseButton` | `boolean` | `true` | Show close button in header |
| `closeOnBackdropPress` | `boolean` | `true` | Allow closing by tapping backdrop |

### Action Object

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | `string` | - | Button text |
| `onPress` | `() => void` | - | Button press handler |
| `variant` | `'solid' \| 'outline' \| 'link'` | `'solid'` | Button style variant |
| `colorScheme` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | Button color scheme |
| `isLoading` | `boolean` | `false` | Show loading state |

## useDialog Hook Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `showDialog` | `config: Partial<DialogState>` | Show dialog with custom configuration |
| `showInfoDialog` | `title: string, message: string` | Show info dialog |
| `showSuccessDialog` | `title: string, message: string` | Show success dialog |
| `showWarningDialog` | `title: string, message: string` | Show warning dialog |
| `showErrorDialog` | `title: string, message: string` | Show error dialog |
| `showConfirmDialog` | `title, message, onConfirm, confirmText?, cancelText?` | Show confirmation dialog |
| `hideDialog` | - | Hide current dialog |

## Best Practices

1. **Use the Hook**: The `useDialog` hook provides the easiest way to manage dialogs
2. **Consistent Messaging**: Use clear, concise titles and messages
3. **Appropriate Types**: Choose the right dialog type for the context
4. **Action Clarity**: Make action buttons clear about what they do
5. **Loading States**: Use loading states for async operations
6. **Accessibility**: The component includes proper accessibility features
7. **Theme Integration**: The dialogs automatically adapt to your theme

## Examples

See `DialogExamples.tsx` for comprehensive usage examples demonstrating all features and use cases.

## Theme Integration

The dialog automatically uses your app's theme colors:
- `colors.primary` - Primary actions
- `colors.success` - Success states
- `colors.warning` - Warning states
- `colors.error` - Error states
- `colors.text` - Text colors
- `colors.card` - Background colors
- `colors.border` - Border colors

The component respects both light and dark themes automatically.