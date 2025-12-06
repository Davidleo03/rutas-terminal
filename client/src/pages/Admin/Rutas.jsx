import { useRutas } from "../../services/Rutas/hooks";

const Rutas = () => {
  console.log('Admin Rutas page rendered');

  // Obtener rutas desde la API usando react-query
  const { data: rutas = [], isLoading, isError, error, refetch } = useRutas();

  const handleEditar = (id_ruta) => {
    console.log('Editar ruta:', id_ruta);
    // Lógica para editar
  };

  const handleEliminar = (id_ruta) => {
    console.log('Eliminar ruta:', id_ruta);
    // Lógica para eliminar
  };

  const handleRegistrar = () => {
    console.log('Registrar nueva ruta');
    // Lógica para registrar nueva ruta
  };

  const handleToggleActiva = (id_ruta, estadoActual) => {
    console.log('Cambiar estado de ruta:', id_ruta, 'Nuevo estado:', !estadoActual);
    // Lógica para cambiar estado activa/inactiva
  };

  // Función para formatear hora
  const formatHora = (hora) => {
    return hora ? hora.substring(0, 5) : '--:--';
  };

  // Función para formatear duración
  const formatDuracion = (duracion) => {
    if (!duracion) return '--:--';
    const partes = duracion.split(':');
    if (partes.length === 3) {
      return `${partes[0]}h ${partes[1]}m`;
    }
    return duracion;
  };

  // Función para formatear precio
  const formatPrecio = (precio) => {
    return `$${precio?.toFixed(2) || '0.00'}`;
  };

  // Función para formatear fecha
  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/admin.jpg')" }}
      >
        <div className="min-h-screen bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
              <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Administración de Rutas</h1>
        <p className="mt-2 text-gray-600">Gestión completa de rutas de transporte — Información detallada y controles.</p>
      </div>

      {/* Botón Registrar Ruta */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={handleRegistrar}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-md w-full sm:w-auto"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Registrar Nueva Ruta
        </button>
        
        {/* Estadísticas rápidas */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-gray-700">{rutas.filter(r => r.activa).length} Activas</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-gray-700">{rutas.filter(r => !r.activa).length} Inactivas</span>
          </div>
        </div>
      </div>

      {/* Tabla Responsiva */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruta ID / Destino
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Empresa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Horario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Detalles
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rutas.map((ruta) => (
                <tr key={ruta.id_ruta} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2">
                          ID: {ruta.id_ruta}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{ruta.destino}</span>
                      </div>
                      
                      {/* Información para móviles */}
                      <div className="mt-2 space-y-1 lg:hidden">
                        <div className="flex items-center text-xs text-gray-600">
                          <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {ruta.empresa.nombre_empresa}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatHora(ruta.hora_salida)} • {formatDuracion(ruta.duracion_estimada)}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          {formatPrecio(ruta.precio)} • {ruta.tipo_servicio || 'Regular'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Creada: {formatFecha(ruta.fecha_creacion)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Empresa - Desktop */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    <div className="font-medium text-gray-900">{ruta.empresa.nombre_empresa}</div>
                    <div className="text-xs text-gray-500">{ruta.empresa.tipo_ruta}</div>
                  </td>

                  {/* Horario - Desktop */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{formatHora(ruta.hora_salida)}</div>
                      <div className="text-xs text-gray-500">{formatDuracion(ruta.duracion_estimada)}</div>
                    </div>
                  </td>

                  {/* Detalles - Desktop Extra Grande */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-gray-500">Precio</div>
                        <div className="font-medium text-green-600">{formatPrecio(ruta.precio)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Servicio</div>
                        <div className="font-medium">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            ruta.tipo_servicio === 'directo' 
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ruta.tipo_servicio || 'Regular'}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-gray-500">Creación</div>
                        <div className="text-xs">{formatFecha(ruta.fecha_creacion)}</div>
                      </div>
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActiva(ruta.id_ruta, ruta.activa)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                        ruta.activa
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      <svg className={`w-3 h-3 mr-1 ${ruta.activa ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        {ruta.activa ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        )}
                      </svg>
                      {ruta.activa ? 'Activa' : 'Inactiva'}
                    </button>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditar(ruta.id_ruta)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 p-1 rounded hover:bg-indigo-50"
                        title="Editar ruta"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEliminar(ruta.id_ruta)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                        title="Eliminar ruta"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1 rounded hover:bg-gray-100"
                        title="Ver detalles"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700 mb-2 sm:mb-0">
              Mostrando <span className="font-medium">{rutas.length}</span> rutas
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje cuando no hay datos */}
      {rutas.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hay rutas registradas</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Comienza registrando tu primera ruta para organizar los horarios y destinos de transporte.
          </p>
          <button
            onClick={handleRegistrar}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar Primera Ruta
          </button>
        </div>
      )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rutas;
