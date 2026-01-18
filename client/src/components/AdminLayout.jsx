import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../localStore/auth';

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const clearToken = useAuthStore((s) => s.clearToken);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const rol = user?.role;

  const isAdmin = rol === 'admin';

  const isAdminLinea = rol === 'admin-linea';

  const handleLogout = () => {
    clearToken();
    setOpen(false);
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile header with hamburger */}
      <div className="md:hidden w-full flex items-center justify-between p-3 bg-white shadow">
        <div className="font-bold text-lg text-indigo-600">{rol}</div>
        <button
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md focus:outline-none"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col items-stretch gap-3 p-6 bg-white md:min-h-screen md:w-64">
        <div className="flex-shrink-0 px-2 py-1 font-bold text-lg text-indigo-600">{rol}</div>
        {(isAdmin || isAdminLinea) && (
          <>
            <NavLink to={`/${rol}`} className={linkClass} end>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to={`/${rol}/rutas`} className={linkClass}>
              <span>Rutas</span>
            </NavLink>


            {isAdmin && (
              <>
                <NavLink to={`/${rol}/usuarios`} className={linkClass}>
                  <span>Usuarios</span>
                </NavLink>
                <NavLink to={`/${rol}/empresas`} className={linkClass}>
                  <span>Empresas</span>
                </NavLink>
              </>
            )}

            <NavLink to={`/${rol}/buses`} className={linkClass}>
              <span>Buses</span>
            </NavLink>

            <NavLink to={`/${rol}/rutas-tiempo-real`} className={linkClass}>
              <span>Rutas Tiempo Real</span>
            </NavLink>

            <NavLink to={`/${rol}/reportes-viajes`} className={linkClass}>
              <span>Reportes</span>
            </NavLink>
          </>
        )}

        <button onClick={handleLogout} className="mt-2 md:mt-auto px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-50">
          Cerrar sesión
        </button>
      </nav>

      {/* Mobile menu (dropdown) */}
      {open && (
        <nav className="md:hidden flex flex-col items-stretch gap-2 p-3 bg-white shadow">
          {(isAdmin || isAdminLinea) && (
            <>
              <NavLink to={`/${rol}`} className={linkClass} end onClick={() => setOpen(false)}>
                <span>Dashboard</span>
              </NavLink>
              {isAdmin && (
                <>
                  <NavLink to={`/${rol}/empresas`} className={linkClass} onClick={() => setOpen(false)}>
                    <span>Empresas</span>
                  </NavLink>
                  <NavLink to={`/${rol}/usuarios`} className={linkClass} onClick={() => setOpen(false)}>
                    <span>Usuarios</span>
                  </NavLink>

                </>
              )}

              <NavLink to={`/${rol}/rutas`} className={linkClass} onClick={() => setOpen(false)}>
                <span>Rutas</span>
              </NavLink>

              <NavLink to={`/${rol}/buses`} className={linkClass} onClick={() => setOpen(false)}>
                <span>Buses</span>
              </NavLink>


              <NavLink to={`/${rol}/rutas-tiempo-real`} className={linkClass} onClick={() => setOpen(false)}>
                <span>Rutas Tiempo Real</span>
              </NavLink>



              <NavLink to={`/${rol}/reportes-viajes`} className={linkClass} onClick={() => setOpen(false)}>
                <span>Reportes</span>
              </NavLink>

            </>
          )}




          <button onClick={() => { setOpen(false); handleLogout(); }} className="mt-2 px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-50">
            Cerrar sesión
          </button>
        </nav>
      )}

      <main className="flex-1 p-4 md:p-8">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
