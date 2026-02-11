import { useBuses } from "../../services/buses/hooks";
import { useRutas }from "../../services/Rutas/hooks";
import ModalRutas from '../../components/ModalRutas';
import ModalBuses from '../../components/ModalBuses';
import { useState } from 'react';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorBox from '../../components/ErrorBox';
import { Link } from "react-router-dom";

const Admin = () => {
  const { data: rutas, isLoading: isLoadingRutas, isError: isErrorRutas, error: errorRutas, refetch: refetchRutas } = useRutas();


  // Datos de rutas en el nuevo formato
  const rutasRecientes = rutas ? rutas.slice(-3).reverse() : [];

  const { data: buses, isLoading: isLoadingBuses, isError: isErrorBuses, error: errorBuses, refetch: refetchBuses } = useBuses();
  const [showRutaModal, setShowRutaModal] = useState(false);
  const [showBusModal, setShowBusModal] = useState(false);
  const [alert, setAlert] = useState(null);

  const busesRecientes = buses ? buses.slice(-3).reverse() : [];
  const busesDisponibles = buses ? buses.filter(bus => bus.activo).length : 0;

  const estadisticas = {
    totalRutas: rutas.length, // Actualizado para usar el array de rutas
    totalBuses: buses ? buses?.length : 0,
    busesDisponibles: busesDisponibles,
    ocupacionPromedio: 78,
    
  };

  if (isLoadingRutas) {
    return (
      <div className="p-4 sm:p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isErrorRutas) {   
    return (
      <div className="p-6">
        <ErrorBox
          title="Error cargando métricas"
          message={errorRutas?.message || 'Error desconocido'}
          details={errorRutas}
        />
      </div>
    );
  }

  if (isLoadingBuses) {
    return (
      <div className="p-4 sm:p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isErrorBuses) {
    return (
      <div className="p-6">
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
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-2 text-gray-600">Vista general del sistema de transporte — Resumen de actividades.</p>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Rutas</p>
              <p className="text-2xl font-bold">{estadisticas.totalRutas}</p>
            </div>
            <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Buses</p>
              <p className="text-2xl font-bold">{estadisticas.totalBuses}</p>
            </div>
            <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Buses Disponibles</p>
              <p className="text-2xl font-bold">{estadisticas.busesDisponibles}</p>
            </div>
            <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid de Tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de Rutas Recientes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Rutas Recientes</h3>
            <p className="mt-1 text-sm text-gray-500">Estado actual de las rutas del sistema</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destino
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Empresa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Tipo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rutasRecientes.map((ruta) => (
                  <tr key={ruta.id_ruta} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ruta.destino}</div>
                      <div className="sm:hidden text-xs text-gray-500 mt-1">
                        {ruta.empresa.nombre_empresa} • {formatDuracion(ruta.duracion_estimada)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTipoServicio(ruta.tipo_servicio)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {ruta.empresa.nombre_empresa}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {ruta.precio} {ruta.moneda.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        ruta.empresa.tipo_ruta === 'urbana' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {formatTipoRuta(ruta.empresa.tipo_ruta)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla de Buses Recientes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Buses Recientes</h3>
            <p className="mt-1 text-sm text-gray-500">Estado actual de la flota de buses</p>
          </div>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numero
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Empresa
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {busesRecientes?.map((bus, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bus.placa}</div>
                      <div className="sm:hidden text-xs text-gray-500 mt-1">
                        {bus.modelo} • {bus.empresa}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {bus.modelo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800`}>
                        {bus.numero}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {bus.empresa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowRutaModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Ruta
          </button>
          <button onClick={() => setShowBusModal(true)} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar Bus
          </button>
          <Link to="reportes-viajes" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Ver Reportes
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

export default Admin;
