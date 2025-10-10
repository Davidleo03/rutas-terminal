// useRouteColors.js
// Encapsula la lógica de colores y formateo para las rutas
export default function useRouteColors() {
  const getColorServicio = (servicio) => {
    return servicio === 'Directo'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-orange-100 text-orange-800';
  };

  const getColorAnden = (anden) => {
    const parts = String(anden).split(' ');
    const numeroAnden = parseInt(parts[1]) || 1;
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
    try {
      return `$${Number(precio).toLocaleString('es-CO')}`;
    } catch (e) {
      return String(precio);
    }
  };

  return {
    getColorServicio,
    getColorAnden,
    getColorProgreso,
    formatPrecio
  };
}
