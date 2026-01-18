import PDFDocument from 'pdfkit';
import fs from 'fs';
import supabase from '../config/supabase.js';
import ReportGenerator from './ReportGenerator.js';

/**
 * GenerateReporte
 * ----------
 * Clase responsable de: 1) consultar la tabla `historial_ruta` en Supabase
 * aplicando filtros enviados desde el frontend y 2) generar un PDF con
 * los resultados. El PDF tiene un diseño similar a `ReportGenerator.js`.
 *
 * Notas/Asunciones:
 * - La tabla `historial_ruta` contiene al menos los campos: id_historial, id_empresa, id_bus, hora_salida.
 * - Se hace INNER JOIN lógico a `empresas` y `buses` usando la convención de FK
 *   (igual que en otros modelos del proyecto). Si alguna propiedad de filtro
 *   no puede aplicarse en la consulta PostgREST, se aplica un filtrado adicional
 *   en memoria en el servidor (esto evita dependencias de SQL crudo).
 * - Filtros soportados: fecha_inicio, fecha_fin, destino, id_empresa, tipo_servicio, estado
 */
export default class GenerateReporte {
  /**
   * Construye y ejecuta la consulta a supabase aplicando filtros posibles en servidor.
   * Luego aplica filtros adicionales en memoria cuando es necesario (destino, tipo_servicio, estado).
   * Retorna un array de registros enriquecidos con `empresa` y `bus`.
   */
  static async fetchFilteredHistorial(filters = {}) {
    const {
      fecha_inicio,
      fecha_fin,
      destino,
      id_empresa,
      tipo_servicio,
      estado
    } = filters || {};

    try {
      // Construir la consulta base. Usamos alias para traer la empresa y el bus
      // asumiendo que las FK son `id_empresa` y `id_bus`.
      let query = supabase
        .from('historial_ruta')
        .select('*, empresa:id_empresa(*), bus:id_bus(*)');

      // Filtros que podemos aplicar directamente al PostgREST
      if (id_empresa) query = query.eq('id_empresa', id_empresa);

  if (fecha_inicio) query = query.gte('fecha_registro', fecha_inicio);
  if (fecha_fin) query = query.lte('fecha_registro', fecha_fin);

  // Orden por fecha_registro para reporte
  query = query.order('fecha_registro', { ascending: true });

      const { data, error } = await query;
      if (error) throw error;

      let rows = Array.isArray(data) ? data : [];

      // Aplicar filtros adicionales en memoria cuando no hay garantía de columna
      // (por ejemplo destino, tipo_servicio, estado). Buscamos candidatos en
      // las entidades relacionadas (`empresa`, `bus`) para hacer un filtro flexible.
      if (destino) {
        const needle = String(destino).toLowerCase();
        rows = rows.filter(r => {
          const empresaDestino = r.empresa?.destino || r.empresa?.nombre || '';
          return String(empresaDestino).toLowerCase().includes(needle);
        });
      }

      if (tipo_servicio) {
        const needle = String(tipo_servicio).toLowerCase();
        rows = rows.filter(r => {
          // Try multiple places where tipo_servicio could be stored
          const candidates = [r.bus?.tipo_servicio, r.empresa?.tipo_servicio, r.tipo_servicio];
          return candidates.some(c => c && String(c).toLowerCase().includes(needle));
        });
      }

      if (estado) {
        const needle = String(estado).toLowerCase();
        rows = rows.filter(r => {
          const candidates = [r.estado, r.bus?.estado, r.empresa?.estado];
          return candidates.some(c => c && String(c).toLowerCase() === needle);
        });
      }

      return rows.map(r => ({
        id_historial: r.id_historial ?? r.id ?? null,
        id_empresa: r.id_empresa ?? (r.empresa && r.empresa.id_empresa) ?? null,
        id_bus: r.id_bus ?? (r.bus && r.bus.id_bus) ?? null,
        hora_salida: r.hora_salida ?? null,
        empresa: r.empresa || null,
        bus: r.bus || null,
        raw: r
      }));
    } catch (err) {
      throw new Error('Error al consultar historial_ruta: ' + (err.message || err));
    }
  }

  /**
   * Genera un PDF (Buffer) con los registros filtrados. Devuelve Buffer.
   * options: permite personalizar colores u otros comportamientos.
   */
  static async generateFilteredPDF(filters = {}, options = {}) {
    const rows = await this.fetchFilteredHistorial(filters);

    // Si se desea usar el ReportGenerator existente para un formato similar,
    // podríamos mapear los campos al formato esperado. Aquí generamos un PDF
    // simple y legible parecido al `ReportGenerator` pero adaptado a `historial_ruta`.

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        doc.font('Helvetica');

        // Header
        doc.fontSize(20).font('Helvetica-Bold').fillColor('black').text('Reporte - Historial de Rutas', 50, 50);
        doc.fontSize(10).font('Helvetica').fillColor('#444444').text(`Generado: ${new Date().toLocaleString('es-ES')}`, 50, 85);
        doc.moveTo(50, 105).lineTo(550, 105).strokeColor('#cccccc').lineWidth(1).stroke();
        doc.y = 120;

        if (!rows || rows.length === 0) {
          doc.fontSize(12).fillColor('black').text('No hay datos para los filtros aplicados', { align: 'center' });
          doc.end();
          return;
        }

        // Column positions
        const colPos = { id: 50, empresa: 110, bus: 320, hora: 420 };
        const colW = { id: 50, empresa: 200, bus: 90, hora: 80 };

        // Header row
        const headerY = doc.y;
        doc.rect(50, headerY, 500, 28).fillColor('#e9e9e9').fill();
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000');
        doc.text('ID', colPos.id, headerY + 8, { width: colW.id, align: 'center' });
        doc.text('EMPRESA', colPos.empresa, headerY + 8, { width: colW.empresa, align: 'left' });
        doc.text('BUS', colPos.bus, headerY + 8, { width: colW.bus, align: 'center' });
        doc.text('HORA SALIDA', colPos.hora, headerY + 8, { width: colW.hora, align: 'center' });
        doc.moveTo(50, headerY + 28).lineTo(550, headerY + 28).strokeColor('#999999').lineWidth(1).stroke();
        doc.y = headerY + 35;

        doc.fontSize(10).font('Helvetica').fillColor('#000000');

        rows.forEach((r, idx) => {
          if (doc.y > 700) {
            doc.addPage();
            doc.y = 50;
          }

          if (idx % 2 === 0) {
            doc.rect(50, doc.y - 5, 500, 24).fillColor('#fbfbfb').fill();
          }

          const empresaName = r.empresa?.nombre || r.empresa?.razon_social || r.empresa?.nombre_empresa || '-';
          const busPlaca = r.bus?.placa || r.bus?.numero || '-';
    // Mostrar la fecha de registro (dentro del rango solicitado)
    const fecha = r.fecha_registro ? new Date(r.fecha_registro).toLocaleString('es-ES') : '-';

          const rowY = doc.y;
          doc.text(String(r.id_historial ?? '-'), colPos.id, rowY, { width: colW.id, align: 'center' });
          doc.text(empresaName, colPos.empresa, rowY, { width: colW.empresa, align: 'left' });
          doc.text(busPlaca, colPos.bus, rowY, { width: colW.bus, align: 'center' });
          doc.text(fecha, colPos.hora, rowY, { width: colW.hora, align: 'center' });

          doc.y = rowY + 24;
        });

        // Summary
        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').lineWidth(1).stroke();
        doc.y += 10;
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text(`Total registros: ${rows.length}`, 50, doc.y);

        // Footer pages
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
          doc.switchToPage(i);
          const footerY = doc.page.height - 30;
          doc.moveTo(50, footerY - 10).lineTo(550, footerY - 10).strokeColor('#cccccc').lineWidth(0.5).stroke();
          doc.fontSize(9).font('Helvetica').fillColor('#666666').text(`Página ${i + 1} de ${pages.count}`, 50, footerY, { align: 'center', width: 500 });
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  static async saveBufferToFile(buffer, filePath) {
    await fs.promises.writeFile(filePath, buffer);
  }
}

