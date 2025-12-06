import React from 'react';

const ConfirmDialog = ({ open, title = 'Confirmar', description = '', onCancel, onConfirm, confirmLabel = 'Eliminar', cancelLabel = 'Cancelar' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg mx-auto p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-100 text-sm">{cancelLabel}</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-rose-600 text-white text-sm shadow hover:bg-rose-700">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
