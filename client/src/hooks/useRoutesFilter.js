import { useState, useMemo } from 'react';
import defaultRoutes from '../mook/routes.mook';
import useRouteColors from './useRouteColors';

export default function useRoutesFilter(initial = defaultRoutes) {
  const [rutasCargando] = useState(initial);

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
      const matchSearch = searchTerm === '' || 
        ruta.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.anden.toLowerCase().includes(searchTerm.toLowerCase());

      const matchServicio = filtroServicio === 'todos' || ruta.servicio === filtroServicio;
      const matchAnden = filtroAnden === 'todos' || ruta.anden === filtroAnden;
      const matchEmpresa = filtroEmpresa === 'todos' || ruta.empresa === filtroEmpresa;
      const matchPrecio = filtroPrecio === 'todos' || 
        (filtroPrecio === 'economico' && ruta.precio <= 30000) ||
        (filtroPrecio === 'medio' && ruta.precio > 30000 && ruta.precio <= 40000) ||
        (filtroPrecio === 'premium' && ruta.precio > 40000);

      const matchEstadoCarga = filtroEstadoCarga === 'todos' ||
        (filtroEstadoCarga === 'inicial' && ruta.progresoCarga <= 30) ||
        (filtroEstadoCarga === 'medio' && ruta.progresoCarga > 30 && ruta.progresoCarga <= 70) ||
        (filtroEstadoCarga === 'avanzado' && ruta.progresoCarga > 70);

      return matchSearch && matchServicio && matchAnden && matchEmpresa && matchPrecio && matchEstadoCarga;
    });
  }, [rutasCargando, searchTerm, filtroServicio, filtroAnden, filtroEmpresa, filtroPrecio, filtroEstadoCarga]);

  

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setSearchTerm('');
    setFiltroServicio('todos');
    setFiltroAnden('todos');
    setFiltroEmpresa('todos');
    setFiltroPrecio('todos');
    setFiltroEstadoCarga('todos');
  };

  return {
    rutasCargando,
    rutasFiltradas,
    empresas,
    andenes,
    servicios,
    searchTerm,
    setSearchTerm,
    filtroServicio,
    setFiltroServicio,
    filtroAnden,
    setFiltroAnden,
    filtroEmpresa,
    setFiltroEmpresa,
    filtroPrecio,
    setFiltroPrecio,
    filtroEstadoCarga,
    setFiltroEstadoCarga,
    limpiarFiltros,
    
    totalCount: rutasCargando.length
  };
}
