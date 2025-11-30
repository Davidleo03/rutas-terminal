import { useState, useEffect } from 'react';

export function useModalBusesForm(initialData, open) {
  const [form, setForm] = useState({
    placa: '',
    modelo: '',
    empresa: '',
    capacidad: '',
    color: '',
    numero: '',
    aire_acondicionado: false,
    activo: false,
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
        activo: !!initialData.activo,
      });
    } else if (open) {
      setForm({ placa: '', modelo: '', empresa: '', capacidad: '', color: '', numero: '', aire_acondicionado: false, activo: false });
      setErrors({});
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
    setErrors((s) => ({ ...s, [name]: undefined }));
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

  const resetForm = () => {
    setForm({ placa: '', modelo: '', empresa: '', capacidad: '', color: '', numero: '', aire_acondicionado: false, activo: false });
    setErrors({});
  };

  return { form, errors, handleChange, validate, resetForm, setForm, setErrors };
}

export default useModalBusesForm;
