import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import useAuthStore from '../localStore/auth';

export default function useLogin(options = {}) {
  const { onSuccess: userOnSuccess, onError: userOnError } = options;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  const { mutate, error, reset, isPending } = useMutation({
    
    mutationFn: (creds) => loginUser(creds),
    onSuccess:  (data) => {
      setIsLoading(false);
     

      const token = data?.session?.access_token ?? null;
      if (token) setToken(token);
      if (typeof userOnSuccess === 'function') userOnSuccess(data);
      
      navigate('/admin');
      
    },
    onError: (error) => {
      setIsLoading(false);
      if (typeof userOnError === 'function') userOnError(error);
    }
  });

  return {
    mutate,
    isLoading,
    isPending,
    setIsLoading,
    error: error?.message || (error ? 'Error al iniciar sesión' : null),
    clearError: reset,
  };
}
