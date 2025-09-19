import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth';
import { useAuth } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { Toast } from 'toastify-react-native';
import { ToastType } from '@/types/toastType';
import { getApiError } from '@/utils/errorUtils';

export function useLogin() {
  const router = useRouter();
  const setUser = useAuth(s => s.setUser);
  const setToken = useAuth(s => s.setToken);
  const returnUrl = useAuth(s => s.returnUrl);
  const clearReturnUrl = useAuth(s => s.clearReturnUrl);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      // Show success toast
      Toast.show({
        type: ToastType.SUCCESS,
        text1: '🎉 Welcome Back!',
        text2: `Hello ${data.user.userName || data.user.email}`,
        visibilityTime: 3000,
      });

      setUser(data);
      setToken(data.token);
      
      // Handle redirect after successful login
      if (returnUrl) {
        const redirectTo = returnUrl;
        clearReturnUrl();
        router.replace(redirectTo);
      } else {
        router.replace('/');
      }
    },
    onError: (error) => {
      const errorData = getApiError(error);
      
      Toast.show({
        type: ToastType.ERROR,
        text1: errorData.title,
        text2: errorData.message,
        visibilityTime: 4000,
      });
    },
  });

  const handleLogin = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  return {
    handleLogin,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    isError: loginMutation.isError,
    isSuccess: loginMutation.isSuccess,
  };
}
