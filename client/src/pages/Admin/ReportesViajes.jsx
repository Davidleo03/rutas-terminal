import { useState } from 'react';
import useExportPDF from '../../hooks/useExportPDF';
const ReportesViajes = () => {
  console.log('Reportes Rutas page rendered');

  // Estados para los filtros
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    empresa: '',
    tipoServicio: '',
    estado: '',
    destino: ''
  });
  const { download, downloading, error } = useExportPDF();

  // Tipos de reportes disponibles
  const tiposReporte = [
    { id: 1, nombre: 'Reporte General', descripcion: 'Resumen completo de todas las rutas', icono: '📊' },
    { id: 2, nombre: 'Rutas por Empresa', descripcion: 'Análisis por empresa transportista', icono: '🏢' },
    { id: 3, nombre: 'Ocupación por Ruta', descripcion: 'Porcentaje de ocupación por ruta', icono: '👥' },
    { id: 4, nombre: 'Rendimiento Financiero', descripcion: 'Ingresos y rentabilidad', icono: '💰' },
    { id: 5, nombre: 'Horarios Pico', descripcion: 'Análisis de horas de mayor demanda', icono: '⏰' },
    { id: 6, nombre: 'Rutas Inactivas', descripcion: 'Rutas suspendidas o inactivas', icono: '⏸️' }
  ];

  // Datos de ejemplo para empresas
  const empresas = [
    { id: 1, nombre: 'Transportes C.A.' },
    { id: 2, nombre: 'Express Nacional' },
    { id: 3, nombre: 'Rápidos del Centro' },
    { id: 4, nombre: 'MetroBus' }
  ];

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
      await download(filtros, { filenamePrefix: 'reporte_viajes' });
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
      empresa: '',
      tipoServicio: '',
      estado: '',
      destino: ''
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

      {/* Filtros de Reporte */}
      <div className="mb-8 bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Filtros del Reporte</h2>
          <button
            onClick={handleResetFiltros}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Limpiar Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Fecha Inicio
              </div>
            </label>
            <input
              type="date"
              name="fechaInicio"
              value={filtros.fechaInicio}
              onChange={handleFiltroChange}
              max={hoy}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Fecha Fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Fecha Fin
              </div>
            </label>
            <input
              type="date"
              name="fechaFin"
              value={filtros.fechaFin}
              onChange={handleFiltroChange}
              min={filtros.fechaInicio}
              max={hoy}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Empresa
              </div>
            </label>
            <select
              name="empresa"
              value={filtros.empresa}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las empresas</option>
              {empresas.map(empresa => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Servicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Tipo de Servicio
              </div>
            </label>
            <select
              name="tipoServicio"
              value={filtros.tipoServicio}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los servicios</option>
              <option value="directo">Directo</option>

              <option value="parada_corta">Parada Corta</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Estado
              </div>
            </label>
            <select
              name="estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </div>

          {/* Destino */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Destino
              </div>
            </label>
            <input
              type="text"
              name="destino"
              value={filtros.destino}
              onChange={handleFiltroChange}
              placeholder="Ej: Centro, Aeropuerto..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center mt-10 space-x-3">
          <button
            onClick={handleExportarPDF}
            disabled={downloading}
            className={`bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center shadow-md ${downloading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {downloading ? (
              <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
            <span>{downloading ? 'Generando PDF...' : 'Exportar PDF'}</span>
          </button>

        </div>
      </div>



      {/* Vista Previa del Reporte */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Vista Previa del Reporte</h2>
          <div className="text-sm text-gray-500">
            Datos generados: {new Date().toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Pasajeros
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Fila de ejemplo 1 */}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">16</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Centro</div>
                  <div className="text-xs text-gray-500 md:hidden">Transportes C.A.</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  Transportes C.A.
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Parada Corta
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Activa
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span>78%</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  Bs. 3,240
                </td>
              </tr>

              {/* Fila de ejemplo 2 */}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">18</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Aeropuerto</div>
                  <div className="text-xs text-gray-500 md:hidden">Express Nacional</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  Express Nacional
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Express
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Activa
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span>65%</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  $ 1,875
                </td>
              </tr>

              {/* Fila de ejemplo 3 */}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">20</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Centro Comercial</div>
                  <div className="text-xs text-gray-500 md:hidden">Transportes C.A.</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  Transportes C.A.
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Local
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Inactiva
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <span>0%</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  Bs. 0
                </td>
              </tr>
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
          <button
            onClick={handleExportarExcel}
            className="px-4 py-2 border border-green-300 bg-green-50 text-green-700 rounded-md hover:bg-green-100 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Excel
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
