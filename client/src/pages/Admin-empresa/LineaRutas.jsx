import { useRutas, useCreateRuta, useUpdateRuta, useDeleteRuta } from "../../services/Rutas/hooks";
import { useState, useEffect } from 'react';
import ModalRutas from '../../components/ModalRutas';
import ConfirmDialog from '../../components/ConfirmDialog';

const LineaRutas = () => {
  
  // Obtener rutas desde la API usando react-query
  const { data: rutas = [], isLoading, isError, error, refetch } = useRutas();

  const handleEditar = (id_ruta) => {
    const ruta = rutas.find(r => r.id_ruta === id_ruta);
    if (ruta) setEditing(ruta);
    setOpenModal(true);
  };

  const handleRegistrar = () => {
    setEditing(null);
    setOpenModal(true);
  };

  // Estados para modales y mutaciones
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const createMutation = useCreateRuta();
  const updateMutation = useUpdateRuta();
  const deleteMutation = useDeleteRuta();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [actionAlert, setActionAlert] = useState(null);
  const [filter, setFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const handleModalSubmit = async (payload, initialData) => {
    if (initialData && initialData.id_ruta) {
      // update
      await updateMutation.mutateAsync({ id: initialData.id_ruta, ruta: payload });
    } else {
      // create
      await createMutation.mutateAsync({ ruta: payload });
    }
  };

  const handleModalDone = (res) => {
    if (res?.type === 'success') {
      refetch();
    }
  };

  const handleToggleActiva = async (id_ruta, estadoActual) => {
    try {
      const ruta = rutas.find(r => r.id_ruta === id_ruta);
      if (ruta) {
        await updateMutation.mutateAsync({
          id: id_ruta,
          ruta: { activa: !estadoActual }
        });
        setActionAlert({
          type: 'success',
          message: `Ruta ${!estadoActual ? 'activada' : 'desactivada'} correctamente`
        });
        setTimeout(() => setActionAlert(null), 3000);
      }
    } catch (error) {
      setActionAlert({
        type: 'error',
        message: 'Error al cambiar estado'
      });
      setTimeout(() => setActionAlert(null), 5000);
    }
  };

  const handleEliminar = (id_ruta) => {
    if (!id_ruta) return;
    const ruta = rutas.find(r => r.id_ruta === id_ruta);
    setToDelete({ 
      id: id_ruta,
      label: ruta?.destino || `Ruta ID: ${id_ruta}`
    });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteMutation.mutate(toDelete);
    setConfirmOpen(false);
  };

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      setActionAlert({ type: 'success', message: 'Ruta eliminada correctamente.' });
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

  // Filtrado y búsqueda
  const filteredRutas = rutas.filter(ruta => {
    const matchesFilter = 
      filter === 'todas' ? true :
      filter === 'activas' ? ruta.activa :
      filter === 'inactivas' ? !ruta.activa :
      filter === 'directo' ? ruta.tipo_servicio === 'directo' :
      filter === 'express' ? ruta.tipo_servicio === 'express' : true;
    
    const matchesSearch = searchTerm === '' || 
      ruta.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.empresa.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(ruta.id_ruta).includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });

  // Función para formatear duración
  const formatDuracion = (duracion) => {
    if (!duracion) return '--:--';
    const partes = duracion.split(':');
    if (partes.length >= 2) {
      return `${partes[0]}h ${partes[1]}m`;
    }
    return duracion;
  };

  // Mostrar destino con prefijo según tipo de empresa
  const displayDestino = (ruta) => {
    const tipo = String(ruta?.empresa?.tipo_ruta).toLowerCase();
    if (tipo.includes('extra-urbana')) return `SJ/${ruta.destino}`;
    if (tipo.includes('urbana')) return `TER/${ruta.destino}`;
    return ruta.destino;
  };

  // Función para formatear precio con moneda
  const formatPrecio = (precio, moneda = 'bs') => {
    const symbol = moneda === '$' ? '$' : 'Bs ';
    return `${symbol}${(precio != null ? Number(precio).toFixed(2) : '0.00')}`;
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

  // Función para obtener color según tipo de ruta
  const getTipoRutaColor = (tipo) => {
    switch(tipo) {
      case 'urbana': return 'bg-blue-100 text-blue-800';
      case 'extra-urbana': return 'bg-purple-100 text-purple-800';
      case 'interurbana': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener color según tipo de servicio
  const getServicioColor = (servicio) => {
    switch(servicio) {
      case 'directo': return 'bg-green-100 text-green-800';
      case 'express': return 'bg-red-100 text-red-800';
      case 'parada_larga': return 'bg-indigo-100 text-indigo-800';
      case 'parada_corta': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Si está cargando
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Si hay error
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error cargando rutas</h3>
              <p className="mt-2 text-red-700">{error?.message || 'Error desconocido'}</p>
              <button
                onClick={() => refetch()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestión de Rutas</h1>
            <p className="mt-2 text-gray-600">Administra las rutas asignadas a tu línea de transporte.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Línea activa</span>
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
                placeholder="Buscar rutas por destino, empresa o ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('todas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'todas' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({rutas.length})
            </button>
            <button
              onClick={() => setFilter('activas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'activas' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Activas ({rutas.filter(r => r.activa).length})
            </button>
            <button
              onClick={() => setFilter('inactivas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'inactivas' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactivas ({rutas.filter(r => !r.activa).length})
            </button>
            <button
              onClick={() => setFilter('directo')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === 'directo' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Directo
            </button>
          </div>
        </div>
      </div>

      {/* Botón Registrar y Estadísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button
          onClick={handleRegistrar}
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl w-full sm:w-auto"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Ruta
        </button>
        
        {/* Estadísticas */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow border border-gray-100">
            <div className="flex items-center mr-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">{rutas.length}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Total Rutas</div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                <span className="font-medium">{rutas.filter(r => r.activa).length} activas</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow border border-gray-100">
            <div className="flex items-center mr-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Operativas</div>
              <div className="font-medium">{Math.round((rutas.filter(r => r.activa).length / rutas.length) * 100) || 0}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Rutas */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-lg font-semibold text-gray-800">Rutas Registradas</h3>
          <p className="mt-1 text-sm text-gray-500">{filteredRutas.length} rutas encontradas</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruta
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Empresa & Tipo
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Duración & Precio
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Servicio
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
              {filteredRutas.map((ruta) => (
                <tr key={ruta.id_ruta} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-5 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2">
                            #{ruta.id_ruta}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{displayDestino(ruta)}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Creada: {formatFecha(ruta.fecha_creacion)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Empresa & Tipo */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="font-medium text-gray-900">{ruta.empresa.nombre_empresa}</div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTipoRutaColor(ruta.empresa.tipo_ruta)}`}>
                        {ruta.empresa.tipo_ruta}
                      </span>
                    </div>
                  </td>

                  {/* Duración & Precio */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm text-gray-900">
                        <svg className="w-4 h-4 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDuracion(ruta.duracion_estimada)}
                      </div>
                      <div className="mt-1 font-medium text-emerald-600">
                        {formatPrecio(ruta.precio, ruta.moneda)}
                      </div>
                    </div>
                  </td>

                  {/* Servicio */}
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getServicioColor(ruta.tipo_servicio)}`}>
                      {ruta.tipo_servicio || 'Regular'}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleActiva(ruta.id_ruta, ruta.activa)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                        ruta.activa
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <svg className={`w-4 h-4 mr-1.5 ${ruta.activa ? 'text-emerald-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
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
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditar(ruta.id_ruta)}
                        className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                        title="Editar ruta"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEliminar(ruta.id_ruta)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Eliminar ruta"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        title="Ver detalles"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        {filteredRutas.length > 0 ? (
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Mostrando <span className="font-semibold">{filteredRutas.length}</span> de <span className="font-semibold">{rutas.length}</span> rutas
              </div>
              <div className="text-sm text-gray-600">
                Última actualización: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron rutas</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `No hay rutas que coincidan con "${searchTerm}"`
                : 'No hay rutas que coincidan con los filtros seleccionados'}
            </p>
            {(searchTerm || filter !== 'todas') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('todas');
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
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-indigo-900">Información importante</h3>
            <p className="mt-2 text-indigo-800 text-sm">
              • Las rutas marcadas como "Inactivas" no estarán disponibles para los usuarios.<br/>
              • El prefijo en el destino indica el tipo de ruta: SJ/ (Extra-urbana), TER/ (Urbana).<br/>
              • Los cambios de estado se reflejan inmediatamente en el sistema operativo.
            </p>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalRutas
        open={openModal}
        onClose={() => setOpenModal(false)}
        initialData={editing}
        onSubmit={handleModalSubmit}
        onDone={handleModalDone}
      />
      
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar ruta"
        description={`¿Estás seguro que deseas eliminar la ruta "${toDelete?.label || ''}"? Esta acción no se puede deshacer y afectará todos los horarios asociados.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        confirmLabel="Eliminar definitivamente"
        cancelLabel="Cancelar"
        confirmColor="red"
      />
    </div>
  );
};

export default LineaRutas;