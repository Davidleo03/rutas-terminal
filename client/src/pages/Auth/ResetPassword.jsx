
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../services/Auth/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await resetPassword(email, token, password);
      setMessage('Contraseña actualizada correctamente. Redirigiendo...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/login.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 z-20">
        <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mb-3 shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Nueva Contraseña</h1>
            <p className="text-sm text-gray-500">Ingresa el código recibido y tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-2">Correo electrónico</label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm bg-white"
                placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="token" className="block text-xs font-medium text-gray-600 mb-2">Código de Verificación</label>
            <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm bg-white"
                placeholder="Código recibido"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-2">Nueva Contraseña</label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm bg-white"
                placeholder="Nueva contraseña"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-600 mb-2">Confirmar Contraseña</label>
            <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm bg-white"
                placeholder="Repetir contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 transition"
          >
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </button>
        </form>

        {message && <div className="text-center mt-4 text-sm text-green-600">{message}</div>}
        {error && <div className="text-center mt-4 text-sm text-red-600">{error}</div>}
        
        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
             ¿No recibiste el código?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
