import { Toast } from 'toastify-react-native';
import { ToastType } from '@/types/toastType';
import { getErrorToastData, ErrorToastData } from '@/utils/errorUtils';

/**
 * Hook to show error toasts with consistent formatting
 */
export function useErrorToast() {
  const showErrorToast = (error: any, customErrorData?: Partial<ErrorToastData>) => {
    const errorData = customErrorData ? 
      { ...getErrorToastData(error), ...customErrorData } : 
      getErrorToastData(error);

    Toast.show({
      type: ToastType.ERROR,
      text1: errorData.title,
      text2: errorData.message,
      visibilityTime: 4000,
    });
  };

  const showSuccessToast = (title: string, message?: string) => {
    Toast.show({
      type: ToastType.SUCCESS,
      text1: title,
      text2: message,
      visibilityTime: 3000,
    });
  };

  const showInfoToast = (title: string, message?: string) => {
    Toast.show({
      type: ToastType.INFO,
      text1: title,
      text2: message,
      visibilityTime: 3000,
    });
  };

  const showWarningToast = (title: string, message?: string) => {
    Toast.show({
      type: ToastType.WARNING,
      text1: title,
      text2: message,
      visibilityTime: 3000,
    });
  };

  return {
    showErrorToast,
    showSuccessToast,
    showInfoToast,
    showWarningToast,
  };
}

/**
 * Higher-order function to create mutation options with error toast handling
 */
export function withErrorToast<TData = unknown, TError = unknown, TVariables = void>(
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
    successMessage?: string | ((data: TData) => string);
    errorMessage?: string | ((error: TError) => ErrorToastData);
  } = {}
) {
  return {
    onSuccess: (data: TData, variables: TVariables) => {
      // Show success toast if message provided
      if (options.successMessage) {
        const message = typeof options.successMessage === 'function' 
          ? options.successMessage(data) 
          : options.successMessage;
        
        Toast.show({
          type: ToastType.SUCCESS,
          text1: '✅ Success',
          text2: message,
          visibilityTime: 3000,
        });
      }

      // Call custom onSuccess if provided
      options.onSuccess?.(data, variables);
    },
    onError: (error: TError, variables: TVariables) => {
      // Show error toast
      let errorData: ErrorToastData;
      
      if (options.errorMessage) {
        if (typeof options.errorMessage === 'function') {
          errorData = options.errorMessage(error);
        } else {
          errorData = { title: '❌ Error', message: options.errorMessage };
        }
      } else {
        errorData = getErrorToastData(error);
      }

      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });

      // Call custom onError if provided
      options.onError?.(error, variables);
    },
  };
}
