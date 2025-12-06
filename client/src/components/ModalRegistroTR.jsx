import React, { useEffect, useState } from 'react';
import { useRutas } from '../services/Rutas/hooks';
import { useBuses } from '../services/buses/hooks';

/**
 * ModalRegistroTR
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - initialData: { id_registro?, id_ruta?, id_bus?, asientos_disponibles? }
 * - onSubmit: async (payload, initialData) => Promise
 * - onDone: callback with result { type: 'success'|'error', message }
 */
const ModalRegistroTR = ({ open, onClose, initialData = null, onSubmit, onDone }) => {
  const defaultForm = {
    id_ruta: '',
    id_bus: '',
    asientos_disponibles: '',
  };

  const [form, setForm] = useState({ ...defaultForm });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setAlert(null);
      setErrors({});
      setIsSubmitting(false);
      if (initialData) {
        setForm({
          id_ruta: initialData.id_ruta != null ? String(initialData.id_ruta) : '',
          id_bus: initialData.id_bus != null ? String(initialData.id_bus) : '',
          asientos_disponibles: initialData.asientos_disponibles != null ? String(initialData.asientos_disponibles) : '',
        });
      } else {
        setForm({ ...defaultForm });
      }
    }
  }, [open, initialData]);

  // load rutas and buses for selects
  const { data: rutasData = [], isLoading: isLoadingRutas } = useRutas();
  const { data: busesData = [], isLoading: isLoadingBuses } = useBuses();
  const rutas = Array.isArray(rutasData) ? rutasData : [];
  const buses = Array.isArray(busesData) ? busesData : [];

  const validate = () => {
    const e = {};
    if (!form.id_ruta || isNaN(Number(form.id_ruta)) || Number(form.id_ruta) <= 0) e.id_ruta = 'ID de ruta válido requerido';
    if (!form.id_bus || isNaN(Number(form.id_bus)) || Number(form.id_bus) <= 0) e.id_bus = 'ID de bus válido requerido';
    if (form.asientos_disponibles === '') e.asientos_disponibles = 'Asientos disponibles requerido';
    else if (isNaN(Number(form.asientos_disponibles)) || Number(form.asientos_disponibles) < 0) e.asientos_disponibles = 'Número válido (>= 0)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (ev) => {
    ev && ev.preventDefault();
    if (!validate()) return;
    const payload = {
      id_ruta: Number(form.id_ruta),
      id_bus: Number(form.id_bus),
      asientos_disponibles: Number(form.asientos_disponibles),
    };

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        const result = await onSubmit(payload, initialData);
        const msg = initialData ? 'Registro actualizado' : 'Registro creado';
        setAlert({ type: 'success', message: msg });
        onDone && onDone({ type: 'success', message: msg, data: result });
        setTimeout(() => {
          setIsSubmitting(false);
          setAlert(null);
          onClose && onClose();
        }, 800);
      } catch (err) {
        const m = (err && (err.message || String(err))) || 'Error al procesar';
        setAlert({ type: 'error', message: m });
        onDone && onDone({ type: 'error', message: m });
        setIsSubmitting(false);
      }
    } else {
      // Fallback: just close and return payload via onDone
      setAlert({ type: 'success', message: 'Acción simulada' });
      onDone && onDone({ type: 'success', message: 'Simulado', data: payload });
      setTimeout(() => {
        setAlert(null);
        onClose && onClose();
      }, 700);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/40" onClick={() => onClose && onClose()} />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white rounded-t-xl sm:rounded-xl shadow-lg overflow-hidden mx-auto p-4 sm:p-6 z-10"
        aria-modal="true"
        role="dialog"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{initialData ? 'Editar registro' : 'Nuevo registro'}</h3>
          <button type="button" onClick={() => onClose && onClose()} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Cerrar</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {alert && (
          <div className={`mb-3 p-3 rounded text-sm ${alert.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {alert.message}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ruta</label>
            <select
              name="id_ruta"
              value={form.id_ruta}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.id_ruta ? 'border-red-400' : 'border-gray-200'}`}
            >
              <option value="">Seleccione una ruta</option>
              {isLoadingRutas && <option value="">Cargando rutas...</option>}
              {rutas.map((r) => (
                <option key={r.id_ruta} value={String(r.id_ruta)}>{`${r.destino || r.nombre || 'Ruta ' + r.id_ruta} (ID ${r.id_ruta})`}</option>
              ))}
            </select>
            {errors.id_ruta && <div className="text-red-600 text-xs mt-1">{errors.id_ruta}</div>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bus</label>
            <select
              name="id_bus"
              value={form.id_bus}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.id_bus ? 'border-red-400' : 'border-gray-200'}`}
            >
              <option value="">Seleccione un bus</option>
              {isLoadingBuses && <option value="">Cargando buses...</option>}
              {buses.map((b) => (
                <option key={b.id_bus} value={String(b.id_bus)}>{`${b.placa || 'Bus ' + b.id_bus} ${b.numero ? '• #' + b.numero : ''}`}</option>
              ))}
            </select>
            {errors.id_bus && <div className="text-red-600 text-xs mt-1">{errors.id_bus}</div>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Asientos disponibles</label>
            <input
              name="asientos_disponibles"
              value={form.asientos_disponibles}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]*"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.asientos_disponibles ? 'border-red-400' : 'border-gray-200'}`}
              placeholder="Ej: 32"
            />
            {errors.asientos_disponibles && <div className="text-red-600 text-xs mt-1">{errors.asientos_disponibles}</div>}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end space-x-2">
          <button type="button" onClick={() => onClose && onClose()} className="px-4 py-2 rounded bg-gray-100 text-sm">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700 disabled:opacity-60">
            {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalRegistroTR;
