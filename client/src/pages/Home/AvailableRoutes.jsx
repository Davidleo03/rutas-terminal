import React from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import RoutesTable from './components/RoutesTable';
import MobileList from './components/MobileList';
import EmptyState from './components/EmptyState';
import useRoutesFilter from '../../hooks/useRoutesFilter';
import useRouteColors from '../../hooks/useRouteColors';

const AvailableRoutes = () => {
  const {
    rutasCargando,
    rutasFiltradas,
    
    limpiarFiltros,
  } = useRoutesFilter();

  const { getColorServicio, getColorAnden, getColorProgreso, formatPrecio } = useRouteColors();

  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Header title={"🚍 Rutas Cargando Pasajeros - Extraurbanas"} subtitle={"Información en tiempo real de salidas próximas"} />

        

        <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-orange-700">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              <span>Carga Avanzada</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Carga Media</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Carga Inicial</span>
            </div>
          </div>
        </div>

        {rutasFiltradas.length === 0 ? (
          <EmptyState limpiarFiltros={limpiarFiltros} />
        ) : (
          <>
            <RoutesTable rutas={rutasFiltradas} getColorAnden={getColorAnden} getColorServicio={getColorServicio} getColorProgreso={getColorProgreso} formatPrecio={formatPrecio} />
            <MobileList rutas={rutasFiltradas} getColorAnden={getColorAnden} getColorServicio={getColorServicio} getColorProgreso={getColorProgreso} formatPrecio={formatPrecio} />
          </>
        )}

        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              💡 <strong>Tipos de servicio:</strong>
              <span className="text-purple-600"> ⚡ Directo</span> (sin paradas) •
              <span className="text-orange-600"> 🛑 Parada Corta</span> (paradas limitadas)
            </p>
            <p className="text-xs text-gray-500 mt-1">* Los buses inician carga 1 hora antes de la salida programada</p>
          </div>
        </div>
      </div>
    </div>
  );
};






export default AvailableRoutes;