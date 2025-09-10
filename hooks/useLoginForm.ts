import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from './useLogin';
import { loginSchema, LoginFormData } from '@/utils/validation/loginSchema';

export const useLoginForm = () => {
  const { handleLogin, isLoading, error, isError } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      await handleLogin(data.email, data.password);
    } catch (error) {
      // Handle form-level errors
      console.error('Login form error:', error);
      
      // Set form errors if needed
      if (isError) {
        setError('email', { message: 'Invalid email or password' });
        setError('password', { message: 'Invalid email or password' });
      }
    }
  };

  return {
    // React Hook Form
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    
    // Login state
    isLoading,
    error,
    isError,
    
    // Utilities
    reset,
    setError,
  };
};