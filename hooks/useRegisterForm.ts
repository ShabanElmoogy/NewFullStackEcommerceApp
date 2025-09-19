import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { registerSchema, RegisterFormData } from '@/utils/validation/registerSchema';

export const useRegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    mode: 'onChange', // Validate on change for real-time feedback
  });

  // Watch all form values
  const formData = watch();

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to register the user
      
      // Navigate to success screen or login
      router.replace('/login');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle API errors here
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // React Hook Form
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isDirty,
    
    // Form data
    formData,
    
    // Loading state
    isLoading,
    setIsLoading,
    
    // Utilities
    watch,
    setValue,
    reset,
    trigger,
    
    // Legacy compatibility for existing components
    agreeToTerms: formData.agreeToTerms,
    isFormValid: () => isValid,
    validateForm: () => isValid,
  };
};
