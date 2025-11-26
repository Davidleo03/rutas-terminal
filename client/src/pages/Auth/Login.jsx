import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import useLogin from '../../hooks/useLogin';

function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((s) => !s)}
        className="sm:hidden ml-3 p-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-500"
        aria-label="Abrir menú"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-4 top-14 bg-white/95 rounded-md shadow-lg p-2 z-40 sm:hidden">
          <Link to="/" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Inicio</Link>
        </div>
      )}
    </>
  );
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: loginMutate, error, clearError, isLoading, setIsLoading } = useLogin();

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (error) clearError();
    loginMutate({ email, password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/login.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      {/* Navbar */}
      <nav className="absolute top-4 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-white font-bold">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                </div>
                <span className="hidden sm:inline">Rutas Terminal</span>
              </Link>
            </div>

            <div className="flex items-center">
              <div className="hidden sm:block">
                <Link to="/" className="text-sm text-white hover:underline">Inicio</Link>
              </div>

              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 z-20">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mb-3 shadow-md">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
              <path d="M2 17l10 5 10-5" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-gray-800">Bienvenido de nuevo</h1>
          <p className="text-sm text-gray-500">Inicia sesión para continuar con tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-2">Correo electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 10-8 0" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm bg-white"
                placeholder="tucorreo@ejemplo.com"
                aria-label="Correo electrónico"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-2">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5S10.343 11 12 11z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 20a7 7 0 0114 0" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm bg-white"
                placeholder="••••••••"
                aria-label="Contraseña"
              />
            </div>
          </div>

          

          <button
            type="submit"
            className="w-full mt-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>

        {error && (
          <div className="text-center mt-4 text-sm text-red-600">{error}</div>
        )}

        
      </div>
    </div>
  );
};

export default Login;
