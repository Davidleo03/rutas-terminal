import AppError from '../utils/AppError.js';

// Middleware global de manejo de errores
export default function errorHandler(err, req, res, next) {
  // Si el error viene sin estructura, envolverlo
  if (!(err instanceof AppError)) {
    // Errors no esperados (programming/infra)
    console.error('Unexpected error:', err.stack || err);
    // No enviar detalles técnicos al cliente
    return res.status(500).json({
      status: 'error',
      message: 'Ha ocurrido un error en el servidor. Por favor intente más tarde.'
    });
  }

  // Errores operacionales (esperados)
  const statusCode = err.statusCode || 500;
  // Loguear detalles para diagnóstico (puedes reemplazar con winston/pino)
  console.warn(`Operational error: ${err.message}`);

  res.status(statusCode).json({
    status: 'error',
    message: err.message
  });
}
