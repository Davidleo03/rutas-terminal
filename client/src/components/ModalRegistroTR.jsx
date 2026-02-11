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
    hora_salida: '',
  };

  const [empresa_id, setEmpresa_id] = useState(null);

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
          // store as HH:MM for the time input (trim seconds if present)
          hora_salida: initialData.hora_salida != null ? String(initialData.hora_salida).substring(0,5) : '',
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

  
  

  // Mostrar solo rutas activas en el select del modal.
  // Si estamos editando (`initialData`) permitimos incluir la ruta actual aunque esté inactiva
  const activeRutas = rutas.filter((r) => {
    
    const isActive = r === null || r === undefined ? false : (r.activa === true || String(r.activa) === 'true' || String(r.activa) === '1');
    if (isActive) return true;
    if (initialData && String(initialData.id_ruta) === String(r.id_ruta)) return true;
    return false;
  });

  // Cuando cambie la ruta seleccionada en el form, actualizamos empresa_id
  // tomando la empresa que pertenece a esa ruta. Además, si el bus actualmente
  // seleccionado no pertenece a la empresa de la nueva ruta, lo limpiamos.
  useEffect(() => {
    const rutaId = form.id_ruta;
    if (!rutaId) {
      setEmpresa_id(null);
      return;
    }

    const found = rutas.find(r => String(r.id_ruta) === String(rutaId));
    const eid = found
      ? (found.empresa_id ?? found.id_empresa ?? found.empresa?.id_empresa ?? found.empresa?.id)
      : null;

    setEmpresa_id(eid != null ? String(eid) : null);

    // si hay un bus seleccionado y no pertenece a la empresa de la ruta, limpiarlo
    if (form.id_bus) {
      const busObj = buses.find(b => String(b.id_bus) === String(form.id_bus));
      const busEmpresaId = busObj ? (busObj.empresa_id ?? busObj.empresa?.id_empresa ?? busObj.empresa?.id) : null;
      if (busEmpresaId != null && String(busEmpresaId) !== String(eid)) {
        setForm(prev => ({ ...prev, id_bus: '' }));
      }
    }
  }, [form.id_ruta, rutas, buses]);

  const validate = () => {
    const e = {};
    if (!form.id_ruta || isNaN(Number(form.id_ruta)) || Number(form.id_ruta) <= 0) e.id_ruta = 'ID de ruta válido requerido';
    if (!form.id_bus || isNaN(Number(form.id_bus)) || Number(form.id_bus) <= 0) e.id_bus = 'ID de bus válido requerido';
    if (form.asientos_disponibles === '') e.asientos_disponibles = 'Asientos disponibles requerido';
    else if (isNaN(Number(form.asientos_disponibles)) || Number(form.asientos_disponibles) < 0) e.asientos_disponibles = 'Número válido (>= 0)';
    if (!form.hora_salida) e.hora_salida = 'Hora de salida requerida';
    else if (!/^\d{2}:\d{2}$/.test(form.hora_salida)) e.hora_salida = 'Formato de hora inválido (HH:MM)';
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
      // normalize to HH:MM:SS expected by backend; append :00 when only HH:MM
      hora_salida: form.hora_salida ? (/^\d{2}:\d{2}$/.test(form.hora_salida) ? `${form.hora_salida}:00` : String(form.hora_salida)) : null,
    };

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        const result = await onSubmit(payload, initialData);

        // Determinar éxito basado en la respuesta de la API.
        // Soportamos varias formas: { status: 200 }, { statusCode: 200 }, { ok: true }, o datos devueltos.
        let success = false;
        let resultMessage = null;
        if (result == null) {
          // Si no hay respuesta explícita, asumimos éxito
          success = true;
        } else if (typeof result === 'object') {
          if (Object.prototype.hasOwnProperty.call(result, 'status')) {
            success = Number(result.status) === 200;
          } else if (Object.prototype.hasOwnProperty.call(result, 'statusCode')) {
            success = Number(result.statusCode) === 200;
          } else if (Object.prototype.hasOwnProperty.call(result, 'ok')) {
            success = !!result.ok;
          } else {
            // Si es un objeto sin status conocido, asumimos que es la carga útil -> éxito
            success = true;
          }

          // Mensaje preferido desde la respuesta
          resultMessage = result.message || result.msg || result.error || null;
        } else {
          // respuesta no-objeto (string, number, etc) -> tratamos como éxito
          success = true;
          resultMessage = String(result);
        }

        if (success) {
          const msg = initialData ? 'Registro actualizado' : 'Registro creado';
          setAlert({ type: 'success', message: resultMessage || msg });
          onDone && onDone({ type: 'success', message: resultMessage || msg, data: result });
          setTimeout(() => {
            setIsSubmitting(false);
            setAlert(null);
            onClose && onClose();
          }, 800);
        } else {
          const m = resultMessage || 'Ha ocurrido un error al procesar la solicitud';
          setAlert({ type: 'error', message: m });
          onDone && onDone({ type: 'error', message: m });
          setIsSubmitting(false);
        }
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
              {activeRutas.map((r) => (
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
                {/* Mostrar sólo los buses cuya empresa coincida con la empresa de la ruta seleccionada */}
                {buses
                  .filter(b => {
                    const busEmpresaId = b.empresa_id ?? b.empresa?.id_empresa ?? b.empresa?.id;
                    if (!empresa_id) return true; // si no hay empresa determinada, mostrar todos
                    // mantener el bus actual si estamos editando aunque no coincida
                    if (initialData && String(initialData.id_bus) === String(b.id_bus)) return true;
                    return String(busEmpresaId) === String(empresa_id);
                  })
                  .map((b) => (
                    <option key={b.id_bus} value={String(b.id_bus)}>{`${b.placa || 'Bus ' + b.id_bus} ${b.numero ? '• #' + b.numero : ''}`}</option>
                  ))}
            </select>
            {errors.id_bus && <div className="text-red-600 text-xs mt-1">{errors.id_bus}</div>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Hora de salida</label>
            <input
              type="time"
              name="hora_salida"
              value={form.hora_salida}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.hora_salida ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.hora_salida && <div className="text-red-600 text-xs mt-1">{errors.hora_salida}</div>}
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
