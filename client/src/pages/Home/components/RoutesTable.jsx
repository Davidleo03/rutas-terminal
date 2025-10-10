import React from 'react';

const RoutesTable = ({ rutas, getColorAnden, getColorServicio, getColorProgreso, formatPrecio }) => {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruta / Andén</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio / Empresa</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado de Carga</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salida / Duración</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicios / Asientos</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rutas.map((ruta) => (
            <tr key={ruta.id} className="hover:bg-gray-50 transition-colors border-l-4 border-orange-500">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{ruta.origen} → {ruta.destino}</div>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorAnden(ruta.anden)}`}>🚉 {ruta.anden}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getColorServicio(ruta.servicio)}`}>{ruta.servicio === 'Directo' ? '⚡' : '🛑'} {ruta.servicio}</span>
                  <div className="text-xs text-gray-500 mt-1">{ruta.empresa}</div>
                  <div className="text-xs text-gray-400">{ruta.tipoBus}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${getColorProgreso(ruta.progresoCarga)}`} style={{ width: `${ruta.progresoCarga}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{ruta.progresoCarga}%</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{ruta.asientosDisponibles} asientos libres</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <div className="font-bold text-gray-900">🕒 {ruta.horaSalida}</div>
                  <div className="text-gray-500">{ruta.duracion}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {ruta.serviciosAdicionales.map((servicio, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">{servicio}</span>
                    ))}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{formatPrecio(ruta.precio)}</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoutesTable;
