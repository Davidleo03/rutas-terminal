import React, { useState } from 'react';
import { useRutas } from '../../../services/Rutas/hooks';
import ErrorBox from '../../../components/ErrorBox';
import LoadingSpinner from '../../../components/LoadingSkeleton';
import LoadingSkeleton from '../../../components/LoadingSkeleton';

const Table = () => {
  const [tipoRuta, setTipoRuta] = useState('urbana'); // 'urbana' o 'extra-urbana'

  const { data: rutas, loading, error } = useRutas();

  // Datos en el nuevo formato
  const routesData = rutas  || [];

  

  // Filtrar rutas según el tipo seleccionado
  const datosActuales = routesData?.filter(ruta => ruta.empresa.tipo_ruta === tipoRuta) || [];

  // Eliminar duplicados por la combinación (destino, tipo_servicio)
  // Mantener la primera aparición de cada par. Ej: {Maracay, directo} y {Maracay, parada_corta}
  // son diferentes y se muestran ambos; pero si hay dos {Maracay, directo} solo se muestra uno.
  const seen = new Set();
  const uniqueDatos = datosActuales.filter(ruta => {
    const destino = String(ruta?.destino ?? '').trim().toLowerCase();
    const tipo = String(ruta?.tipo_servicio ?? '').trim().toLowerCase();
    const key = `${destino}::${tipo}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Función para formatear la duración
  const formatDuracion = (duracion) => {
    const [horas, minutos] = duracion.split(':');
    const horasNum = parseInt(horas);
    const minutosNum = parseInt(minutos);
    
    if (horasNum === 0) {
      return `${minutosNum} min`;
    } else if (minutosNum === 0) {
      return `${horasNum} h`;
    } else {
      return `${horasNum} h ${minutosNum} min`;
    }
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

  // Función para formatear el precio
  const formatPrecio = (precio, moneda) => {
    const monedaSymbol = moneda === 'bs' ? 'Bs.' : moneda === '$' ? 'USD $' : moneda;
    return `${monedaSymbol} ${precio}`;
  };

  // Función para obtener la frecuencia basada en el tipo de servicio
  const getFrecuencia = (tipoServicio) => {
    const frecuencias = {
      'parada_corta': 'Cada 10-15 min',
      'parada_larga': 'Cada 20-30 min',
      'directo': 'Cada 30-60 min',
      'express': 'Cada 15-20 min'
    };
    return frecuencias[tipoServicio] || 'Variada';
  };

  if (loading) {
    return 
      <div className="flex justify-center items-center h-64">
        <LoadingSkeleton />
      </div>;
  }
  
  if (error) {
    return <ErrorBox message="Error al cargar las rutas. Por favor, intenta nuevamente más tarde." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header de la tabla */}
        <div className="bg-teal-700 px-4 py-5 sm:px-6">
          <h2 className="text-xl font-bold text-white text-center">
            Rutas de Transporte - Terminal Central
          </h2>
          <p className="text-blue-100 text-center mt-1">
            Consulta nuestras rutas activas y precios
          </p>
        </div>

        {/* Botones de selección de ruta */}
        <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setTipoRuta('urbana')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${tipoRuta === 'urbana'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              🚌 Rutas Urbanas
            </button>
            <button
              onClick={() => setTipoRuta('extra-urbana')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${tipoRuta === 'extra-urbana'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              🚍 Rutas Extraurbanas
            </button>
          </div>

          {/* Indicador de ruta seleccionada */}
          <div className="text-center mt-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tipoRuta === 'urbana'
                ? 'bg-teal-700 text-sky-100'
                : 'bg-green-100 text-green-800'
              }`}>
              {tipoRuta === 'urbana' ? '🚌' : '🚍'}
              Mostrando {tipoRuta === 'urbana' ? 'Rutas Urbanas' : 'Rutas Extraurbanas'} ({datosActuales.length})
            </span>
          </div>
        </div>

        {/* Información específica según el tipo de ruta */}
        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
          <div className="text-center">
            <p className="text-sm text-blue-700">
              {tipoRuta === 'urbana'
                ? 'Rutas dentro del área metropolitana - Servicio regular'
                : 'Rutas hacia otras ciudades - Servicio interurbano'
              }
            </p>
          </div>
        </div>

        {/* Tabla para desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uniqueDatos.map((ruta, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ruta.empresa.nombre_empresa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ruta.destino}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {formatPrecio(ruta.precio, ruta.moneda)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuracion(ruta.duracion_estimada)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ruta.tipo_servicio === 'directo' 
                        ? 'bg-purple-100 text-purple-800' 
                        : ruta.tipo_servicio === 'express'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {formatTipoServicio(ruta.tipo_servicio)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ruta.activa 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ruta.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista para móviles */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-200">
            {uniqueDatos.map((ruta, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ruta.empresa.nombre_empresa}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Destino: {ruta.destino}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {formatPrecio(ruta.precio, ruta.moneda)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    ruta.empresa.tipo_ruta === 'urbana'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {ruta.empresa.tipo_ruta === 'urbana' ? 'Urbana' : 'Extra-Urbana'}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    ruta.tipo_servicio === 'directo' 
                      ? 'bg-purple-100 text-purple-800' 
                      : ruta.tipo_servicio === 'express'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {formatTipoServicio(ruta.tipo_servicio)}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    ruta.activa 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {ruta.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDuracion(ruta.duracion_estimada)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{getFrecuencia(ruta.tipo_servicio)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer informativo */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <p className="text-xs text-gray-500 text-center">
            {tipoRuta === 'urbana'
              ? '* Rutas urbanas operan de 5:00 AM a 11:00 PM'
              : '* Reservas recomendadas para rutas extraurbanas'
            }
          </p>
            <p className="text-xs text-gray-500 text-center mt-1">
            Mostrando {uniqueDatos.length} de {routesData.length} rutas totales
          </p>
        </div>
      </div>
    </div>
  );
};

export default Table;