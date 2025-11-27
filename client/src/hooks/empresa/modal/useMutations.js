import { useCreateEmpresa, useUpdateEmpresa } from '../../../services/Empresas/hooks';

export function useModalEmpresaMutations(initialData, onSuccess, onClose, resetForm) {
  const createMutation = useCreateEmpresa();
  const updateMutation = useUpdateEmpresa();

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  const handleSubmit = (form, setSuccessAlert, setErrorAlert, setValidationError, validate) => {
    return (e) => {
      e.preventDefault();
      setValidationError(null);
      
      const validationError = validate();
      if (validationError) return setValidationError(validationError);

      const successMessage = initialData?.id_empresa
        ? 'Empresa actualizada correctamente.'
        : 'Empresa creada correctamente.';

      const commonCallbacks = {
        onSuccess: () => {
          setSuccessAlert(successMessage);
          onSuccess && onSuccess();
          setTimeout(() => {
            resetForm();
            onClose();
          }, 1400);
        },
        onError: (err) => {
          setErrorAlert(String(err?.message || err));
        },
      };

      if (initialData && initialData.id_empresa) {
        updateMutation.mutate(
          { id: initialData.id_empresa, empresa: form },
          commonCallbacks
        );
      } else {
        createMutation.mutate({ empresa: form }, commonCallbacks);
      }
    };
  };

  return {
    createMutation,
    updateMutation,
    isLoading,
    handleSubmit,
  };
}
