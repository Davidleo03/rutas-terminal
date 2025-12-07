// En useRouteColors.js
const useRouteColors = () => {
  const getColorServicio = (tipoServicio) => {
    const colores = {
      'directo': 'text-purple-600 bg-purple-100',
      'parada_corta': 'text-orange-600 bg-orange-100',
      'parada_larga': 'text-blue-600 bg-blue-100',
      'express': 'text-red-600 bg-red-100'
    };
    return colores[tipoServicio] || 'text-gray-600 bg-gray-100';
  };

  const getColorEstado = (asientosDisponibles, capacidad) => {
    const porcentaje = (asientosDisponibles / capacidad) * 100;
    if (porcentaje > 50) return 'text-green-600 bg-green-100';
    if (porcentaje > 20) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Color para el andén (estética simple según prefijo)
  const getColorAnden = (anden) => {
    if (!anden) return 'text-gray-600 bg-gray-100';
    const a = String(anden).toLowerCase();
    if (a.includes('a')) return 'text-purple-600 bg-purple-100';
    if (a.includes('b')) return 'text-blue-600 bg-blue-100';
    if (a.includes('c')) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  // Color para barra de progreso según porcentaje
  const getColorProgreso = (porcentaje) => {
    const p = Number(porcentaje) || 0;
    if (p >= 75) return 'bg-green-500';
    if (p >= 50) return 'bg-yellow-400';
    if (p >= 25) return 'bg-orange-400';
    return 'bg-red-500';
  };

  const formatPrecio = (precio, moneda) => {
    // Normalizar moneda por defecto a 'bs' si no se proporciona
    const m = moneda || 'bs';
    if (precio == null || precio === '') return '-';
    const simbolo = m === 'bs' ? 'Bs.' : m === '$' ? 'USD $' : `${m}`;
    // Mostrar siempre con 2 decimales
    const num = Number(precio);
    const formatted = Number.isNaN(num) ? String(precio) : num.toFixed(2);
    return `${simbolo} ${formatted}`;
  };

  const formatDuracion = (duracion) => {
    const [horas, minutos] = duracion.split(':');
    const horasNum = parseInt(horas);
    const minutosNum = parseInt(minutos);
    
    if (horasNum === 0) return `${minutosNum} min`;
    if (minutosNum === 0) return `${horasNum} h`;
    return `${horasNum} h ${minutosNum} min`;
  };

  return { getColorServicio, getColorEstado, getColorAnden, getColorProgreso, formatPrecio, formatDuracion };
};


export default useRouteColors;