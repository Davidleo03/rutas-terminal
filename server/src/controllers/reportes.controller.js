import GenerateReporte from '../utils/generate_reporte.js';

class ReportesController {
  /**
   * Genera y retorna un PDF basado en filtros enviados por query o body.
   * Soporta filtros: fecha_inicio, fecha_fin, destino, id_empresa, tipo_servicio, estado
   */
  static async generatePDF(req, res) {
    try {
      // Permitir filtros por query (GET) o por body (POST)
      const filters = Object.keys(req.query).length ? req.query : req.body || {};

      // Normalizar fechas: si vienen en formato yyyy-mm-dd, dejarlas como están.
      // La clase GenerateReporte espera cadenas aceptables por supabase.

      const buffer = await GenerateReporte.generateFilteredPDF(filters);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="reporte_historial.pdf"');
      res.status(200).send(buffer);
    } catch (error) {
      console.error('Error al generar el PDF de reportes:', error.message || error);
      res.status(500).json({ message: 'Error al generar el reporte' });
    }
  }
}

export default ReportesController;
