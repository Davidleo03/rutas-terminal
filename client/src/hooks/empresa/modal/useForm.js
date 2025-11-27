import { useState, useEffect } from 'react';

export function useModalEmpresaForm(initialData, isOpen) {
  const [form, setForm] = useState(() => ({
    nombre_empresa: initialData?.nombre_empresa || '',
    rif: initialData?.rif || '',
    tipo_ruta: initialData?.tipo_ruta || initialData?.tipo_empresa || 'urbana',
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.nombre_empresa.trim()) return 'El nombre de la empresa es requerido.';
    if (!form.rif.trim()) return 'El RIF es requerido.';
    if (!['urbana', 'extra-urbana'].includes(form.tipo_ruta)) return 'Tipo de ruta inválido.';
    return null;
  };

  const resetForm = () => {
    setForm({
      nombre_empresa: '',
      rif: '',
      tipo_ruta: 'urbana',
    });
  };

  // Initialize or clear form when modal opens/closes or when editing data changes
  useEffect(() => {
    if (isOpen) {
      setForm({
        nombre_empresa: initialData?.nombre_empresa || '',
        rif: initialData?.rif || '',
        tipo_ruta: initialData?.tipo_ruta || initialData?.tipo_empresa || 'urbana',
      });
    } else {
      resetForm();
    }
  }, [isOpen, initialData]);

  return {
    form,
    setForm,
    handleChange,
    validate,
    resetForm,
  };
}
