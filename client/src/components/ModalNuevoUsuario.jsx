import { useState, useEffect } from 'react';
import { useEmpresas } from '../services/Empresas/hooks';

const rolesOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'admin-linea', label: 'Admin de Línea' },
];

export default function ModalNuevoUsuario({ open, onClose, onCreate, submitting = false, serverError = '' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('usuario');
  const [idEmpresa, setIdEmpresa] = useState(null);
  const [errors, setErrors] = useState({});

  const { data: empresas, isLoading } = useEmpresas();

  useEffect(() => {
    if (!open) {
      // reset when modal closes
      setEmail('');
      setPassword('');
      setRole('usuario');
      setIdEmpresa(null);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email requerido';
    // simple email pattern
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Email inválido';
    if (!password) e.password = 'Password requerido';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (!role) e.role = 'Rol requerido';
    // id_empresa may be null for roles that don't need a company
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const payload = {
      email: email.trim(),
      password,
      role,
      id_empresa: idEmpresa ? Number(idEmpresa) : null,
    };

    console.log(payload)
    if (onCreate) onCreate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden ring-1 ring-black/5 transform transition-all"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-teal-50 text-teal-600 p-2 rounded-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3M5 21v-2a4 4 0 014-4h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Crear nuevo usuario</h3>
                <p className="text-sm text-gray-500">Rellena los campos para crear un usuario.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-gray-400 hover:text-gray-600 rounded-md p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-5">
            {serverError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded">
                {serverError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="usuario@ejemplo.com"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Rol</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {rolesOptions.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Empresa (opcional)</label>
                <select
                  value={idEmpresa ?? ''}
                  onChange={(e) => setIdEmpresa(e.target.value || null)}
                  className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Sin empresa</option>
                  {isLoading && <option value="" disabled>Cargando empresas...</option>}
                  {empresas && empresas.map((emp) => (
                    <option key={emp.id_empresa ?? emp.id} value={emp.id_empresa ?? emp.id}>{emp.nombre || emp.razon_social || `${emp.nombre_empresa}`}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-500">Los datos se enviarán al servidor y se validarán.</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 shadow flex items-center gap-2 ${submitting ? 'opacity-80 pointer-events-none' : ''}`}
              >
                {submitting && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                <span>{submitting ? 'Creando...' : 'Crear usuario'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
