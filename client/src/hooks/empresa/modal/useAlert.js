import { useState, useEffect } from 'react';

export function useModalEmpresaAlert(isOpen) {
  const [localError, setLocalError] = useState(null);
  const [alert, setAlert] = useState(null); // {type: 'success'|'error', message: ''}

  const clearErrors = () => {
    setLocalError(null);
    setAlert(null);
  };

  const setErrorAlert = (message) => {
    setAlert({ type: 'error', message });
  };

  const setSuccessAlert = (message) => {
    setAlert({ type: 'success', message });
  };

  const setValidationError = (message) => {
    setLocalError(message);
  };

  // Limpiar alertas cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      clearErrors();
    }
  }, [isOpen]);

  return {
    localError,
    alert,
    clearErrors,
    setErrorAlert,
    setSuccessAlert,
    setValidationError,
    setLocalError,
    setAlert,
  };
}
