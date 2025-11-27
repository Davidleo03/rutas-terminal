import React, { useEffect, useState } from 'react';
import { useCreateBus, useUpdateBus } from '../services/buses/hooks';
import { useEmpresas} from '../services/Empresas/hooks';

const ModalBuses = ({ open, onClose, initialData = null, onDone }) => {
  const createMutation = useCreateBus();
  const updateMutation = useUpdateBus();
  const { data: empresasData } = useEmpresas();
  const empresas = Array.isArray(empresasData) ? empresasData : [];


  const [form, setForm] = useState({
    placa: '',
    modelo: '',
    empresa: '',
    capacidad: '',
    color: '',
    numero: '',
    aire_acondicionado: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        placa: initialData.placa || '',
        modelo: initialData.modelo || '',
        empresa: initialData.empresa_id || initialData.empresa || '',
        capacidad: initialData.capacidad || '',
        color: initialData.color || '',
        numero: initialData.numero || '',
        aire_acondicionado: !!initialData.aire_acondicionado,
      });
    } else {
      setForm({ placa: '', modelo: '', empresa: '', capacidad: '', color: '', numero: '', aire_acondicionado: false });
    }
  }, [initialData, open]);

  useEffect(() => {
    if (createMutation.isSuccess || updateMutation.isSuccess) {
      const msg = createMutation.isSuccess ? 'Bus registrado correctamente' : 'Bus actualizado correctamente';
      onDone && onDone({ type: 'success', message: msg });
      setTimeout(() => onClose && onClose(), 600);
    }
    if (createMutation.isError) {
      onDone && onDone({ type: 'error', message: createMutation.error?.message || 'Error al crear' });
    }
    if (updateMutation.isError) {
      onDone && onDone({ type: 'error', message: updateMutation.error?.message || 'Error al actualizar' });
    }
  }, [createMutation.isSuccess, updateMutation.isSuccess, createMutation.isError, updateMutation.isError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
    setErrors((s) => ({ ...s, [name]: undefined }));
  };

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
      aire_acondicionado: !!form.aire_acondicionado,
    };

    if (initialData && initialData.id_bus) {
      updateMutation.mutate({ busId: initialData.id_bus, busData: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const validate = () => {
    const next = {};
    if (!form.placa || !form.placa.toString().trim()) next.placa = 'La placa es requerida';
    if (!form.modelo || !form.modelo.toString().trim()) next.modelo = 'El modelo es requerido';
    if (form.capacidad === '' || Number.isNaN(Number(form.capacidad)) || Number(form.capacidad) <= 0) next.capacidad = 'La capacidad debe ser un número mayor a 0';
    if (!form.numero || !form.numero.toString().trim()) next.numero = 'El número es requerido';
    setErrors(next);
    return Object.keys(next).length === 0;
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
                <select name="empresa" value={form.empresa} onChange={handleChange} className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 border-gray-200">
                  <option value="">Seleccione una empresa</option>
                  {empresas.map((e) => (
                    <option key={e.id_empresa} value={e.id_empresa}>{e.nombre_empresa}</option>
                  ))}
                </select>
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

            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" name="aire_acondicionado" checked={form.aire_acondicionado} onChange={handleChange} className="h-4 w-4" />
                <span className="text-sm text-gray-700">Aire Acondicionado</span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4">
              <button type="button" onClick={() => onClose && onClose()} className="px-4 py-2 rounded bg-gray-100 text-sm">Cancelar</button>
              <button disabled={createMutation.isLoading || updateMutation.isLoading} type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700">
                {(createMutation.isLoading || updateMutation.isLoading) ? 'Guardando...' : (initialData ? 'Actualizar' : 'Registrar')}
              </button>
            </div>

            {(createMutation.isError || updateMutation.isError) && (
              <div className="text-red-600 text-sm">{createMutation.error?.message || updateMutation.error?.message || 'Error procesando'}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalBuses;
