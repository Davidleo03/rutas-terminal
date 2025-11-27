import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/Login/api.js';
import useAuthStore from '../localStore/auth';
import { useState } from 'react';

export default function useLogin(options = {}) {
  const { onSuccess: userOnSuccess, onError: userOnError } = options;
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const [ isLoading, setIsLoading ] = useState(false);


  const mutation = useMutation({
    mutationFn: (creds) => loginUser(creds),
    onSuccess: (data) => {
      const token = data?.session?.access_token ?? null;
      const user = data?.user ?? null;

      if (user) setUser(user);
      if (token) setToken(token);

      if (typeof userOnSuccess === 'function') userOnSuccess(data);

      // redirección por rol
      if (data.user?.role === 'admin-linea') navigate('/admin-empresa');
      else if (data.user?.role === 'admin') navigate('/admin');
      setIsLoading(false);
    },
    onError: (err) => {
      if (typeof userOnError === 'function') userOnError(err);
      setIsLoading(false);
    },
    
  });

  

  return {
    mutate: mutation.mutate,
    isLoading,
    setIsLoading,
    error: mutation.error?.message || (mutation.error ? 'Error al iniciar sesión' : null),
    clearError: mutation.reset,
  };
}
