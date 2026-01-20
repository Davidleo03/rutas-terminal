import React, { useEffect } from 'react';
import { useEmpresas } from '../services/Empresas/hooks';
import useModalBusesForm from '../hooks/buses/useModalBusesForm';
import useModalBusesMutations from '../hooks/buses/useModalBusesMutations';
import useModalBusesAlerts from '../hooks/buses/useModalBusesAlerts';
import useAuthStore from '../localStore/auth';

const ModalBusesByEmpresa = ({ open, onClose, initialData = null, onDone }) => {
  const { createMutation, updateMutation } = useModalBusesMutations();
  const { data: empresasData } = useEmpresas();
  const empresas = Array.isArray(empresasData) ? empresasData : [];
  const { form, errors, handleChange, validate, resetForm, setForm, setErrors } = useModalBusesForm(initialData, open);
  const { alert, showSuccess, showError, clear } = useModalBusesAlerts();
  const user = useAuthStore((s) => s.user);

  // Ensure empresa is set from logged user's empresa when available
  useEffect(() => {
    if (!open) return;
    if (user?.id_empresa && String(form.empresa) !== String(user.id_empresa)) {
      setForm((f) => ({ ...f, empresa: String(user.id_empresa) }));
    }
  }, [user, open, setForm, form.empresa]);

  // form hook handles initialData/open updates

  useEffect(() => {
    // clear alerts when modal opens
    if (open) clear();

    if (createMutation.isSuccess || updateMutation.isSuccess) {
      const msg = createMutation.isSuccess ? 'Bus registrado correctamente' : 'Bus actualizado correctamente';
      showSuccess(msg);
      onDone && onDone({ type: 'success', message: msg });
      setTimeout(() => {
        clear();
        onClose && onClose();
      }, 1000);
    }

    if (createMutation.isError) {
      const err = createMutation.error;
      if (err?.errors && typeof err.errors === 'object') {
        setErrors(err.errors || {});
      }
      const m = err?.message || 'Error al crear';
      showError(m);
      onDone && onDone({ type: 'error', message: m });
    }

    if (updateMutation.isError) {
      const err = updateMutation.error;
      if (err?.errors && typeof err.errors === 'object') {
        setErrors(err.errors || {});
      }
      const m = err?.message || 'Error al actualizar';
      showError(m);
      onDone && onDone({ type: 'error', message: m });
    }
  }, [
    createMutation.isSuccess,
    updateMutation.isSuccess,
    createMutation.isError,
    updateMutation.isError,
  ]);

  // handleChange provided by the form hook

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      placa: form.placa,
      modelo: form.modelo,
      empresa_id: form.empresa ? Number(form.empresa) : null,
      capacidad: Number(form.capacidad) || 0,
      color: form.color,
      numero: form.numero,
      chofer: form.chofer || null,
      ci_chofer: form.ci_chofer || null,
      aire_acondicionado: !!form.aire_acondicionado,
      activo: !!form.activo,
    };

    if (initialData && initialData.id_bus) {
      updateMutation.mutate({ busId: initialData.id_bus, busData: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => onClose && onClose()} />

      <div className="relative bg-white w-full h-full sm:h-auto sm:rounded-lg sm:max-w-lg mx-4 sm:mx-0 overflow-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{initialData ? 'Editar Bus' : 'Registrar Bus'}</h3>
            <button onClick={() => onClose && onClose()} className="text-gray-500 hover:text-gray-700">Cerrar</button>
          </div>

          {/* Alert profesional dentro del modal */}
          {alert && (
            <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${alert.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {alert.type === 'success' ? (
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className={alert.type === 'success' ? 'text-green-800 font-medium' : 'text-red-800 font-medium'}>{alert.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                <input name="placa" value={form.placa} onChange={handleChange} placeholder="Ej: ABC123" className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.placa ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.placa && <div className="text-red-600 text-sm mt-1">{errors.placa}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Ej: Mercedes O500" className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.modelo ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.modelo && <div className="text-red-600 text-sm mt-1">{errors.modelo}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input type="hidden" name="empresa" value={form.empresa} />
                <div className="w-full px-3 py-2 border rounded bg-gray-50 text-gray-700">
                  {(() => {
                    const name = empresas.find((e) => String(e.id_empresa) === String(form.empresa))?.nombre_empresa;
                    if (name) return name;
                    if (user?.id_empresa) return `Empresa asignada (ID: ${String(user.id_empresa)})`;
                    return 'Empresa asignada automáticamente';
                  })()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                <input name="capacidad" value={form.capacidad} onChange={handleChange} placeholder="Ej: 45" type="number" className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.capacidad ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.capacidad && <div className="text-red-600 text-sm mt-1">{errors.capacidad}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input name="color" value={form.color} onChange={handleChange} placeholder="Ej: Azul" className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input name="numero" value={form.numero} onChange={handleChange} placeholder="Ej: 001" className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.numero ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.numero && <div className="text-red-600 text-sm mt-1">{errors.numero}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chofer</label>
                <input name="chofer" value={form.chofer} onChange={handleChange} placeholder="Nombre del chofer" className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.chofer ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.chofer && <div className="text-red-600 text-sm mt-1">{errors.chofer}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula (CI)</label>
                <input name="ci_chofer" value={form.ci_chofer} onChange={handleChange} placeholder="Ej: V12345678" className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.ci_chofer ? 'border-red-500' : 'border-gray-200'}`} />
                {errors.ci_chofer && <div className="text-red-600 text-sm mt-1">{errors.ci_chofer}</div>}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" name="aire_acondicionado" checked={form.aire_acondicionado} onChange={handleChange} className="h-4 w-4" />
                <span className="text-sm text-gray-700">Aire Acondicionado</span>
              </label>
            </div>

            <div className="flex items-center space-x-3 mt-2">
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="h-4 w-4" />
                <span className="text-sm text-gray-700">Activo</span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4">
              <button type="button" onClick={() => onClose && onClose()} className="px-4 py-2 rounded bg-gray-100 text-sm">Cancelar</button>
              <button disabled={createMutation.isLoading || updateMutation.isLoading} type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700">
                {(createMutation.isLoading || updateMutation.isLoading) ? 'Guardando...' : (initialData ? 'Actualizar' : 'Registrar')}
              </button>
            </div>

            {/* errors are shown above as modal alerts */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalBusesByEmpresa;