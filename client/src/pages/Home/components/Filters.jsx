import React from 'react';

const Filters = ({
  searchTerm,
  setSearchTerm,
  servicios,
  filtroServicio,
  setFiltroServicio,
  andenes,
  filtroAnden,
  setFiltroAnden,
  empresas,
  filtroEmpresa,
  setFiltroEmpresa,
  filtroPrecio,
  setFiltroPrecio,
  filtroEstadoCarga,
  setFiltroEstadoCarga,
  limpiarFiltros
}) => {
  return (
    <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
          <select value={filtroServicio} onChange={(e) => setFiltroServicio(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
            <option value="todos">Todos los servicios</option>
            {servicios.map(servicio => (
              <option key={servicio} value={servicio}>{servicio}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Andén</label>
          <select value={filtroAnden} onChange={(e) => setFiltroAnden(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
            <option value="todos">Todos los andenes</option>
            {andenes.map(anden => (
              <option key={anden} value={anden}>{anden}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
          <select value={filtroEmpresa} onChange={(e) => setFiltroEmpresa(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
            <option value="todos">Todas las empresas</option>
            {empresas.map(empresa => (
              <option key={empresa} value={empresa}>{empresa}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <select value={filtroPrecio} onChange={(e) => setFiltroPrecio(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
            <option value="todos">Todos los precios</option>
            <option value="economico">Económico (≤ $30k)</option>
            <option value="medio">Medio ($30k - $40k)</option>
            <option value="premium">Premium (≥ $40k)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Carga</label>
          <select value={filtroEstadoCarga} onChange={(e) => setFiltroEstadoCarga(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
            <option value="todos">Todos los estados</option>
            <option value="inicial">Inicial (≤ 30%)</option>
            <option value="medio">Medio (31% - 70%)</option>
            <option value="avanzado">Avanzado (≥ 71%)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Mostrando <span className="font-bold">{/* contador de fuera */}</span>
        </div>
        <button onClick={limpiarFiltros} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-md transition-colors">Limpiar Filtros</button>
      </div>
    </div>
  );
};

export default Filters;
