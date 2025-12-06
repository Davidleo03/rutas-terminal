import { useBuses, useDeleteBus } from '../../services/buses/hooks';
import ModalBuses from '../../components/ModalBuses';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorBox from '../../components/ErrorBox';

import { useState } from 'react';

const Buses = () => {

  const { data: busesData, isLoading, isError, error, refetch } = useBuses();
  const deleteMutation = useDeleteBus();

  const [showModal, setShowModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [alert, setAlert] = useState(null);

  

  const buses = Array.isArray(busesData) ? busesData : [];

  const handleEditar = (id) => {
    const bus = buses.find(b => b.id_bus === id);
    setSelectedBus(bus || null);
    setShowModal(true);
  };

  const handleEliminar = (id) => {
    if (!id) return;
    if (!confirm('¿Eliminar este bus?')) return;
    deleteMutation.mutate(id);
  };

  const handleRegistrar = () => {
    setSelectedBus(null);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen p-6">
        <ErrorBox title="Error cargando buses" message={error?.message || 'Error desconocido'} onRetry={() => refetch()} details={error} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {alert && (
        <div className={`fixed top-4 right-4 z-40 px-4 py-2 rounded ${alert.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {alert.message}
        </div>
      )}
      <img
        src="/images/admin.jpg"
        alt="Admin background"
        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-60"
      />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <div className="relative p-4 sm:p-6 z-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Administración de Buses</h1>
          <p className="mt-2 text-gray-200">Gestión completa de la flota de buses — sólo usuarios autenticados.</p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 mb-3.5 gap-4">
          <div className="bg-green-50/80 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 font-semibold">Total de Buses</div>
            <div className="text-2xl font-bold text-green-600">{buses.length}</div>
          </div>
          <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-800 font-semibold">Con Aire Acond.</div>
            <div className="text-2xl font-bold text-blue-600">
              {buses.filter(bus => bus.aire_acondicionado).length}
            </div>
          </div>

        </div>

        {/* Botón Registrar Bus - Color verde para diferenciar */}
          <div className="mb-6">
            <button
              onClick={handleRegistrar}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Registrar Bus
            </button>
          </div>

        {/* Tabla Responsiva */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Modelo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Empresa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Capacidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Color
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Número
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Aire Acond.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Activo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {buses?.map((bus) => (
                  <tr key={bus.id_bus} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bus.placa}</div>
                      {/* Información para móviles */}
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                        <div><span className="font-semibold">Modelo:</span> {bus.modelo}</div>
                        <div><span className="font-semibold">Empresa:</span> {bus.empresa}</div>
                        <div><span className="font-semibold">Capacidad:</span> {bus.capacidad} asientos</div>
                        <div><span className="font-semibold">Aire Acond.:</span>
                          <span className={`ml-1 ${bus.aire_acondicionado ? 'text-green-600' : 'text-red-600'}`}>
                            {bus.aire_acondicionado ? 'Sí' : 'No'}
                          </span>
                        </div>
                        <div><span className="font-semibold">Activo:</span>
                          <span className={`ml-1 ${bus.activo ? 'text-green-600' : 'text-red-600'}`}>
                            {bus.activo ? 'Sí' : 'No'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {bus.modelo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {bus.empresa}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {bus.capacidad} asientos
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {bus.color}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {bus.numero}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {bus.aire_acondicionado ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Sí
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {bus.activo ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditar(bus.id_bus)}
                          className="text-amber-600 hover:text-amber-800 transition-colors duration-200 p-1 rounded hover:bg-amber-50"
                          title="Editar bus"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEliminar(bus.id_bus)}
                          className="text-rose-600 hover:text-rose-800 transition-colors duration-200 p-1 rounded hover:bg-rose-50"
                          title="Eliminar bus"
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
        {buses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay buses registrados. Haz clic en "Registrar Bus" para agregar el primero.
          </div>
        )}

      </div>
      <ModalBuses
        open={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedBus}
        onDone={(info) => {
          setAlert(info);
          setTimeout(() => setAlert(null), 3000);
        }}
      />
    </div>
  );
};

export default Buses;