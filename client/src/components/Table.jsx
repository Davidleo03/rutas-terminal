import React, { useState } from 'react';

const Table = () => {
  const [tipoRuta, setTipoRuta] = useState('urbanas'); // 'urbanas' o 'extraurbanas'

  // Datos de ejemplo para las tarifas
  const [fareData] = useState({
    urbanas: [
      { id: 1, origen: 'Terminal Central', destino: 'Centro Histórico', precio: '$2.500', duracion: '25 min', frecuencia: 'Cada 10 min', tipo: 'Urbana' },
      { id: 2, origen: 'Terminal Central', destino: 'Zona Norte', precio: '$3.000', duracion: '35 min', frecuencia: 'Cada 15 min', tipo: 'Urbana' },
      { id: 3, origen: 'Terminal Central', destino: 'Zona Sur', precio: '$2.800', duracion: '30 min', frecuencia: 'Cada 12 min', tipo: 'Urbana' },
      { id: 4, origen: 'Terminal Central', destino: 'Zona Este', precio: '$3.200', duracion: '40 min', frecuencia: 'Cada 20 min', tipo: 'Urbana' },
      { id: 5, origen: 'Terminal Central', destino: 'Zona Oeste', precio: '$2.700', duracion: '28 min', frecuencia: 'Cada 8 min', tipo: 'Urbana' },
    ],
    extraurbanas: [
      { id: 1, origen: 'Ciudad A', destino: 'Ciudad B', precio: '$25.000', duracion: '2h 30m', frecuencia: 'Cada 30 min', tipo: 'Extraurbana' },
      { id: 2, origen: 'Ciudad A', destino: 'Ciudad C', precio: '$35.000', duracion: '3h 15m', frecuencia: 'Cada 45 min', tipo: 'Extraurbana' },
      { id: 3, origen: 'Ciudad A', destino: 'Ciudad D', precio: '$42.000', duracion: '4h 00m', frecuencia: 'Cada 1h', tipo: 'Extraurbana' },
      { id: 4, origen: 'Ciudad A', destino: 'Ciudad E', precio: '$28.000', duracion: '2h 00m', frecuencia: 'Cada 20 min', tipo: 'Extraurbana' },
      { id: 5, origen: 'Ciudad A', destino: 'Ciudad F', precio: '$38.000', duracion: '3h 30m', frecuencia: 'Cada 1h 30m', tipo: 'Extraurbana' },
    ]
  });

  const datosActuales = fareData[tipoRuta];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header de la tabla */}
        <div className="bg-teal-700 px-4 py-5 sm:px-6">
          <h2 className="text-xl font-bold text-white text-center">
            Tarifas de Buses - Terminal Central
          </h2>
          <p className="text-blue-100 text-center mt-1">
            Consulta nuestras rutas y precios
          </p>
        </div>

        {/* Botones de selección de ruta */}
        <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setTipoRuta('urbanas')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                tipoRuta === 'urbanas'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              🚌 Rutas Urbanas
            </button>
            <button
              onClick={() => setTipoRuta('extraurbanas')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                tipoRuta === 'extraurbanas'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              🚍 Rutas Extraurbanas
            </button>
          </div>
          
          {/* Indicador de ruta seleccionada */}
          <div className="text-center mt-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              tipoRuta === 'urbanas' 
                ? 'bg-teal-700 text-sky-100' 
                : 'bg-green-100 text-green-800'
            }`}>
              {tipoRuta === 'urbanas' ? '🚌' : '🚍'} 
              Mostrando {tipoRuta === 'urbanas' ? 'Rutas Urbanas' : 'Rutas Extraurbanas'}
            </span>
          </div>
        </div>

        {/* Información específica según el tipo de ruta */}
        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
          <div className="text-center">
            <p className="text-sm text-blue-700">
              {tipoRuta === 'urbanas' 
                ? 'Rutas dentro del área metropolitana - Precios fijos'
                : 'Rutas hacia otras ciudades - Precios según distancia'
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
                  Origen
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
                  Frecuencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datosActuales.map((fare) => (
                <tr key={fare.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fare.origen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fare.destino}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {fare.precio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fare.duracion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fare.frecuencia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      fare.tipo === 'Urbana' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {fare.tipo}
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
            {datosActuales.map((fare) => (
              <div key={fare.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {fare.origen} → {fare.destino}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      fare.tipo === 'Urbana' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {fare.tipo}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                    {fare.precio}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{fare.duracion}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{fare.frecuencia}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer informativo */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <p className="text-xs text-gray-500 text-center">
            {tipoRuta === 'urbanas' 
              ? '* Rutas urbanas operan de 5:00 AM a 11:00 PM'
              : '* Reservas recomendadas para rutas extraurbanas'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Table;