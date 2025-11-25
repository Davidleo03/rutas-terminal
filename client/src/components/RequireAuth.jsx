import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../localStore/auth';

export default function RequireAuth({ children }) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  if (!token) {
    // Redirige a login guardando la ruta de origen
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
