import React from 'react';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import ReusableDialog, {
  InfoDialog,
  SuccessDialog,
  WarningDialog,
  ErrorDialog,
  ConfirmDialog,
} from '@/components/ui/ReusableDialog';
import { useDialog } from '@/hooks/useDialog';
import { useTheme } from '@/hooks/useTheme';

const DialogExamples: React.FC = () => {
  const { colors } = useTheme();
  const {
    dialogState,
    showInfoDialog,
    showSuccessDialog,
    showWarningDialog,
    showErrorDialog,
    showConfirmDialog,
    showDialog,
    hideDialog,
  } = useDialog();

  const handleCustomActionsDialog = () => {
    showDialog({
      title: 'Custom Actions',
      message: 'This dialog has custom action buttons with different styles.',
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
            hideDialog();
          },
          variant: 'outline',
          colorScheme: 'primary',
        },
        {
          text: 'Publish',
          onPress: () => {
            hideDialog();
          },
          variant: 'solid',
          colorScheme: 'success',
        },
      ],
    });
  };

  const handleLoadingDialog = () => {
    showDialog({
      title: 'Processing',
      message: 'Please wait while we process your request.',
      type: 'info',
      actions: [
        {
          text: 'Processing...',
          onPress: () => {},
          variant: 'solid',
          colorScheme: 'primary',
          isLoading: true,
        },
      ],
      showCloseButton: false,
      closeOnBackdropPress: false,
    });

    // Simulate processing
    setTimeout(() => {
      showSuccessDialog('Success', 'Your request has been processed successfully!');
    }, 3000);
  };

  const handleDeleteConfirmation = () => {
    showConfirmDialog(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      () => {
        showSuccessDialog('Deleted', 'Item has been deleted successfully.');
      },
      'Delete',
      'Cancel'
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <VStack space="lg" className="p-6">
        <Heading size="xl" style={{ color: colors.text }}>
          Dialog Examples
        </Heading>

        <Text style={{ color: colors.textSecondary }}>
          Tap the buttons below to see different types of dialogs in action.
        </Text>

        {/* Basic Dialog Types */}
        <VStack space="md">
          <Heading size="lg" style={{ color: colors.text }}>
            Basic Dialog Types
          </Heading>

          <Button
            onPress={() => showInfoDialog('Information', 'This is an informational message.')}
            style={{ backgroundColor: colors.primary }}
          >
            <ButtonText>Show Info Dialog</ButtonText>
          </Button>

          <Button
            onPress={() => showSuccessDialog('Success', 'Operation completed successfully!')}
            style={{ backgroundColor: colors.success }}
          >
            <ButtonText>Show Success Dialog</ButtonText>
          </Button>

          <Button
            onPress={() => showWarningDialog('Warning', 'Please be careful with this action.')}
            style={{ backgroundColor: colors.warning }}
          >
            <ButtonText>Show Warning Dialog</ButtonText>
          </Button>

          <Button
            onPress={() => showErrorDialog('Error', 'Something went wrong. Please try again.')}
            style={{ backgroundColor: colors.error }}
          >
            <ButtonText>Show Error Dialog</ButtonText>
          </Button>
        </VStack>

        {/* Confirmation Dialogs */}
        <VStack space="md">
          <Heading size="lg" style={{ color: colors.text }}>
            Confirmation Dialogs
          </Heading>

          <Button
            onPress={handleDeleteConfirmation}
            variant="outline"
            style={{ borderColor: colors.error }}
          >
            <ButtonText style={{ color: colors.error }}>Delete Item</ButtonText>
          </Button>

          <Button
            onPress={() =>
              showConfirmDialog(
                'Save Changes',
                'Do you want to save your changes before leaving?',
                () => {
                  showSuccessDialog('Saved', 'Your changes have been saved.');
                },
                'Save',
                'Discard'
              )
            }
            style={{ backgroundColor: colors.primary }}
          >
            <ButtonText>Save Changes Dialog</ButtonText>
          </Button>
        </VStack>

        {/* Advanced Examples */}
        <VStack space="md">
          <Heading size="lg" style={{ color: colors.text }}>
            Advanced Examples
          </Heading>

          <Button
            onPress={handleCustomActionsDialog}
            variant="outline"
            style={{ borderColor: colors.primary }}
          >
            <ButtonText style={{ color: colors.primary }}>Custom Actions Dialog</ButtonText>
          </Button>

          <Button
            onPress={handleLoadingDialog}
            style={{ backgroundColor: colors.secondary }}
          >
            <ButtonText>Loading Dialog</ButtonText>
          </Button>

          <Button
            onPress={() =>
              showDialog({
                title: 'No Close Button',
                message: 'This dialog has no close button and cannot be dismissed by tapping the backdrop.',
                type: 'warning',
                showCloseButton: false,
                closeOnBackdropPress: false,
                actions: [
                  {
                    text: 'Got it',
                    onPress: hideDialog,
                    variant: 'solid',
                    colorScheme: 'primary',
                  },
                ],
              })
            }
            variant="outline"
            style={{ borderColor: colors.warning }}
          >
            <ButtonText style={{ color: colors.warning }}>No Close Button</ButtonText>
          </Button>
        </VStack>

        {/* Using Individual Components */}
        <VStack space="md">
          <Heading size="lg" style={{ color: colors.text }}>
            Individual Components
          </Heading>

          <Text style={{ color: colors.textSecondary }}>
            You can also use the individual dialog components directly:
          </Text>

          <Button
            onPress={() => {
              // Example of using individual components
              // These would typically be managed with local state
            }}
            variant="outline"
            style={{ borderColor: colors.textSecondary }}
          >
            <ButtonText style={{ color: colors.textSecondary }}>
              Individual Components (See Code)
            </ButtonText>
          </Button>
        </VStack>
      </VStack>

      {/* The actual dialog component */}
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
    </ScrollView>
  );
};

export default DialogExamples;
