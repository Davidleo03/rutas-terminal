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


  const servicios = useMemo(() => [...new Set(rutasCargando.map(ruta => ruta.servicio))], [rutasCargando]);

  // Filtrar rutas
  const rutasFiltradas = useMemo(() => {
    return rutasCargando.filter(ruta => {
      const matchSearch = searchTerm === '' || 
        ruta.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ruta.anden.toLowerCase().includes(searchTerm.toLowerCase());

      const matchServicio = filtroServicio === 'todos' || ruta.servicio === filtroServicio;
      
      

      

      return matchSearch && matchServicio;
    });
  }, [rutasCargando, searchTerm, filtroServicio]);

  

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
    limpiarFiltros,
    
    totalCount: rutasCargando.length
  };
}
