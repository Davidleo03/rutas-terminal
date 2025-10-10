import React, { useState } from 'react';

const AvailableRoutes = () => {
  const [rutasCargando] = useState([
    {
      id: 1,
      origen: 'Terminal Central',
      destino: 'Ciudad B',
      precio: '$25.000',
      duracion: '2h 30m',
      servicio: 'Directo',
      serviciosAdicionales: ['Aire Acondicionado', 'WiFi', 'Baño'],
      anden: 'Andén 5',
      estado: 'Cargando',
      progresoCarga: 75,
      horaSalida: '14:30',
      asientosDisponibles: 12,
      empresa: 'Transportes Norte',
      tipoBus: 'Bus Ejecutivo'
    },
    {
      id: 2,
      origen: 'Terminal Central',
      destino: 'Ciudad C',
      precio: '$35.000',
      duracion: '3h 15m',
      servicio: 'Parada Corta',
      serviciosAdicionales: ['Aire Acondicionado', 'WiFi', 'Baño', 'Snack'],
      anden: 'Andén 3',
      estado: 'Cargando',
      progresoCarga: 45,
      horaSalida: '15:15',
      asientosDisponibles: 8,
      empresa: 'Expreso Sur',
      tipoBus: 'Bus Premium'
    },
    {
      id: 3,
      origen: 'Terminal Central',
      destino: 'Ciudad D',
      precio: '$42.000',
      duracion: '4h 00m',
      servicio: 'Directo',
      serviciosAdicionales: ['Aire Acondicionado', 'WiFi', 'Baño', 'Entretenimiento'],
      anden: 'Andén 7',
      estado: 'Cargando',
      progresoCarga: 90,
      horaSalida: '16:00',
      asientosDisponibles: 3,
      empresa: 'Línea Dorada',
      tipoBus: 'Bus Suite'
    },
    {
      id: 4,
      origen: 'Terminal Central',
      destino: 'Ciudad E',
      precio: '$28.000',
      duracion: '2h 00m',
      servicio: 'Parada Corta',
      serviciosAdicionales: ['Aire Acondicionado', 'Baño'],
      anden: 'Andén 2',
      estado: 'Cargando',
      progresoCarga: 30,
      horaSalida: '14:45',
      asientosDisponibles: 15,
      empresa: 'Transportes Este',
      tipoBus: 'Bus Estándar'
    },
    {
      id: 5,
      origen: 'Terminal Central',
      destino: 'Ciudad F',
      precio: '$38.000',
      duracion: '3h 30m',
      servicio: 'Directo',
      serviciosAdicionales: ['Aire Acondicionado', 'WiFi', 'Baño', 'Carga USB'],
      anden: 'Andén 8',
      estado: 'Cargando',
      progresoCarga: 60,
      horaSalida: '17:30',
      asientosDisponibles: 5,
      empresa: 'Expreso Oeste',
      tipoBus: 'Bus Ejecutivo'
    }
  ]);

  const getColorServicio = (servicio) => {
    return servicio === 'Directo' 
      ? 'bg-purple-100 text-purple-800'
      : 'bg-orange-100 text-orange-800';
  };

  const getColorAnden = (anden) => {
    const numeroAnden = parseInt(anden.split(' ')[1]);
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-teal-100 text-teal-800',
      'bg-cyan-100 text-cyan-800'
    ];
    return colors[(numeroAnden - 1) % colors.length];
  };

  const getColorProgreso = (progreso) => {
    if (progreso >= 80) return 'bg-green-600';
    if (progreso >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header de la tabla */}
        <div className="bg-orange-600 px-4 py-5 sm:px-6">
          <h2 className="text-xl font-bold text-white text-center">
            🚍 Rutas Cargando Pasajeros - Extraurbanas
          </h2>
          <p className="text-orange-100 text-center mt-1">
            Información en tiempo real de salidas próximas
          </p>
        </div>

        {/* Información general */}
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

        {/* Tabla para desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruta / Andén
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio / Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado de Carga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salida / Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicios / Asientos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rutasCargando.map((ruta) => (
                <tr key={ruta.id} className="hover:bg-gray-50 transition-colors border-l-4 border-orange-500">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {ruta.origen} → {ruta.destino}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorAnden(ruta.anden)}`}>
                            🚉 {ruta.anden}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getColorServicio(ruta.servicio)}`}>
                        {ruta.servicio === 'Directo' ? '⚡' : '🛑'} {ruta.servicio}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {ruta.empresa}
                      </div>
                      <div className="text-xs text-gray-400">
                        {ruta.tipoBus}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getColorProgreso(ruta.progresoCarga)}`}
                          style={{ width: `${ruta.progresoCarga}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {ruta.progresoCarga}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {ruta.asientosDisponibles} asientos libres
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-bold text-gray-900">
                        🕒 {ruta.horaSalida}
                      </div>
                      <div className="text-gray-500">
                        {ruta.duracion}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {ruta.serviciosAdicionales.map((servicio, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                            {servicio === 'Aire Acondicionado' && '❄️'}
                            {servicio === 'WiFi' && '📶'}
                            {servicio === 'Baño' && '🚻'}
                            {servicio === 'Snack' && '🍪'}
                            {servicio === 'Entretenimiento' && '🎬'}
                            {servicio === 'Carga USB' && '🔌'}
                            {servicio}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {ruta.precio}
                      </div>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista para móviles */}
        <div className="lg:hidden">
          <div className="divide-y divide-gray-200">
            {rutasCargando.map((ruta) => (
              <div key={ruta.id} className="p-4 hover:bg-gray-50 transition-colors border-l-4 border-orange-500">
                {/* Header móvil */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {ruta.origen} → {ruta.destino}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorAnden(ruta.anden)}`}>
                        🚉 {ruta.anden}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorServicio(ruta.servicio)}`}>
                        {ruta.servicio === 'Directo' ? '⚡' : '🛑'} {ruta.servicio}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      {ruta.precio}
                    </div>
                    
                  </div>
                </div>

                {/* Información de carga */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Estado de carga:</span>
                    <span className="text-sm font-bold text-gray-900">{ruta.progresoCarga}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getColorProgreso(ruta.progresoCarga)}`}
                      style={{ width: `${ruta.progresoCarga}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {ruta.asientosDisponibles} asientos disponibles
                  </div>
                </div>

                {/* Información de horario y empresa */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Salida</div>
                    <div className="text-sm font-bold">🕒 {ruta.horaSalida}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Duración</div>
                    <div className="text-sm">{ruta.duracion}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Empresa</div>
                    <div className="text-sm">{ruta.empresa}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Tipo de Bus</div>
                    <div className="text-sm">{ruta.tipoBus}</div>
                  </div>
                </div>

                {/* Servicios adicionales */}
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-500 mb-2">Servicios:</div>
                  <div className="flex flex-wrap gap-1">
                    {ruta.serviciosAdicionales.map((servicio, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                        {servicio === 'Aire Acondicionado' && '❄️'}
                        {servicio === 'WiFi' && '📶'}
                        {servicio === 'Baño' && '🚻'}
                        {servicio === 'Snack' && '🍪'}
                        {servicio === 'Entretenimiento' && '🎬'}
                        {servicio === 'Carga USB' && '🔌'}
                        {servicio}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer informativo */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              💡 <strong>Tipos de servicio:</strong> 
              <span className="text-purple-600"> ⚡ Directo</span> (sin paradas) • 
              <span className="text-orange-600"> 🛑 Parada Corta</span> (paradas limitadas)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              * Los buses inician carga 1 hora antes de la salida programada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};




export default AvailableRoutes;