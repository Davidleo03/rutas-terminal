import React, { useState, useMemo } from 'react';

const AvailableRoutes = () => {
  const [rutasCargando] = useState([
    {
      id: 1,
      origen: 'Terminal Central',
      destino: 'San Sebastian',
      precio: 25000,
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
      destino: 'San Felipe',
      precio: 35000,
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
      precio: 42000,
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
      precio: 28000,
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
      precio: 38000,
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
    },
    {
      id: 6,
      origen: 'Terminal Central',
      destino: 'Ciudad G',
      precio: 32000,
      duracion: '2h 45m',
      servicio: 'Parada Corta',
      serviciosAdicionales: ['Aire Acondicionado', 'WiFi'],
      anden: 'Andén 4',
      estado: 'Cargando',
      progresoCarga: 20,
      horaSalida: '18:00',
      asientosDisponibles: 20,
      empresa: 'Transportes Norte',
      tipoBus: 'Bus Estándar'
    }
  ]);

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroServicio, setFiltroServicio] = useState('todos');
  const [filtroAnden, setFiltroAnden] = useState('todos');
  const [filtroEmpresa, setFiltroEmpresa] = useState('todos');
  const [filtroPrecio, setFiltroPrecio] = useState('todos');
  const [filtroEstadoCarga, setFiltroEstadoCarga] = useState('todos');

  // Obtener valores únicos para los filtros
  const empresas = useMemo(() => [...new Set(rutasCargando.map(ruta => ruta.empresa))], [rutasCargando]);
  const andenes = useMemo(() => [...new Set(rutasCargando.map(ruta => ruta.anden))], [rutasCargando]);
  const servicios = useMemo(() => [...new Set(rutasCargando.map(ruta => ruta.servicio))], [rutasCargando]);

  // Filtrar rutas
  const rutasFiltradas = useMemo(() => {
    return rutasCargando.filter(ruta => {
      // Búsqueda por texto
      const matchSearch = searchTerm === '' || 
        ruta.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.anden.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por servicio
      const matchServicio = filtroServicio === 'todos' || ruta.servicio === filtroServicio;

      // Filtro por andén
      const matchAnden = filtroAnden === 'todos' || ruta.anden === filtroAnden;

      // Filtro por empresa
      const matchEmpresa = filtroEmpresa === 'todos' || ruta.empresa === filtroEmpresa;

      // Filtro por precio
      const matchPrecio = filtroPrecio === 'todos' || 
        (filtroPrecio === 'economico' && ruta.precio <= 30000) ||
        (filtroPrecio === 'medio' && ruta.precio > 30000 && ruta.precio <= 40000) ||
        (filtroPrecio === 'premium' && ruta.precio > 40000);

      // Filtro por estado de carga
      const matchEstadoCarga = filtroEstadoCarga === 'todos' ||
        (filtroEstadoCarga === 'inicial' && ruta.progresoCarga <= 30) ||
        (filtroEstadoCarga === 'medio' && ruta.progresoCarga > 30 && ruta.progresoCarga <= 70) ||
        (filtroEstadoCarga === 'avanzado' && ruta.progresoCarga > 70);

      return matchSearch && matchServicio && matchAnden && matchEmpresa && matchPrecio && matchEstadoCarga;
    });
  }, [rutasCargando, searchTerm, filtroServicio, filtroAnden, filtroEmpresa, filtroPrecio, filtroEstadoCarga]);

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

  const formatPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CO')}`;
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setSearchTerm('');
    setFiltroServicio('todos');
    setFiltroAnden('todos');
    setFiltroEmpresa('todos');
    setFiltroPrecio('todos');
    setFiltroEstadoCarga('todos');
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

        {/* Barra de búsqueda y filtros */}
        <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
          {/* Barra de búsqueda */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por destino, empresa o andén..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Filtro Servicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
              <select
                value={filtroServicio}
                onChange={(e) => setFiltroServicio(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                <option value="todos">Todos los servicios</option>
                {servicios.map(servicio => (
                  <option key={servicio} value={servicio}>{servicio}</option>
                ))}
              </select>
            </div>

            {/* Filtro Andén */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Andén</label>
              <select
                value={filtroAnden}
                onChange={(e) => setFiltroAnden(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                <option value="todos">Todos los andenes</option>
                {andenes.map(anden => (
                  <option key={anden} value={anden}>{anden}</option>
                ))}
              </select>
            </div>

            {/* Filtro Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
              <select
                value={filtroEmpresa}
                onChange={(e) => setFiltroEmpresa(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                <option value="todos">Todas las empresas</option>
                {empresas.map(empresa => (
                  <option key={empresa} value={empresa}>{empresa}</option>
                ))}
              </select>
            </div>

            {/* Filtro Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <select
                value={filtroPrecio}
                onChange={(e) => setFiltroPrecio(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                <option value="todos">Todos los precios</option>
                <option value="economico">Económico (≤ $30k)</option>
                <option value="medio">Medio ($30k - $40k)</option>
                <option value="premium">Premium (≥ $40k)</option>
              </select>
            </div>

            {/* Filtro Estado Carga */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Carga</label>
              <select
                value={filtroEstadoCarga}
                onChange={(e) => setFiltroEstadoCarga(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                <option value="todos">Todos los estados</option>
                <option value="inicial">Inicial (≤ 30%)</option>
                <option value="medio">Medio (31% - 70%)</option>
                <option value="avanzado">Avanzado (≥ 71%)</option>
              </select>
            </div>
          </div>

          {/* Contador y botón limpiar */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Mostrando <span className="font-bold">{rutasFiltradas.length}</span> de <span className="font-bold">{rutasCargando.length}</span> rutas
            </div>
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
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

        {/* Mensaje si no hay resultados */}
        {rutasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron rutas</h3>
            <p className="mt-1 text-sm text-gray-500">Intenta ajustar los filtros o términos de búsqueda.</p>
            <div className="mt-6">
              <button
                onClick={limpiarFiltros}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Limpiar todos los filtros
              </button>
            </div>
          </div>
        )}

        {/* Tabla para desktop */}
        {rutasFiltradas.length > 0 && (
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
                {rutasFiltradas.map((ruta) => (
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
                          {formatPrecio(ruta.precio)}
                        </div>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Vista para móviles */}
        {rutasFiltradas.length > 0 && (
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {rutasFiltradas.map((ruta) => (
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
                        {formatPrecio(ruta.precio)}
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
        )}

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