import { useState, useCallback } from 'react';

export function useModalBusesAlerts() {
  const [alert, setAlert] = useState(null);

  const showSuccess = useCallback((message) => {
    setAlert({ type: 'success', message });
  }, []);

  const showError = useCallback((message) => {
    setAlert({ type: 'error', message });
  }, []);

  const clear = useCallback(() => setAlert(null), []);

  return { alert, showSuccess, showError, clear };
}

export default useModalBusesAlerts;
