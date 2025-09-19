import { useMutation } from '@tanstack/react-query';
import { register, RegisterRequest } from '@/api/auth';
import { useAuth } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { Toast } from 'toastify-react-native';
import { ToastType } from '@/types/toastType';
import { getApiError } from '@/utils/errorUtils';

export function useRegister() {
  const router = useRouter();
  const setUser = useAuth(s => s.setUser);
  const setToken = useAuth(s => s.setToken);

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => register(userData),
    onSuccess: (data) => {
      // Show success toast
      Toast.show({
        type: ToastType.SUCCESS,
        text1: '🎉 Account Created!',
        text2: `Welcome ${data.user.userName || data.user.email}`,
        visibilityTime: 3000,
      });

      setUser(data);
      setToken(data.token);
      
      // Navigate to home after successful registration
      router.replace('/');
    },
    onError: (error) => {
      console.error('Registration error:', error);
      
      // Show error toast
      const errorData = getApiError(error);
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });
    },
  });

  const handleRegister = (userData: RegisterRequest) => {
    registerMutation.mutate(userData);
  };

  return {
    handleRegister,
    isLoading: registerMutation.isPending,
    error: registerMutation.error,
    isError: registerMutation.isError,
    isSuccess: registerMutation.isSuccess,
  };
}
