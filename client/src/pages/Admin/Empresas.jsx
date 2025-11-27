import { useEmpresas } from "../../services/Empresas/hooks";

const Empresas = () => {
  const { data: rutas = [], isLoading, isError, error, refetch } = useEmpresas();

  

  const handleEditar = (id) => {
    console.log('Editar ruta:', id);
    // Lógica para editar
  };

  const handleEliminar = (id) => {
    console.log('Eliminar ruta:', id);
    // Lógica para eliminar
  };

  const handleRegistrar = () => {
    console.log('Registrar nueva ruta');
    // Lógica para registrar nueva ruta
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat rounded-lg"
      style={{ backgroundImage: "url('/images/admin.jpg')" }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="p-6">
      {/* Estado de carga */}
      {isLoading && (
        <div className="text-center py-6">
          <div className="inline-flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-slate-700" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-slate-700">Cargando empresas...</span>
          </div>
        </div>
      )}

      {/* Error desde react-query */}
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 mb-6">
          <div className="font-medium">Error cargando empresas</div>
          <div className="text-sm mt-1">{String(error?.message || error)}</div>
          <div className="mt-3">
            <button
              onClick={() => refetch()}
              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Empresas</h1>
        <p className="mt-2 text-gray-600">Área privada —</p>
      </div>

      {/* Botón Registrar Ruta */}
      <div className="mb-6">
        <button
          onClick={handleRegistrar}
          className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Registrar Ruta
        </button>
      </div>

      {/* Tabla Responsiva */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre de la Empresa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  RIF
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Tipo de Ruta
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rutas?.map((ruta) => (
                <tr key={ruta.id_empresa} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ruta.nombre_empresa}</div>
                    {/* Información para móviles */}
                    <div className="sm:hidden text-xs text-gray-500 mt-1">
                      <div>RIF: {ruta.rif}</div>
                      <div>Tipo: {ruta.tipo_ruta}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {ruta.rif}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {ruta.tipo_ruta}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditar(ruta.id_empresa)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEliminar(ruta.id_empresa)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mensaje cuando no hay datos */}
      {rutas?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay rutas registradas. Haz clic en "Registrar Ruta" para agregar la primera.
        </div>
      )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empresas;
