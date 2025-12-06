import React, { useEffect, useState } from 'react';
import { useEmpresas } from '../services/Empresas/hooks';
import { useCreateRuta, useUpdateRuta } from '../services/Rutas/hooks';

const defaultForm = {
  destino: '',
  empresa: '',
  duracion_estimada: '',
  precio: '',
  tipo_servicio: 'parada_corta',
  activa: true,
  moneda: 'bs',
};

const ModalRutas = ({ open, onClose, initialData = null, onSubmit, onDone }) => {
  const { data: empresasData } = useEmpresas();
  const empresas = Array.isArray(empresasData) ? empresasData : [];

  const [form, setForm] = useState({ ...defaultForm });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null); // { type: 'success'|'error', message }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = useCreateRuta();
  const updateMutation = useUpdateRuta();

  useEffect(() => {
    // when modal opens, populate form with initialData or defaults
    if (open) {
      setAlert(null);
      setErrors({});
      setIsSubmitting(false);
      if (initialData) {
        setForm({
          destino: initialData.destino || '',
          empresa: initialData?.id_empresa ? String(initialData.id_empresa) : (initialData.empresa_id ? String(initialData.empresa_id) : ''),
          duracion_estimada: initialData.duracion_estimada || '',
          precio: initialData.precio != null ? String(initialData.precio) : '',
          tipo_servicio: initialData.tipo_servicio || 'parada_corta',
          moneda: initialData.moneda || 'bs',
          descripcion: initialData.descripcion || '',
          activa: typeof initialData.activa === 'boolean' ? initialData.activa : true,
        });
      } else {
        setForm({ ...defaultForm });
      }
    }
  }, [open, initialData]);

  // Ensure the empresa value is synchronized when empresas list loads or changes.
  useEffect(() => {
    if (!open || !initialData) return;
    const candidate = initialData.empresa_id
      ? String(initialData.empresa_id)
      : (initialData.empresa?.id_empresa ? String(initialData.empresa.id_empresa) : '');
    if (!candidate) return;
    // if empresas contains this id (as string), set it explicitly on the form
    const found = empresas.find((e) => String(e.id_empresa) === candidate);
    if (found && form.empresa !== candidate) {
      setForm((f) => ({ ...f, empresa: candidate }));
    }
  }, [empresas, open, initialData]);

  const validate = () => {
    const e = {};
    if (!form.destino || form.destino.trim().length < 2) e.destino = 'Destino requerido';
    if (!form.empresa) e.empresa = 'Seleccione una empresa';
    if (form.precio && isNaN(Number(form.precio))) e.precio = 'Precio inválido';
    if (!form.moneda) e.moneda = 'Seleccione una moneda';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const showSuccess = (msg) => setAlert({ type: 'success', message: msg });
  const showError = (msg) => setAlert({ type: 'error', message: msg });

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const payload = {
      destino: form.destino,
      id_empresa: form.empresa ? Number(form.empresa) : null,
      duracion_estimada: form.duracion_estimada,
      precio: form.precio ? Number(form.precio) : 0,
      moneda: form.moneda || 'bs',
      tipo_servicio: form.tipo_servicio,
      
      activa: !!form.activa,
    };

    
    // If caller provided onSubmit, prefer it (keeps flexibility). Otherwise use internal mutations.
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        const result = onSubmit(payload, initialData);
        if (result && typeof result.then === 'function') await result;
        const msg = initialData ? 'Ruta actualizada correctamente' : 'Ruta registrada correctamente';
        showSuccess(msg);
        onDone && onDone({ type: 'success', message: msg });
        setTimeout(() => {
          setIsSubmitting(false);
          onClose && onClose();
          setAlert(null);
        }, 900);
      } catch (err) {
        const m = (err && (err.message || err.msg)) || 'Error al procesar';
        if (err && err.errors && typeof err.errors === 'object') setErrors(err.errors || {});
        showError(m);
        onDone && onDone({ type: 'error', message: m });
        setIsSubmitting(false);
      }
    } else {
      // use react-query mutations
      setIsSubmitting(true);
      if (initialData && initialData.id_ruta) {
        updateMutation.mutate({ id: initialData.id_ruta, ruta: payload });
      } else {
        createMutation.mutate({ ruta: payload });
      }
    }
  };

  // react to mutation results (create / update)
  useEffect(() => {
    if (createMutation.isSuccess || updateMutation.isSuccess) {
      const msg = createMutation.isSuccess ? 'Ruta registrada correctamente' : 'Ruta actualizada correctamente';
      showSuccess(msg);
      onDone && onDone({ type: 'success', message: msg });
      setTimeout(() => {
        setIsSubmitting(false);
        setAlert(null);
        onClose && onClose();
      }, 900);
    }

    if (createMutation.isError) {
      const err = createMutation.error;
      if (err?.errors && typeof err.errors === 'object') setErrors(err.errors || {});
      const m = err?.message || 'Error al crear ruta';
      showError(m);
      onDone && onDone({ type: 'error', message: m });
      setIsSubmitting(false);
    }

    if (updateMutation.isError) {
      const err = updateMutation.error;
      if (err?.errors && typeof err.errors === 'object') setErrors(err.errors || {});
      const m = err?.message || 'Error al actualizar ruta';
      showError(m);
      onDone && onDone({ type: 'error', message: m });
      setIsSubmitting(false);
    }
  }, [createMutation.isSuccess, updateMutation.isSuccess, createMutation.isError, updateMutation.isError]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/50" onClick={() => onClose && onClose()} />

      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-y-auto mx-auto my-4 sm:my-8 max-h-[calc(100vh-6rem)]">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{initialData ? 'Editar Ruta' : 'Registrar Ruta'}</h3>
            <button onClick={() => onClose && onClose()} className="text-gray-500 hover:text-gray-700">Cerrar</button>
          </div>

          {alert && (
            <div className={`mb-4 p-3 rounded-lg flex items-start gap-3 ${alert.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <svg className={`w-5 h-5 ${alert.type === 'success' ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                {alert.type === 'success' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                )}
              </svg>
              <span className={`${alert.type === 'success' ? 'text-green-800' : 'text-red-800'} font-medium`}>{alert.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                <input name="destino" value={form.destino} onChange={handleChange} placeholder="Ej: Maracay" className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.destino ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.destino && <div className="text-red-600 text-sm mt-1">{errors.destino}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <select name="empresa" value={form.empresa} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.empresa ? 'border-red-500' : 'border-gray-200'}`}>
                  <option value="">Seleccione una empresa</option>
                  {}
                  {empresas.map((e) => (
                    <option key={e.id_empresa} value={String(e.id_empresa)}>{e.nombre_empresa}</option>
                  ))}
                </select>
                {errors.empresa && <div className="text-red-600 text-sm mt-1">{errors.empresa}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duración estimada</label>
                <input name="duracion_estimada" value={form.duracion_estimada} onChange={handleChange} placeholder="HH:MM:SS" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 border-gray-200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input name="precio" value={form.precio} onChange={handleChange} type="number" step="0.01" placeholder="0.00" className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.precio ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.precio && <div className="text-red-600 text-sm mt-1">{errors.precio}</div>}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                  <select name="moneda" value={form.moneda} onChange={handleChange} className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.moneda ? 'border-red-500' : 'border-gray-200'}`}>
                    <option value="bs">Bs</option>
                    <option value="$">$</option>
                  </select>
                  {errors.moneda && <div className="text-red-600 text-sm mt-1">{errors.moneda}</div>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de servicio</label>
                <select name="tipo_servicio" value={form.tipo_servicio} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 border-gray-200">
                  <option value="parada_corta">Parada Corta</option>
                  <option value="directo">Directo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activo</label>
                <div className="flex items-center space-x-3">
                  <label className="inline-flex items-center space-x-2">
                    <input type="checkbox" name="activa" checked={form.activa} onChange={handleChange} className="h-4 w-4" />
                    <span className="text-sm text-gray-700">Ruta activa</span>
                  </label>
                </div>
              </div>
            </div>

            

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button type="button" onClick={() => onClose && onClose()} className="px-4 py-2 rounded bg-gray-100 text-sm">Cancelar</button>
              <button disabled={isSubmitting} type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700 disabled:opacity-60">
                {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Registrar')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalRutas;
