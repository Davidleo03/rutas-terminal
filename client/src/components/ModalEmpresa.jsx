import { useModalEmpresaForm } from '../hooks/empresa/modal/useForm';
import { useModalEmpresaAlert } from '../hooks/empresa/modal/useAlert';
import { useModalEmpresaMutations } from '../hooks/empresa/modal/useMutations.js';

export default function ModalEmpresa({ isOpen, onClose, initialData = null, onSuccess }) {
  const { form, handleChange, validate, resetForm } = useModalEmpresaForm(initialData, isOpen);
  const { localError, alert, clearErrors, setErrorAlert, setSuccessAlert, setValidationError } = useModalEmpresaAlert(isOpen);
  const { isLoading, handleSubmit } = useModalEmpresaMutations(
    initialData,
    onSuccess,
    onClose,
    resetForm
  );

  // Clear errors and alerts when modal opens/closes
  if (isOpen && !alert && !localError) {
    // Errors will be cleared by useModalEmpresaAlert on initial render
  }

  const onSubmit = handleSubmit(form, setSuccessAlert, setErrorAlert, setValidationError, validate);

  // If modal is closed, don't render
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex mt-50 items-center justify-center animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-sm"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      <div className="relative w-full sm:w-full md:w-3/5 lg:w-2/5">
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-auto animate-in slide-in-from-bottom-10 duration-300 sm:scale-in-95"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{initialData ? 'Editar Empresa' : 'Nueva Empresa'}</h3>
            </div>
            <button
              type="button"
              onClick={() => { if (!isLoading) onClose(); }}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Alert profesional */}
          {alert && (
            <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-200 ${alert.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
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

          {localError && (
            <div className="mb-4 p-4 rounded-lg flex items-start gap-3 bg-amber-50 border border-amber-200 animate-in slide-in-from-top-2 duration-200">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-amber-800 font-medium">{localError}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Nombre de la Empresa</label>
              <input
                name="nombre_empresa"
                value={form.nombre_empresa}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-0 focus:border-transparent shadow-sm hover:border-gray-400"
                placeholder="Ej: Transportes Pérez"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">RIF</label>
              <input
                name="rif"
                value={form.rif}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-0 focus:border-transparent shadow-sm hover:border-gray-400"
                placeholder="J-12345678-9"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Tipo de Ruta</label>
              <select
                name="tipo_ruta"
                value={form.tipo_ruta}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-0 focus:border-transparent shadow-sm hover:border-gray-400 bg-white cursor-pointer"
              >
                <option value="urbana">Urbana</option>
                <option value="extra-urbana">Extra urbana</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-all duration-200 hover:shadow-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 text-white font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {isLoading  ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
