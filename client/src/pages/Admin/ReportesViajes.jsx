import { useState } from 'react';
import useExportPDF from '../../hooks/useExportPDF';
import { useRutasTR } from '../../services/Rutas_RT/hooks'
import { useEmpresas } from '../../services/Empresas/hooks';
const ReportesViajes = () => {
  console.log('Reportes Rutas page rendered');

  // Estados para los filtros
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    empresa: ''
  });
  const { download, downloading, error } = useExportPDF();
  // Rutas en tiempo real (preview)
  const { data: rutas = [], isLoading: loadingRutas, error: rutasError } = useRutasTR();

  

  // Datos de ejemplo para empresas
  const { data: empresas = [] } = useEmpresas();

  // Filtrar rutas en tiempo real según los filtros seleccionados
  const rutasFiltradas = rutas.filter((trip) => {
    let pasa = true;

    // Filtro por fecha inicio
    if (filtros.fechaInicio) {
      const tripDate = trip.fecha_registro || trip.created_at || trip.ruta?.fecha_registro;
      if (tripDate) {
        const tripDateStr = new Date(tripDate).toISOString().split('T')[0];
        pasa = pasa && tripDateStr >= filtros.fechaInicio;
      }
    }

    // Filtro por fecha fin
    if (filtros.fechaFin && pasa) {
      const tripDate = trip.fecha_registro || trip.created_at || trip.ruta?.fecha_registro;
      if (tripDate) {
        const tripDateStr = new Date(tripDate).toISOString().split('T')[0];
        pasa = pasa && tripDateStr <= filtros.fechaFin;
      }
    }

    // Filtro por empresa
    if (filtros.empresa && pasa) {
      const empresaId = trip.ruta?.id_empresa || trip.bus?.empresa_id;
      pasa = pasa && String(empresaId) === String(filtros.empresa);
    }

    return pasa;
  });

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerarReporte = (tipo) => {
    console.log('Generando reporte:', tipo, 'con filtros:', filtros);
    // Lógica para generar reporte
  };

  const handleExportarPDF = async () => {
    try {
      // Mapear filtros al formato esperado por el backend
      const backendFilters = {
        ...(filtros.fechaInicio && { fecha_inicio: filtros.fechaInicio }),
        ...(filtros.fechaFin && { fecha_fin: filtros.fechaFin }),
        ...(filtros.empresa && { id_empresa: filtros.empresa })
      };
      await download(backendFilters, { filenamePrefix: 'reporte_viajes' });
    } catch (err) {
      // Puedes reemplazar con tu sistema de toasts
      alert('No se pudo generar el PDF. Revisa la consola para más detalles.');
    }
  };

  const handleExportarExcel = () => {
    console.log('Exportando a Excel con filtros:', filtros);
    // Lógica para exportar a Excel
  };

  const handleResetFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      empresa: ''
    });
  };

  // Obtener fecha de hoy para el input
  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reportes de Rutas</h1>
            <p className="mt-2 text-gray-600">Genere informes detallados y análisis de las rutas del sistema</p>
          </div>

        </div>
      </div>

      



      {/* Sección de Filtros */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros del Reporte</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <select
              name="empresa"
              value={filtros.empresa}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las empresas</option>
              {empresas.map((emp) => (
                <option key={emp.id_empresa || emp.id} value={emp.id_empresa || emp.id}>
                  {emp.nombre || emp.razon_social || emp.nombre_empresa || `Empresa ${emp.id_empresa || emp.id}`}
                </option>
              ))}
            </select>
          </div>
          {/* Botón Reset */}
          <div className="flex items-end">
            <button
              onClick={handleResetFiltros}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Vista Previa del Reporte */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Vista Previa del Reporte</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Mostrando <span className="font-medium text-gray-900">{rutasFiltradas.length}</span> de <span className="font-medium text-gray-900">{rutas.length}</span> registros
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* Tabla de vista previa */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Ruta
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Empresa
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingRutas ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">Cargando rutas...</td>
                </tr>
              ) : rutasError ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-sm text-red-500">Error al cargar rutas</td>
                </tr>
              ) : rutasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">
                    {filtros.fechaInicio || filtros.fechaFin || filtros.empresa
                      ? 'No hay rutas que coincidan con los filtros aplicados'
                      : 'No hay rutas disponibles'}
                  </td>
                </tr>
              ) : (
                rutasFiltradas.map((trip) => {
                  const idRuta = trip.id_ruta ?? trip.id_registro ?? '-';
                  const destino = trip.ruta?.destino || '-';
                  const precio = typeof trip.ruta?.precio !== 'undefined' && trip.ruta.precio !== null
                    ? new Intl.NumberFormat('es-ES').format(trip.ruta.precio)
                    : null;
                  const moneda = trip.ruta?.moneda === 'bs' ? 'Bs' : (trip.ruta?.moneda || '');
                  const destinoLabel = precio ? `${destino} (${moneda} ${precio})` : destino;
                  const empresa = trip.ruta?.id_empresa ?? trip.bus?.empresa_id ?? '-';
                  const tipo = trip.ruta?.tipo_servicio || '-';
                  const activa = trip.ruta?.activa;

                  return (
                    <tr key={trip.id_registro || trip.id_ruta} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{idRuta}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{destinoLabel}</div>
                        <div className="text-xs text-gray-500 md:hidden">Empresa: {empresa}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{empresa}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {tipo.replaceAll('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {activa ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Activa</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactiva</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>



        {/* Botones de acción del reporte */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleExportarPDF}
            disabled={downloading}
            className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-red-500 hover:text-red-50 flex items-center justify-center ${downloading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {downloading ? (
              <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
            <span>{downloading ? 'Generando PDF...' : 'Exportar a PDF'}</span>
          </button>
          

        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">
            Los reportes incluyen datos históricos desde el inicio del sistema. Los filtros aplicados afectan todos los datos mostrados y exportados.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportesViajes;
