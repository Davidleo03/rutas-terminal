import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600">Página no encontrada</p>
      <Link to={'/'} className="bg-slate-600 p-2 rounded border-solid font-bold text-gray-100 hover:bg-gray-100 hover:text-slate-600">Volver al inicio</Link>
    </div>
  );
};

export default NotFound;