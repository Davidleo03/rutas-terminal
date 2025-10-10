import React from 'react';

const MobileList = ({ rutas, getColorAnden, getColorServicio, getColorProgreso, formatPrecio }) => {
  return (
    <div className="lg:hidden">
      <div className="divide-y divide-gray-200">
        {rutas.map((ruta) => (
          <div key={ruta.id} className="p-4 hover:bg-gray-50 transition-colors border-l-4 border-orange-500">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{ruta.origen} → {ruta.destino}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorAnden(ruta.anden)}`}>🚉 {ruta.anden}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorServicio(ruta.servicio)}`}>{ruta.servicio === 'Directo' ? '⚡' : '🛑'} {ruta.servicio}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">{formatPrecio(ruta.precio)}</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Estado de carga:</span>
                <span className="text-sm font-bold text-gray-900">{ruta.progresoCarga}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${getColorProgreso(ruta.progresoCarga)}`} style={{ width: `${ruta.progresoCarga}%` }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{ruta.asientosDisponibles} asientos disponibles</div>
            </div>

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

            <div className="mb-3">
              <div className="text-sm font-medium text-gray-500 mb-2">Servicios:</div>
              <div className="flex flex-wrap gap-1">
                {ruta.serviciosAdicionales.map((servicio, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">{servicio}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileList;
