import React, { useState, useEffect } from 'react';
import ModalRegistroTRByEmpresa from '../../components/ModalRegistroTRByEmpresa';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorBox from '../../components/ErrorBox';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useRutasTRByEmpresa, useCreateRutaTR, useUpdateRutaTR, useDeleteRutaTR } from '../../services/Rutas_RT/hooks';
import useAuthStore from "../../localStore/auth";


const LineaRutasTiempoReal = () => {
  const user = useAuthStore((s) => s.user);

  // Hooks para datos en tiempo real
  const { 
    data: registrosData = [], 
    isLoading: isLoadingRegistros, 
    isError: isErrorRegistros, 
    error: errorRegistros, 
    refetch: refetchRegistros 
  } = useRutasTRByEmpresa(user?.id_empresa);
  console.log(registrosData)
  
  const createRutaTR = useCreateRutaTR();
  const updateRutaTR = useUpdateRutaTR();
  const deleteRutaTR = useDeleteRutaTR();

  // Estados locales
  const [registrosLocal, setRegistrosLocal] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [actionAlert, setActionAlert] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('reciente');

  // Auto-dismiss alert
  useEffect(() => {
    if (!actionAlert) return;
    const timer = setTimeout(() => setActionAlert(null), 4000);
    return () => clearTimeout(timer);
  }, [actionAlert]);

  // Datos combinados
  const registros = registrosData && registrosData.length ? registrosData : registrosLocal;

  // Filtrado y ordenamiento
  const filteredRegistros = registros
    .filter(registro => {
      const matchesFilter = 
        filter === 'todos' ? true :
        filter === 'alta-ocupacion' ? calcularOcupacion(registro) >= 80 :
        filter === 'media-ocupacion' ? calcularOcupacion(registro) >= 50 && calcularOcupacion(registro) < 80 :
        filter === 'baja-ocupacion' ? calcularOcupacion(registro) < 50 :
        filter === 'activas' ? registro.ruta.activa && registro.bus.activo :
        true;
      
      const matchesSearch = searchTerm === '' || 
        registro.ruta.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.bus.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.bus.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(registro.id_registro).includes(searchTerm);
      
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'reciente': return new Date(b.fecha_registro || 0) - new Date(a.fecha_registro || 0);
        case 'ocupacion': return calcularOcupacion(b) - calcularOcupacion(a);
        case 'destino': return a.ruta.destino.localeCompare(b.ruta.destino);
        case 'hora': return a.hora_salida?.localeCompare(b.hora_salida || '');
        default: return 0;
      }
    });

  // Handlers
  const handleEditar = (id_registro) => {
    const reg = registros.find(r => r.id_registro === id_registro);
    if (!reg) return;
    setEditingRegistro(reg);
    setOpenModal(true);
  };

  const handleEliminar = (id_registro) => {
    setApiError(null);
    setToDeleteId(id_registro);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDeleteId) return;
    setApiError(null);
    try {
      await deleteRutaTR.mutateAsync({ id: toDeleteId });
      setConfirmOpen(false);
      setToDeleteId(null);
      setActionAlert({ type: 'success', message: 'Registro eliminado correctamente' });
      refetchRegistros();
    } catch (err) {
      console.error('Error borrando registro', err);
      setApiError(err);
      setActionAlert({ type: 'error', message: 'Error al eliminar el registro' });
    }
  };

  const handleNuevoRegistro = () => {
    setEditingRegistro(null);
    setOpenModal(true);
  };

  const handleActualizar = () => {
    refetchRegistros();
    setActionAlert({ type: 'info', message: 'Datos actualizados correctamente' });
  };

  // Submit handler para modal
  const handleRegistroSubmit = async (payload, initialData) => {
    try {
      if (initialData && initialData.id_registro) {
        const res = await updateRutaTR.mutateAsync({ 
          id: initialData.id_registro, 
          datosActualizados: payload 
        });
        return res;
      }
      const res = await createRutaTR.mutateAsync({ nuevaRuta: payload });
      return res;
    } catch (err) {
      console.error('Error en handleRegistroSubmit', err);
      throw err;
    }
  };

  // Función para formatear hora
  const formatHora = (hora) => {
    if (!hora) return '--:--';
    return hora.substring(0, 5);
  };

  // Función para formatear duración
  const formatDuracion = (duracion) => {
    if (!duracion) return '--:--';
    const partes = duracion.split(':');
    if (partes.length >= 2) {
      const horas = parseInt(partes[0]);
      const minutos = parseInt(partes[1]);
      if (horas > 0) return `${horas}h ${minutos}m`;
      return `${minutos}m`;
    }
    return duracion;
  };

  // Función para formatear precio
  const formatPrecio = (precio, moneda) => {
    const simbolo = moneda === 'bs' ? 'Bs.' : '$';
    return `${simbolo}${precio?.toFixed(2) || '0.00'}`;
  };

  // Función para formatear fecha y hora
  const formatFechaHora = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Calcular porcentaje de ocupación
  const calcularOcupacion = (registro) => {
    const capacidad = registro.bus.capacidad;
    const disponibles = registro.asientos_disponibles;
    const ocupados = capacidad - disponibles;
    
    return Math.round((ocupados / capacidad) * 100) || 0;
  };

  // Obtener color según ocupación
  const getColorOcupacion = (porcentaje) => {
    if (porcentaje < 50) return 'bg-emerald-100 text-emerald-800';
    if (porcentaje < 80) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  // Obtener clase para barra de ocupación
  const getClaseBarraOcupacion = (porcentaje) => {
    if (porcentaje < 50) return 'bg-emerald-500';
    if (porcentaje < 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Obtener estado del bus
  const getEstadoBus = (bus) => {
    if (!bus.activo) return { texto: 'Inactivo', clase: 'bg-red-100 text-red-800 border-red-200' };
    return { texto: 'Activo', clase: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  // Obtener estado de la ruta
  const getEstadoRuta = (ruta) => {
    if (!ruta.activa) return { texto: 'Inactiva', clase: 'bg-red-100 text-red-800 border-red-200' };
    return { texto: 'Activa', clase: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  // Función para obtener color del bus
  const getColorBus = (color) => {
    const colores = {
      'Verde': 'bg-emerald-500',
      'Azul': 'bg-blue-500',
      'Rojo': 'bg-red-500',
      'Amarillo': 'bg-amber-500',
      'Negro': 'bg-gray-900',
      'Blanco': 'bg-gray-200 border border-gray-300',
      'Gris': 'bg-gray-500'
    };
    return colores[color] || 'bg-gray-400';
  };

  // Calcular estadísticas
  const estadisticas = {
    totalRegistros: registros.length,
    rutasActivas: registros.filter(r => r.ruta.activa).length,
    busesActivos: registros.filter(r => r.bus.activo).length,
    ocupacionPromedio: registros.length > 0 
      ? Math.round(registros.reduce((sum, r) => sum + calcularOcupacion(r), 0) / registros.length)
      : 0
  };

  // Si está cargando
  if (isLoadingRegistros) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Si hay error
  if (isErrorRegistros) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <ErrorBox
          title="Error cargando rutas en tiempo real"
          message={errorRegistros?.message || 'Error desconocido'}
          onRetry={refetchRegistros}
          details={errorRegistros}
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
            : actionAlert.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {actionAlert.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : actionAlert.type === 'error' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Monitoreo en Tiempo Real</h1>
            <p className="mt-2 text-gray-600">Seguimiento operativo de rutas activas en tu línea de transporte.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Sistema activo</span>
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
                placeholder="Buscar por destino, placa o ID..."
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
              <option value="todos">Todos los registros</option>
              <option value="alta-ocupacion">Alta ocupación (≥80%)</option>
              <option value="media-ocupacion">Media ocupación (50-79%)</option>
              <option value="baja-ocupacion">Baja ocupación (&lt;50%)</option>
              <option value="activas">Rutas y buses activos</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
            >
              <option value="reciente">Más recientes</option>
              <option value="ocupacion">Mayor ocupación</option>
              <option value="destino">Por destino</option>
              <option value="hora">Por hora</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas en Tiempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-emerald-100 text-sm font-medium">Registros Activos</div>
              <div className="text-2xl font-bold mt-1">{estadisticas.totalRegistros}</div>
              <div className="text-emerald-200 text-xs mt-1">En tiempo real</div>
            </div>
            <div className="bg-emerald-500/30 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-100 text-sm font-medium">Ocupación Promedio</div>
              <div className="text-2xl font-bold mt-1">{estadisticas.ocupacionPromedio}%</div>
              <div className="text-blue-200 text-xs mt-1">Nivel de uso</div>
            </div>
            <div className="bg-blue-500/30 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-cyan-100 text-sm font-medium">Rutas Activas</div>
              <div className="text-2xl font-bold mt-1">{estadisticas.rutasActivas}</div>
              <div className="text-cyan-200 text-xs mt-1">En operación</div>
            </div>
            <div className="bg-cyan-500/30 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-100 text-sm font-medium">Buses Activos</div>
              <div className="text-2xl font-bold mt-1">{estadisticas.busesActivos}</div>
              <div className="text-purple-200 text-xs mt-1">En circulación</div>
            </div>
            <div className="bg-purple-500/30 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Nuevo Registro y Actualizar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <button
          onClick={handleNuevoRegistro}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Registro
        </button>
        
        <button
          onClick={handleActualizar}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar Datos
        </button>
      </div>

      {/* Tabla de Registros en Tiempo Real */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-5 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-lg font-semibold text-gray-800">Registros en Tiempo Real</h3>
          <p className="mt-1 text-sm text-gray-500">{filteredRegistros.length} registros activos</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruta & Destino
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Vehículo
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Ocupación
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado & Precio
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredRegistros.map((registro) => {
                const ocupacion = calcularOcupacion(registro);
                const estadoBus = getEstadoBus(registro.bus);
                const estadoRuta = getEstadoRuta(registro.ruta);
                const colorBus = getColorBus(registro.bus.color);
                
                return (
                  <tr key={registro.id_registro} className="hover:bg-gray-50 transition-colors duration-150">
                    {/* Columna principal - Ruta */}
                    <td className="px-5 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2">
                              #{registro.id_registro}
                            </span>
                            <span className="text-sm font-bold text-gray-900">{registro.ruta.destino}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Hora: {formatHora(registro.hora_salida)} • Duración: {formatDuracion(registro.ruta.duracion_estimada)}
                          </div>
                          
                        </div>
                      </div>
                    </td>

                    {/* Vehículo - Desktop */}
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${colorBus}`} title={registro.bus.color}></div>
                        <div>
                          <div className="font-medium text-gray-900">{registro.bus.placa}</div>
                          <div className="text-xs text-gray-500">
                            {registro.bus.modelo} • #{registro.bus.numero}
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 mr-2">{registro.bus.capacidad} asientos</span>
                            {registro.bus.aire_acondicionado && (
                              <svg className="w-3 h-3 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Ocupación - Desktop */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {registro.asientos_disponibles}/{registro.bus.capacidad}
                          </span>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getColorOcupacion(ocupacion)}`}>
                            {ocupacion}% ocupado
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getClaseBarraOcupacion(ocupacion)}`}
                            style={{ width: `${ocupacion}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFechaHora(registro.fecha_registro)}
                        </div>
                      </div>
                    </td>

                    {/* Estado & Precio */}
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${estadoRuta.clase}`}>
                            Ruta: {estadoRuta.texto}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${estadoBus.clase}`}>
                            Bus: {estadoBus.texto}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-emerald-600">
                          {formatPrecio(registro.ruta.precio, registro.ruta.moneda)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {registro.ruta.tipo_servicio}
                        </div>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditar(registro.id_registro)}
                            className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                            title="Editar registro"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEliminar(registro.id_registro)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Eliminar registro"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla */}
        {filteredRegistros.length > 0 ? (
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Mostrando <span className="font-semibold">{filteredRegistros.length}</span> registros activos
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></span>
                  Monitoreo activo
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Última actualización: {new Date().toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No hay registros activos</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? `No hay registros que coincidan con "${searchTerm}"`
                : 'No hay registros de rutas en tiempo real en este momento'}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleNuevoRegistro}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Primer Registro
              </button>
              {(searchTerm || filter !== 'todos') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('todos');
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Panel de Información en Tiempo Real */}
      <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-emerald-900">Información del Sistema en Tiempo Real</h3>
            <p className="mt-2 text-emerald-800 text-sm">
              • El sistema actualiza automáticamente cada 30 segundos<br/>
              • Los porcentajes de ocupación se calculan en base a la capacidad del bus<br/>
              • Las rutas y buses marcados como inactivos no están disponibles para asignación<br/>
              • Use los filtros para monitorear niveles específicos de ocupación
            </p>
            <div className="mt-4 flex items-center text-sm text-emerald-700">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span>Baja ocupación (&lt;50%)</span>
              </div>
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                <span>Media ocupación (50-79%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Alta ocupación (≥80%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalRegistroTRByEmpresa
        open={openModal}
        onClose={() => { setOpenModal(false); setEditingRegistro(null); }}
        initialData={editingRegistro}
        onSubmit={handleRegistroSubmit}
        onDone={(res) => {
          if (res && res.type === 'success') {
            setActionAlert({ type: 'success', message: res.message || 'Operación realizada con éxito' });
            refetchRegistros();
          } else if (res && res.type === 'error') {
            setActionAlert({ type: 'error', message: res.message || 'Ocurrió un error en la operación' });
          }
          setOpenModal(false);
          setEditingRegistro(null);
        }}
      />
      
      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar registro en tiempo real"
        description={(() => {
          const reg = registros.find((x) => x.id_registro === toDeleteId);
          return reg 
            ? `¿Eliminar el registro #${reg.id_registro} de la ruta "${reg.ruta.destino}"? Esta acción detendrá el monitoreo en tiempo real.`
            : '¿Eliminar este registro? Esta acción no se puede deshacer.';
        })()}
        onCancel={() => { setConfirmOpen(false); setToDeleteId(null); setApiError(null); }}
        onConfirm={confirmDelete}
        confirmLabel={deleteRutaTR.isLoading ? 'Eliminando...' : 'Eliminar registro'}
        cancelLabel="Cancelar"
        confirmColor="red"
      />
    </div>
  );
};

export default LineaRutasTiempoReal;