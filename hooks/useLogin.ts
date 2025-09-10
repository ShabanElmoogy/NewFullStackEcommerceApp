import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth';
import { useAuth } from '@/store/authStore';
import { useRouter } from 'expo-router';

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
      console.error('Login error:', error);
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