import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import useAuthStore from '../localStore/auth';

export default function useLogin(options = {}) {
  const { onSuccess: userOnSuccess, onError: userOnError } = options;
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: (creds) => loginUser(creds),
    onSuccess: (data) => {
      const token = data?.session?.access_token ?? null;
      if (token) setToken(token);
      if (typeof userOnSuccess === 'function') userOnSuccess(data);
      navigate('/admin');
    },
    onError: (err) => {
      const message = err?.message || err?.error || 'Error al iniciar sesión';
      setError(message);
      if (typeof userOnError === 'function') userOnError(err);
    },
  });

  

  return {
    ...mutation,
   
    error,
    clearError: () => setError(null),
  };
}
