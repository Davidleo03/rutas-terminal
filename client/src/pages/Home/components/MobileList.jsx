import React from 'react';
import { Clock, MapPin, Bus, Users, Tag, Shield } from 'lucide-react';


const MobileList = ({ rutas, getColorServicio, getColorEstado, formatPrecio, formatDuracion }) => {
  // Función para formatear la hora de salida
  const formatHoraSalida = (hora) => {
    if (!hora) return '--:--';
    return String(hora).substring(0, 5); // Formato HH:MM
  };

  // Función para calcular el porcentaje de ocupación
  const getPorcentajeOcupacion = (asientosDisponibles, capacidad) => {
    const cap = Number(capacidad) || 0;
    const libres = Number(asientosDisponibles) || 0;
    if (cap === 0) return 0;
    const ocupados = cap - libres;
    return Math.round((ocupados / cap) * 100);
  };

  // Normalize route objects from different shapes (mock vs API)
  const normalize = (r) => {
    // If route already follows flat mock shape
    if (r && (r.origen || r.destino) && (r.empresa || r.tipoBus)) {
      return {
        id: r.id || r.id_registro,
        destino: r.destino || (r.ruta && r.ruta.destino) || '',
        precio: r.precio || (r.ruta && r.ruta.precio) || 0,
        moneda: r.moneda || (r.ruta && r.ruta.moneda) || 'bs',
        hora_salida: r.horaSalida || r.hora_salida || r.hora || '',
        duracion_estimada: r.duracion || (r.ruta && r.ruta.duracion_estimada) || '',
        tipo_servicio: (r.servicio || (r.ruta && r.ruta.tipo_servicio) || '').toString().toLowerCase(),
        serviciosAdicionales: r.serviciosAdicionales || (r.ruta && r.ruta.serviciosAdicionales) || [],
        asientos_disponibles: r.asientosDisponibles != null ? r.asientosDisponibles : (r.asientos_disponibles != null ? r.asientos_disponibles : 0),
        bus: {
          modelo: r.tipoBus || (r.bus && r.bus.modelo) || '',
          placa: (r.bus && r.bus.placa) || r.placa || '',
          capacidad: (r.bus && r.bus.capacidad) || r.capacidad || 0,
          color: (r.bus && r.bus.color) || r.color || '#ddd',
          numero: (r.bus && r.bus.numero) || r.numero || '',
          aire_acondicionado: (r.bus && r.bus.aire_acondicionado) || r.aire_acondicionado || false,
        },
        ruta: {
          activa: r.activa != null ? r.activa : (r.ruta && r.ruta.activa) || true,
          duracion_estimada: r.duracion || (r.ruta && r.ruta.duracion_estimada) || '',
        }
      };
    }

    // fallback for API shaped objects
    return {
      id: r?.id_registro || r?.id || null,
      destino: r?.ruta?.destino || r?.destino || '',
      precio: r?.ruta?.precio || r?.precio || 0,
      moneda: r?.ruta?.moneda || r?.moneda || 'bs',
      hora_salida: r?.hora_salida || r?.hora_salida || r?.horaSalida || '',
      duracion_estimada: r?.ruta?.duracion_estimada || r?.duracion || '',
      tipo_servicio: (r?.ruta?.tipo_servicio || r?.servicio || '').toString().toLowerCase(),
      serviciosAdicionales: r?.ruta?.serviciosAdicionales || r?.servicios || [],
      asientos_disponibles: r?.asientos_disponibles != null ? r.asientos_disponibles : (r?.asientosDisponibles != null ? r.asientosDisponibles : 0),
      bus: {
        modelo: r?.bus?.modelo || '',
        placa: r?.bus?.placa || '',
        capacidad: r?.bus?.capacidad || 0,
        color: r?.bus?.color || '#ddd',
        numero: r?.bus?.numero || '',
        aire_acondicionado: r?.bus?.aire_acondicionado || false,
      },
      ruta: {
        activa: r?.ruta?.activa ?? true,
        duracion_estimada: r?.ruta?.duracion_estimada || r?.duracion || '',
      }
    };
  };

  return (
    <div className="md:hidden">
      <div className="divide-y divide-gray-200">
        {rutas.map((rawRuta) => {
          const ruta = normalize(rawRuta);
          const porcentajeOcupacion = getPorcentajeOcupacion(
            ruta.asientos_disponibles,
            ruta.bus?.capacidad
          );
          
          return (
            <div key={ruta.id_registro} className="p-4 hover:bg-gray-50 transition-colors">
              {/* Header con información principal */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <h3 className="text-lg font-bold text-gray-900">
                      {ruta.destino}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bus className="w-4 h-4" />
                    <span className="font-medium">{ruta.bus.modelo}</span>
                    <span className="text-gray-500">•</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                      {ruta.bus.placa}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    {formatPrecio(ruta.precio, ruta.moneda)}
                  </div>
                  <span className="text-xs text-gray-500">Precio por persona</span>
                </div>
              </div>

              {/* Badges de estado y tipo */}
              <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorServicio(ruta.tipo_servicio)}`}>
                  <Tag className="w-3 h-3 mr-1" />
                  {ruta.ruta.tipo_servicio === 'directo' ? '⚡ Directo' :
                   ruta.ruta.tipo_servicio === 'parada_corta' ? '🛑 Parada Corta' :
                   ruta.ruta.tipo_servicio === 'parada_larga' ? '🚌 Parada Larga' :
                   ruta.ruta.tipo_servicio}
                </span>
                
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorEstado(ruta.asientos_disponibles, ruta.bus?.capacidad)}`}>
                  <Users className="w-3 h-3 mr-1" />
                  {ruta.asientos_disponibles}/{ruta.bus.capacidad} asientos
                </span>
                
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <Shield className="w-3 h-3 mr-1" />
                  {ruta.bus.aire_acondicionado ? 'Con A/C' : 'Sin A/C'}
                </span>
              </div>

              {/* Información de horario y capacidad */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">Salida:</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      {formatHoraSalida(ruta.hora_salida)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Duración: {formatDuracion(ruta.duracion_estimada)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <div className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-green-500" />
                    <span className="font-medium">Ocupación:</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{porcentajeOcupacion}%</div>
                    <div className="text-xs text-gray-500">
                      {Math.max((ruta.bus?.capacidad || 0) - (ruta.asientos_disponibles || 0), 0)} pasajeros a bordo
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de progreso de ocupación */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Disponibilidad</span>
                  <span>{porcentajeOcupacion}% ocupado</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      porcentajeOcupacion < 50 ? 'bg-green-500' :
                      porcentajeOcupacion < 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${porcentajeOcupacion}%` }}
                  ></div>
                </div>
              </div>

              {/* Información adicional del bus */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: ruta.bus.color }}></div>
                    <span>Color: {ruta.bus.color}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">#{ruta.bus.numero}</span>
                    <span>Número bus</span>
                  </div>
                </div>
              </div>

              {/* Estado de actividad */}
              <div className="mt-3">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  ruta.ruta.activa 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    ruta.ruta.activa ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  {ruta.ruta.activa ? 'Ruta activa' : 'Ruta inactiva'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {ruta.asientos_disponibles > 0 ? '✅ Asientos disponibles' : '❌ Completo'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileList;