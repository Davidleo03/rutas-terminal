import { useBusesByEmpresa, useDeleteBus } from '../../services/buses/hooks';
import ModalBusesByEmpresa from '../../components/ModalBusesByEmpresa';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorBox from '../../components/ErrorBox';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useState, useEffect } from 'react';
import useAuthStore from "../../localStore/auth";


const LineaBuses = () => {
  const user = useAuthStore((s) => s.user);

  const { data: busesData, isLoading, isError, error, refetch } = useBusesByEmpresa(user?.id_empresa);
  const deleteMutation = useDeleteBus();

  const [showModal, setShowModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [actionAlert, setActionAlert] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('placa');

  const buses = Array.isArray(busesData) ? busesData : [];

  // Filtrado y ordenamiento
  const filteredBuses = buses
    .filter(bus => {
      const matchesFilter = 
        filter === 'todos' ? true :
        filter === 'activos' ? bus.activo :
        filter === 'inactivos' ? !bus.activo :
        filter === 'con-aire' ? bus.aire_acondicionado :
        filter === 'sin-aire' ? !bus.aire_acondicionado : true;
      
      const matchesSearch = searchTerm === '' || 
        bus.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.chofer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.numero?.toString().includes(searchTerm);
      
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'placa': return a.placa.localeCompare(b.placa);
        case 'capacidad': return b.capacidad - a.capacidad;
        case 'recientes': return new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0);
        default: return 0;
      }
    });

  const handleEditar = (id) => {
    const bus = buses.find(b => b.id_bus === id);
    setSelectedBus(bus || null);
    setShowModal(true);
  };

  const handleEliminar = (id) => {
    if (!id) return;
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!toDeleteId) {
      setConfirmOpen(false);
      return;
    }
    deleteMutation.mutate(toDeleteId);
    setConfirmOpen(false);
    setToDeleteId(null);
  };

  const handleRegistrar = () => {
    setSelectedBus(null);
    setShowModal(true);
  };

  const handleToggleActivo = async (id) => {
    // Aquí iría la lógica para cambiar el estado activo/inactivo
    // Por ahora simulamos un cambio local
    const bus = buses.find(b => b.id_bus === id);
    if (bus) {
      setActionAlert({
        type: 'success',
        message: `Bus ${bus.activo ? 'desactivado' : 'activado'} correctamente`
      });
      setTimeout(() => setActionAlert(null), 3000);
    }
  };

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      setActionAlert({ type: 'success', message: 'Bus eliminado correctamente.' });
      setTimeout(() => setActionAlert(null), 3000);
    }

    if (deleteMutation.isError) {
      setActionAlert({ 
        type: 'error', 
        message: String(deleteMutation.error?.message || deleteMutation.error || 'Error al eliminar') 
      });
      setTimeout(() => setActionAlert(null), 5000);
    }
  }, [deleteMutation.isSuccess, deleteMutation.isError]);

  // Función para obtener color según estado
  const getEstadoColor = (activo) => {
    return activo 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  // Función para obtener color según aire acondicionado
  const getAireColor = (aire) => {
    return aire 
      ? 'bg-cyan-100 text-cyan-800 border-cyan-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Función para formatear fecha
  const formatFecha = (fechaString) => {
    if (!fechaString) return 'No registrada';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <ErrorBox 
          title="Error cargando buses" 
          message={error?.message || 'Error desconocido'} 
          onRetry={() => refetch()} 
          details={error} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6">
      {/* Alertas */}
      {actionAlert && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          actionAlert.type === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {actionAlert.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            {actionAlert.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestión de Flota</h1>
            <p className="mt-2 text-gray-600">Administra la flota de buses asignada a tu línea de transporte.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Flota activa</span>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar buses por placa, modelo, chofer..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
            >
              <option value="todos">Todos los buses</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
              <option value="con-aire">Con aire acond.</option>
              <option value="sin-aire">Sin aire acond.</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
            >
              <option value="placa">Ordenar por: Placa</option>
              <option value="capacidad">Ordenar por: Capacidad</option>
              <option value="recientes">Ordenar por: Más recientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas y Botón Registrar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-4 text-white shadow-lg">
            <div className="text-emerald-100 text-sm font-medium">Total Buses</div>
            <div className="text-2xl font-bold mt-1">{buses.length}</div>
            <div className="text-emerald-200 text-xs mt-1">En flota</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-lg">
            <div className="text-blue-100 text-sm font-medium">Activos</div>
            <div className="text-2xl font-bold mt-1">{buses.filter(b => b.activo).length}</div>
            <div className="text-blue-200 text-xs mt-1">{Math.round((buses.filter(b => b.activo).length / buses.length) * 100) || 0}% operativo</div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-4 text-white shadow-lg">
            <div className="text-cyan-100 text-sm font-medium">Con Aire</div>
            <div className="text-2xl font-bold mt-1">{buses.filter(b => b.aire_acondicionado).length}</div>
            <div className="text-cyan-200 text-xs mt-1">Aire acondicionado</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-white shadow-lg">
            <div className="text-purple-100 text-sm font-medium">Capacidad</div>
            <div className="text-2xl font-bold mt-1">{buses.reduce((sum, bus) => sum + (bus.capacidad || 0), 0)}</div>
            <div className="text-purple-200 text-xs mt-1">Asientos totales</div>
          </div>
        </div>

        {/* Botón Registrar */}
        <button
          onClick={handleRegistrar}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Bus
        </button>
      </div>

      {/* Tabla de Buses */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-lg font-semibold text-gray-800">Flota de Buses</h3>
          <p className="mt-1 text-sm text-gray-500">{filteredBuses.length} buses encontrados</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Especificaciones
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Personal
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Equipamiento
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredBuses.map((bus) => (
                <tr key={bus.id_bus} className="hover:bg-gray-50 transition-colors duration-150">
                  {/* Columna principal - Bus */}
                  <td className="px-5 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-gray-900">{bus.placa}</span>
                          {bus.numero && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              #{bus.numero}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {bus.modelo || 'Modelo no especificado'}
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="text-xs text-gray-500">Color: </div>
                          <div className="ml-1 text-xs font-medium" style={{ color: bus.color || '#6B7280' }}>
                            {bus.color || 'No especificado'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Especificaciones - Desktop */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm text-gray-900">{bus.capacidad || 0} asientos</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Empresa: {bus.empresa || 'No asignada'}
                      </div>
                    </div>
                  </td>

                  {/* Personal - Desktop */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="font-medium text-sm text-gray-900">
                        {bus.chofer || 'Chofer no asignado'}
                      </div>
                      {bus.ci_chofer || bus.cedula ? (
                        <div className="text-xs text-gray-500">
                          CI: {bus.ci_chofer || bus.cedula}
                        </div>
                      ) : null}
                    </div>
                  </td>

                  {/* Equipamiento - Desktop Extra Grande */}
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getAireColor(bus.aire_acondicionado)}`}>
                        {bus.aire_acondicionado ? (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Aire Acond.
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Sin Aire
                          </>
                        )}
                      </span>
                      
                      {bus.fecha_creacion && (
                        <div className="text-xs text-gray-500 mt-1">
                          Registro: {formatFecha(bus.fecha_creacion)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-4">
                    <div className="space-y-2">
                      <button
                        onClick={() => handleToggleActivo(bus.id_bus)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${getEstadoColor(bus.activo)}`}
                      >
                        <svg className={`w-4 h-4 mr-1.5 ${bus.activo ? 'text-emerald-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          {bus.activo ? (
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                        {bus.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditar(bus.id_bus)}
                        className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                        title="Editar bus"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleEliminar(bus.id_bus)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Eliminar bus"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        {filteredBuses.length > 0 ? (
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Mostrando <span className="font-semibold">{filteredBuses.length}</span> de <span className="font-semibold">{buses.length}</span> buses
              </div>
              <div className="text-xs text-gray-500">
                Capacidad total: {filteredBuses.reduce((sum, bus) => sum + (bus.capacidad || 0), 0)} asientos disponibles
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron buses</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `No hay buses que coincidan con "${searchTerm}"`
                : 'No hay buses que coincidan con los filtros seleccionados'}
            </p>
            {(searchTerm || filter !== 'todos') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('todos');
                }}
                className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Información de ayuda */}
      <div className="mt-8 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-emerald-900">Información importante</h3>
            <p className="mt-2 text-emerald-800 text-sm">
              • Los buses marcados como "Inactivos" no estarán disponibles para asignación a rutas.<br/>
              • La capacidad se refiere al número total de asientos disponibles en el bus.<br/>
              • Los cambios de estado se reflejan inmediatamente en el sistema operativo.<br/>
              • El color del bus es informativo para identificación visual.
            </p>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalBusesByEmpresa
        open={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedBus}
        onDone={(info) => {
          if (info?.type === 'success') {
            refetch();
          }
          setActionAlert(info);
          setTimeout(() => setActionAlert(null), 3000);
        }}
      />
      
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar bus"
        description={(() => {
          const b = buses.find((x) => x.id_bus === toDeleteId);
          return b ? `¿Eliminar el bus ${b.placa} (${b.modelo || 'sin modelo'})? Esta acción eliminará todos los registros asociados y no se puede deshacer.` 
                  : '¿Eliminar este bus? Esta acción no se puede deshacer.';
        })()}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmLabel="Eliminar definitivamente"
        cancelLabel="Cancelar"
        confirmColor="red"
      />
    </div>
  );
};

export default LineaBuses;