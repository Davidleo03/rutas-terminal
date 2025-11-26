import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../localStore/auth';

export default function AdminLayout({ children }) {
  const clearToken = useAuthStore((s) => s.clearToken);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium ${
      isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Menu: horizontal on mobile, vertical on md+ */}
      <nav className="flex flex-row md:flex-col items-center md:items-stretch gap-2 md:gap-3 p-3 md:p-6 bg-white shadow-md md:shadow-none md:min-h-screen md:w-64">
        <div className="flex-shrink-0 px-2 py-1 font-bold text-lg text-indigo-600">Admin</div>

        {user?.role === 'admin' && (
          <NavLink to="/admin" className={linkClass} end>
            <span>Dashboard</span>
          </NavLink>
        )}

        {user?.role === 'admi-linea' && (
          <NavLink to="/admin-empresa" className={linkClass}>
            <span>Admin Empresa</span>
          </NavLink>
        )}

        <button onClick={handleLogout} className="mt-2 md:mt-auto px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-50">
          Cerrar sesión
        </button>
      </nav>

      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
