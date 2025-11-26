import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../localStore/auth';

export default function RequireAuth({ children, allowedRoles = [] }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especificaron roles permitidos, comprobar el role del usuario
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const userRole = user?.role ?? null;
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Opcional: podríamos redirigir a una página de 'Forbidden' o al home
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
