import React from 'react';
import Header from './components/Header';
import RoutesTable from './components/RoutesTable';
import MobileList from './components/MobileList';
import EmptyState from './components/EmptyState';
import useRoutesFilter from '../../hooks/useRoutesFilter';
import useRouteColors from '../../hooks/useRouteColors';
import { useRutasTR } from '../../services/Rutas_RT/hooks';

const AvailableRoutes = () => {
  const {
    rutasCargando,
    rutasFiltradas,
    limpiarFiltros,
  } = useRoutesFilter();

  const { 
    getColorServicio, 
    getColorEstado, 
    getColorAnden,
    getColorProgreso,
    formatPrecio, 
    formatDuracion 
  } = useRouteColors();

  // Rutas en tiempo real (prefiere estas si están disponibles)
  const { data: rutasTR = [], isLoading: isLoadingRutasTR, isError: isErrorRutasTR } = useRutasTR();

  // Mapear las rutas en tiempo real al formato que esperan RoutesTable / MobileList
  const mapRutaTRToFlat = (tr) => ({
    id_ruta: tr?.id_registro ?? tr?.id ?? null,
    origen: tr?.ruta?.origen ?? tr?.origen ?? 'Terminal',
    destino: tr?.ruta?.destino ?? tr?.destino ?? '',
    precio: tr?.ruta?.precio ?? tr?.precio ?? 0,
    moneda: tr?.ruta?.moneda ?? tr?.moneda ?? 'bs',
    duracion: tr?.ruta?.duracion_estimada ?? tr?.duracion ?? '',
    servicio: tr?.ruta?.tipo_servicio ?? tr?.servicio ?? '',
    serviciosAdicionales: tr?.ruta?.serviciosAdicionales ?? tr?.serviciosAdicionales ?? tr?.servicios ?? [],
    anden: tr?.anden ?? tr?.anden_nombre ?? '',
    progresoCarga: tr?.progresoCarga ?? tr?.progreso_carga ?? tr?.progreso ?? 0,
    horaSalida: tr?.horaSalida ?? tr?.hora_salida ?? tr?.hora ?? '',
    asientosDisponibles: tr?.asientos_disponibles ?? tr?.asientosDisponibles ?? tr?.asientos ?? 0,
    empresa: tr?.ruta?.empresa_nombre ?? tr?.empresa ?? (tr?.ruta?.empresa || ''),
    tipoBus: tr?.bus?.modelo ?? tr?.tipoBus ?? '',
    servicios: tr?.servicios ?? [],
    // mantener referencia original
    __raw: tr,
  });

  const rutasParaMostrar = (Array.isArray(rutasTR) && rutasTR.length > 0)
    ? rutasTR.map(mapRutaTRToFlat)
    : rutasFiltradas;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Header 
          title={"🚍 Rutas Programadas - Salidas Próximas"} 
          subtitle={"Información en tiempo real de buses y asientos disponibles"} 
        />

        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-700">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              <span>Muchos asientos disponibles</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Pocos asientos disponibles</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Asientos agotados</span>
            </div>
          </div>
        </div>

        {rutasFiltradas.length === 0 ? (
          <EmptyState limpiarFiltros={limpiarFiltros} />
        ) : (
          <>
            <RoutesTable 
              rutas={rutasParaMostrar} 
              getColorServicio={getColorServicio} 
              getColorEstado={getColorEstado} 
              getColorAnden={getColorAnden}
              getColorProgreso={getColorProgreso}
              formatPrecio={formatPrecio} 
              formatDuracion={formatDuracion} 
            />
            <MobileList 
              rutas={rutasParaMostrar} 
              getColorServicio={getColorServicio} 
              getColorEstado={getColorEstado} 
              formatPrecio={formatPrecio} 
              formatDuracion={formatDuracion} 
            />
          </>
        )}

        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              💡 <strong>Información importante:</strong>
              <span className="text-purple-600"> ⚡ Directo</span> (sin paradas) •
              <span className="text-orange-600"> 🛑 Parada Corta</span> (paradas limitadas) •
              <span className="text-blue-600"> 🚌 Parada Larga</span> (paradas extensas)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              * La capacidad del bus se muestra como: asientos disponibles / capacidad total
            </p>
            <p className="text-xs text-gray-500 mt-1">
              * Los horarios de salida están sujetos a cambios según disponibilidad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableRoutes;