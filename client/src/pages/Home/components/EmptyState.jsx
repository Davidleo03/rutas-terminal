import React from 'react';

const EmptyState = ({ limpiarFiltros }) => {
  return (
    <div className="text-center py-12">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron rutas</h3>
      <p className="mt-1 text-sm text-gray-500">Intenta ajustar los filtros o términos de búsqueda.</p>
      <div className="mt-6">
        <button onClick={limpiarFiltros} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">Limpiar todos los filtros</button>
      </div>
    </div>
  );
};

export default EmptyState;
