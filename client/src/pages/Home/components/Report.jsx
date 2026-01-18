function Report() {
    return (
        <>
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
        </>

    )
}