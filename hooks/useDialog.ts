import { useState, useCallback } from 'react';
import { DialogType } from '@/components/ui/ReusableDialog';

export interface DialogState {
  isOpen: boolean;
  title: string;
  message: string;
  type: DialogType;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  actions?: Array<{
    text: string;
    onPress: () => void;
    variant?: 'solid' | 'outline' | 'link';
    colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    isLoading?: boolean;
  }>;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
}

export interface UseDialogReturn {
  dialogState: DialogState;
  showDialog: (config: Partial<DialogState>) => void;
  showInfoDialog: (title: string, message: string) => void;
  showSuccessDialog: (title: string, message: string) => void;
  showWarningDialog: (title: string, message: string) => void;
  showErrorDialog: (title: string, message: string) => void;
  showConfirmDialog: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
  hideDialog: () => void;
}

const initialState: DialogState = {
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  showCloseButton: true,
  closeOnBackdropPress: true,
};

export const useDialog = (): UseDialogReturn => {
  const [dialogState, setDialogState] = useState<DialogState>(initialState);

  const showDialog = useCallback((config: Partial<DialogState>) => {
    setDialogState(prev => {
      const newState = {
        ...prev,
        ...config,
        isOpen: true,
      };
      return newState;
    });
  }, []);

  const hideDialog = useCallback(() => {
    setDialogState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const showInfoDialog = useCallback((title: string, message: string) => {
    showDialog({
      title,
      message,
      type: 'info',
    });
  }, [showDialog]);

  const showSuccessDialog = useCallback((title: string, message: string) => {
    showDialog({
      title,
      message,
      type: 'success',
    });
  }, [showDialog]);

  const showWarningDialog = useCallback((title: string, message: string) => {
    showDialog({
      title,
      message,
      type: 'warning',
    });
  }, [showDialog]);

  const showErrorDialog = useCallback((title: string, message: string) => {
    showDialog({
      title,
      message,
      type: 'error',
    });
  }, [showDialog]);

  const showConfirmDialog = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
  ) => {
    showDialog({
      title,
      message,
      type: 'confirm',
      onConfirm,
      confirmText,
      cancelText,
    });
  }, [showDialog]);

  return {
    dialogState,
    showDialog,
    showInfoDialog,
    showSuccessDialog,
    showWarningDialog,
    showErrorDialog,
    showConfirmDialog,
    hideDialog,
  };
};

export default useDialog;
