import React, { useState } from 'react';
import ModalRegistroTR from '../../components/ModalRegistroTR';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import ErrorBox from '../../components/ErrorBox';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useRutasTR, useCreateRutaTR, useUpdateRutaTR, useDeleteRutaTR } from '../../services/Rutas_RT/hooks';

const RutasTiempoReal = () => {
  console.log('Admin Rutas Tiempo Real page rendered');
  
  // Use Rutas TR hooks to fetch and mutate registros en tiempo real
  const { data: registrosData = [], isLoading: isLoadingRegistros, isError: isErrorRegistros, error: errorRegistros, refetch: refetchRegistros } = useRutasTR();
  const createRutaTR = useCreateRutaTR();
  const updateRutaTR = useUpdateRutaTR();
  const deleteRutaTR = useDeleteRutaTR();

  const [registrosLocal, setRegistrosLocal] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [apiError, setApiError] = useState(null);
  // Mirror server data into a local state for immediate UI responsiveness, fallback to server data
  const registros = registrosData && registrosData.length ? registrosData : registrosLocal;
  const [openModal, setOpenModal] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState(null);

  const handleEditar = (id_registro) => {
    const reg = registros.find(r => r.id_registro === id_registro);
    if (!reg) return;
    setEditingRegistro(reg);
    setOpenModal(true);
  };

  const handleEliminar = (id_registro) => {
    // Open confirmation dialog before deleting
    setToDeleteId(id_registro);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDeleteId) return;
    setApiError(null);
    try {
      await deleteRutaTR.mutateAsync({ id: toDeleteId });
      setConfirmOpen(false);
      setToDeleteId(null);
    } catch (err) {
      console.error('Error borrando registro', err);
      setApiError(err);
    }
  };

  const handleActualizar = () => {
    console.log('Actualizar datos en tiempo real');
    // Lógica para actualizar datos
  };

  const handleNuevoRegistro = () => {
    console.log('Crear nuevo registro');
    setEditingRegistro(null);
    setOpenModal(true);
  };

  // submit handler for modal
  const handleRegistroSubmit = async (payload, initialData) => {
    // payload: { id_ruta, id_bus, asientos_disponibles }
    try {
      if (initialData && initialData.id_registro) {
        // Update existing registro on server
        const res = await updateRutaTR.mutateAsync({ id: initialData.id_registro, datosActualizados: payload });
        return res;
      }
      // Create new registro on server
      const res = await createRutaTR.mutateAsync({ nuevaRuta: payload });
      return res;
    } catch (err) {
      console.error('Error en handleRegistroSubmit', err);
      throw err;
    }
  };

  // Función para formatear hora
  const formatHora = (hora) => {
    if (!hora) return '--:--';
    return hora.substring(0, 5);
  };

  // Función para formatear duración
  const formatDuracion = (duracion) => {
    if (!duracion) return '--:--';
    const partes = duracion.split(':');
    if (partes.length === 3) {
      const horas = parseInt(partes[0]);
      const minutos = parseInt(partes[1]);
      if (horas > 0) return `${horas}h ${minutos}m`;
      return `${minutos}m`;
    }
    return duracion;
  };

  // Función para formatear precio con moneda
  const formatPrecio = (precio, moneda) => {
    const simbolo = moneda === 'bs' ? 'Bs.' : '$';
    return `${simbolo}${precio?.toFixed(2) || '0.00'}`;
  };

  // Función para formatear fecha
  const formatFechaHora = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Calcular porcentaje de ocupación usando capacidad y asientos disponibles
  const calcularOcupacion = (registro) => {
    const capacidad = registro.bus.capacidad;
    const disponibles = registro.asientos_disponibles;
    const ocupados = capacidad - disponibles;
    
    return Math.round((ocupados / capacidad) * 100);
  };

  // Obtener color según porcentaje de ocupación
  const getColorOcupacion = (porcentaje) => {
    if (porcentaje < 50) return 'text-green-600 bg-green-100';
    if (porcentaje < 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Obtener clase para barra de ocupación
  const getClaseBarraOcupacion = (porcentaje) => {
    if (porcentaje < 50) return 'bg-green-500';
    if (porcentaje < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Obtener estado del bus
  const getEstadoBus = (bus) => {
    if (!bus.activo) return { texto: 'Inactivo', clase: 'bg-red-100 text-red-800' };
    return { texto: 'Activo', clase: 'bg-green-100 text-green-800' };
  };

  // Obtener estado de la ruta
  const getEstadoRuta = (ruta) => {
    if (!ruta.activa) return { texto: 'Inactiva', clase: 'bg-red-100 text-red-800' };
    return { texto: 'Activa', clase: 'bg-green-100 text-green-800' };
  };

  // Función para obtener color del bus
  const getColorBus = (color) => {
    const colores = {
      'Verde': 'bg-green-500',
      'Azul': 'bg-blue-500',
      'Rojo': 'bg-red-500',
      'Amarillo': 'bg-yellow-500',
      'Negro': 'bg-gray-900',
      'Blanco': 'bg-gray-200 border border-gray-300',
      'Gris': 'bg-gray-500'
    };
    return colores[color] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/admin.jpg')" }}>
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rutas en Tiempo Real</h1>
            <p className="mt-2 text-gray-600">Monitoreo y administración de rutas activas — Actualización en vivo</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleActualizar}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
            <button
              onClick={handleNuevoRegistro}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Registro
            </button>
          </div>
        </div>
      </div>

      {/* Tabla Responsiva */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoadingRegistros ? (
          <LoadingSkeleton variant="table" />
        ) : isErrorRegistros ? (
          <div className="p-4">
            <ErrorBox
              title="No se pudieron cargar los registros"
              message="Ocurrió un problema al obtener los registros en tiempo real."
              onRetry={refetchRegistros}
              details={errorRegistros}
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Información Principal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Bus
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Ocupación
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registros.map((registro) => {
                    const ocupacion = calcularOcupacion(registro);
                    const estadoBus = getEstadoBus(registro.bus);
                    const estadoRuta = getEstadoRuta(registro.ruta);
                    const colorBus = getColorBus(registro.bus.color);
                    
                    return (
                      <tr key={registro.id_registro} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center">
                                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2">
                                    ID: {registro.id_registro}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">{registro.ruta.destino}</span>
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                  Ruta ID: {registro.id_ruta} • Bus ID: {registro.id_bus}
                                </div>
                              </div>
                              <div className={`w-3 h-3 rounded-full ${colorBus} flex-shrink-0 ml-2`} title={registro.bus.color}></div>
                            </div>
                            
                            {/* Información para móviles */}
                            <div className="mt-3 space-y-2 lg:hidden">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="text-xs text-gray-500">Bus</div>
                                  <div className="text-sm font-medium text-gray-900">{registro.bus.placa}</div>
                                  <div className="text-xs text-gray-500">{registro.bus.modelo} • #{registro.bus.numero}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Hora Salida</div>
                                  <div className="text-sm font-medium text-gray-900">{formatHora(registro.hora_salida)}</div>
                                  <div className="text-xs text-gray-500">{formatDuracion(registro.ruta.duracion_estimada)}</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="text-xs text-gray-500">Asientos</div>
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900 mr-2">
                                      {registro.asientos_disponibles}/{registro.bus.capacidad}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getColorOcupacion(ocupacion)}`}>
                                      {ocupacion}%
                                    </span>
                                  </div>
                                  {/* Barra de ocupación para móviles */}
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div 
                                      className={`h-1.5 rounded-full ${getClaseBarraOcupacion(ocupacion)}`}
                                      style={{ width: `${ocupacion}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">Precio</div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatPrecio(registro.ruta.precio, registro.ruta.moneda)}
                                  </div>
                                  <div className="text-xs text-gray-500">{registro.ruta.tipo_servicio}</div>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-500">
                                Registrado: {formatFechaHora(registro.fecha_registro)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Información del Bus - Desktop */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${colorBus}`} title={registro.bus.color}></div>
                            <div>
                              <div className="font-medium text-gray-900">{registro.bus.placa}</div>
                              <div className="text-xs text-gray-500">{registro.bus.modelo}</div>
                              <div className="text-xs text-gray-500">#{registro.bus.numero} • {registro.bus.capacidad} asientos</div>
                              <div className="flex items-center mt-1">
                                <svg className={`w-3 h-3 mr-1 ${registro.bus.aire_acondicionado ? 'text-blue-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs text-gray-600">
                                  {registro.bus.aire_acondicionado ? 'Con A/C' : 'Sin A/C'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Ocupación - Desktop */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <span className="font-medium text-gray-900">
                                  {registro.asientos_disponibles}/{registro.bus.capacidad}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">
                                  {calcularOcupacion(registro)}% ocupado
                                </span>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getColorOcupacion(ocupacion)}`}>
                                {ocupacion}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getClaseBarraOcupacion(ocupacion)}`} 
                                style={{ width: `${ocupacion}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex justify-between">
                              <span>Hora: {formatHora(registro.hora_salida)}</span>
                              <span>Duración: {formatDuracion(registro.ruta.duracion_estimada)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoRuta.clase}`}>
                              {estadoRuta.texto}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoBus.clase}`}>
                              {estadoBus.texto}
                            </span>
                            <div className="text-xs text-gray-500">
                              {formatPrecio(registro.ruta.precio, registro.ruta.moneda)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {registro.ruta.tipo_servicio}
                            </div>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditar(registro.id_registro)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 p-1 rounded hover:bg-indigo-50"
                                title="Editar registro"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEliminar(registro.id_registro)}
                                className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                                title="Eliminar registro"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            <button
                              className="text-cyan-600 hover:text-cyan-800 text-xs font-medium flex items-center"
                              title="Ver detalles en tiempo real"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Ver en vivo
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer de la tabla */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                  Mostrando <span className="font-medium">{registros.length}</span> registros en tiempo real
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    En vivo
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Última actualización: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mensaje cuando no hay datos */}
      {registros.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hay registros en tiempo real</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            No se están monitoreando rutas activas en este momento. Crea un nuevo registro para comenzar el seguimiento.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleNuevoRegistro}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Primer Registro
            </button>
            <button
              onClick={handleActualizar}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Intentar actualizar
            </button>
          </div>
        </div>
      )}

      {/* Indicador de tiempo real */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Sistema de monitoreo en tiempo real activo
          <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Auto-actualiza cada 30s</span>
        </div>
      </div>
            </div>
          </div>
        </div>
      </div>

      <ModalRegistroTR
        open={openModal}
        onClose={() => { setOpenModal(false); setEditingRegistro(null); }}
        initialData={editingRegistro}
        onSubmit={handleRegistroSubmit}
        onDone={(res) => {
          console.log('ModalRegistroTR done', res);
          setOpenModal(false);
          setEditingRegistro(null);
        }}
      />

    </div>
  );
};

export default RutasTiempoReal;
