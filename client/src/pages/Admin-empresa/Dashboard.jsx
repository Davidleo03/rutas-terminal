import { useBusesByEmpresa } from "../../services/buses/hooks";
import { useRutasByEmpresa } from "../../services/Rutas/hooks";
import ModalRutas from '../../components/ModalRutaByEmpresa';
import ModalBuses from '../../components/ModalBuses';
import { useState } from 'react';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorBox from '../../components/ErrorBox';
import useAuthStore from "../../localStore/auth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);

  const { data: rutas, isLoading: isLoadingRutas, isError: isErrorRutas, error: errorRutas, refetch: refetchRutas } = useRutasByEmpresa(user?.id_empresa);
  const { data: buses, isLoading: isLoadingBuses, isError: isErrorBuses, error: errorBuses, refetch: refetchBuses } = useBusesByEmpresa(user?.id_empresa);
  
  const [showRutaModal, setShowRutaModal] = useState(false);
  const [showBusModal, setShowBusModal] = useState(false);
  const [alert, setAlert] = useState(null);

  // Datos de rutas en el nuevo formato
  const rutasRecientes = rutas ? rutas.slice(-4).reverse() : [];
  const busesRecientes = buses ? buses.slice(-4).reverse() : [];
  const busesDisponibles = buses ? buses.filter(bus => bus.activo).length : 0;

  // Helpers para calcular y formatear duraciones
  function parseDurationToSeconds(duracion) {
    if (!duracion) return 0;
    const parts = String(duracion).split(':').map(p => Number(p));
    if (parts.length === 3) {
      const [h, m, s] = parts;
      if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(s)) return 0;
      return h * 3600 + m * 60 + s;
    }
    if (parts.length === 2) {
      const [h, m] = parts;
      if (Number.isNaN(h) || Number.isNaN(m)) return 0;
      return h * 3600 + m * 60;
    }
    const n = Number(duracion);
    return Number.isFinite(n) ? n : 0;
  }

  function formatSecondsToHHMM(totalSeconds) {
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '00:00';
    const totalMinutes = Math.round(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  function calcAverageDuration(rutasList = []) {
    if (!Array.isArray(rutasList) || rutasList.length === 0) return '00:00';
    let sumSeconds = 0;
    let count = 0;
    rutasList.forEach(ruta => {
      const dur = ruta?.duracion_estimada ?? ruta?.duracion ?? null;
      const secs = parseDurationToSeconds(dur);
      if (secs > 0) {
        sumSeconds += secs;
        count += 1;
      }
    });
    if (count === 0) return '00:00';
    const avgSeconds = sumSeconds / count;
    return formatSecondsToHHMM(avgSeconds);
  }

  const estadisticas = {
    totalRutas: rutas ? rutas.length : 0,
    totalBuses: buses ? buses.length : 0,
    busesDisponibles: busesDisponibles,
    rutasActivas: rutas ? rutas.filter(r => r.estado === 'activa').length : 0,
    tiempoPromedio: calcAverageDuration(rutas)
  };

  if (isLoadingRutas || isLoadingBuses) {
    return (
      <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isErrorRutas) {   
    return (
      <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <ErrorBox
          title="Error cargando métricas"
          message={errorRutas?.message || 'Error desconocido'}
          details={errorRutas}
        />
      </div>
    );
  }

  if (isErrorBuses) {
    return (
      <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <ErrorBox 
          title="Error cargando métricas" 
          message={errorBuses?.message || 'Error desconocido'} 
          onRetry={() => refetch()} 
          details={errorBuses} 
        />
      </div>
    );
  }

  // Función para formatear la duración estimada
  const formatDuracion = (duracion) => {
    const [horas, minutos] = duracion.split(':');
    return `${horas}h ${minutos}min`;
  };

  // Función para formatear el tipo de servicio
  const formatTipoServicio = (tipo) => {
    const tipos = {
      'parada_corta': 'Parada Corta',
      'parada_larga': 'Parada Larga',
      'directo': 'Directo',
      'express': 'Express'
    };
    return tipos[tipo] || tipo;
  };

  // Función para formatear el tipo de ruta
  const formatTipoRuta = (tipo) => {
    const tipos = {
      'urbana': 'Urbana',
      'extra-urbana': 'Extra Urbana',
      'interurbana': 'Interurbana'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Panel de Control - Línea - <span className="text-indigo-600">{rutas[0]?.empresa?.nombre_empresa}</span></h1>
            <p className="mt-2 text-gray-600">Gestión operativa y monitoreo en tiempo real del sistema de transporte.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Sistema operativo</span>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg border border-indigo-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Rutas</p>
              <p className="text-2xl font-bold mt-1">{estadisticas.totalRutas}</p>
              <p className="text-indigo-200 text-xs mt-1">{estadisticas.rutasActivas} activas</p>
            </div>
            <div className="bg-indigo-500/30 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-5 text-white shadow-lg border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Buses</p>
              <p className="text-2xl font-bold mt-1">{estadisticas.totalBuses}</p>
              <p className="text-emerald-200 text-xs mt-1">{estadisticas.busesDisponibles} disponibles</p>
            </div>
            <div className="bg-emerald-500/30 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        </div>

        

        <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl p-5 text-white shadow-lg border border-violet-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Tiempo Prom.</p>
              <p className="text-2xl font-bold mt-1">{estadisticas.tiempoPromedio}</p>
              <p className="text-violet-200 text-xs mt-1">Por recorrido</p>
            </div>
            <div className="bg-violet-500/30 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Tablaspresa_id)
      : (initialData.empresa?.id_empresa ? String(initialData.empresa.id_empresa) : ''); */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tabla de Rutas Recientes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-5 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Rutas Activas</h3>
                <p className="mt-1 text-sm text-gray-500">Últimas rutas registradas en el sistema</p>
              </div>
              <button 
                onClick={() => setShowRutaModal(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center text-sm"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destino
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Empresa
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Tipo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rutasRecientes.map((ruta) => (
                  <tr key={ruta.id_ruta} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-5 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                          <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{ruta.destino}</div>
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            {ruta.empresa.nombre_empresa}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDuracion(ruta.duracion_estimada)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      <div className="flex items-center">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                        {ruta.empresa.nombre_empresa}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {ruta.precio} {ruta.moneda.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ruta.empresa.tipo_ruta === 'urbana' 
                            ? 'bg-blue-100 text-blue-800' 
                            : ruta.empresa.tipo_ruta === 'extra-urbana'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {formatTipoRuta(ruta.empresa.tipo_ruta)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center">
            <Link to="/admin-linea/rutas" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Ver todas las rutas →
            </Link>
          </div>
        </div>

        {/* Tabla de Buses Recientes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-5 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Flota Activa</h3>
                <p className="mt-1 text-sm text-gray-500">Últimos buses registrados en el sistema</p>
              </div>
              <button 
                onClick={() => setShowBusModal(true)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center text-sm"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Modelo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {busesRecientes?.map((bus, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-5 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center mr-3">
                          <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{bus.placa}</div>
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            {bus.modelo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {bus.modelo}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        bus.activo 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {bus.activo ? 'Disponible' : 'En Mantenimiento'}
                      </span>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center">
            <Link to="/admin-linea/buses" className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">
              Ver flota completa →
            </Link>
          </div>
        </div>
      </div>

      {/* Panel de Acciones Rápidas */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-6">Acciones de Gestión</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          <button 
            onClick={() => setShowRutaModal(true)}
            className="w-full h-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 px-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center shadow hover:shadow-lg border border-gray-200"
          >
            <div className="bg-indigo-100 p-3 rounded-full mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span className="font-semibold">Nueva Ruta</span>
            <span className="text-xs text-gray-500 mt-1">Crear nueva ruta</span>
          </button>
          
          <button 
            onClick={() => setShowBusModal(true)}
            className="w-full h-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 px-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center shadow hover:shadow-lg border border-gray-200"
          >
            <div className="bg-emerald-100 p-3 rounded-full mb-3">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="font-semibold">Registrar Bus</span>
            <span className="text-xs text-gray-500 mt-1">Agregar a flota</span>
          </button>
          
          <Link to="reportes" className="w-full h-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 px-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center shadow hover:shadow-lg border border-gray-200">
            <div className="bg-cyan-100 p-3 rounded-full mb-3">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-semibold">Ver Reportes</span>
            <span className="text-xs text-gray-500 mt-1">Estadísticas</span>
          </Link>
          
          
        </div>
      </div>

      {/* Modales compartidos para crear/editar rutas y buses */}
      <ModalRutas
        open={showRutaModal}
        onClose={() => setShowRutaModal(false)}
        initialData={null}
        onDone={(info) => {
          if (info?.type === 'success') {
            refetchRutas && refetchRutas();
            refetchBuses && refetchBuses();
          }
          setAlert(info);
          setTimeout(() => setAlert(null), 3000);
        }}
      />

      <ModalBuses
        open={showBusModal}
        onClose={() => setShowBusModal(false)}
        initialData={null}
        onDone={(info) => {
          if (info?.type === 'success') {
            refetchBuses && refetchBuses();
          }
          setAlert(info);
          setTimeout(() => setAlert(null), 3000);
        }}
      />
    </div>
  );
};

export default Dashboard;
