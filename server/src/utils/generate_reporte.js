import PDFDocument from 'pdfkit';
import fs from 'fs';
import supabase from '../config/supabase.js';

/**
 * GenerateReporte
 * ----------
 * Clase corregida para manejar la pluralización de tablas y 
 * relaciones anidadas entre rutas_tiempo_real, buses y empresas.
 */
export default class GenerateReporte {
  
  /**
   * Consulta los datos enriquecidos.
   */
  static async fetchFilteredHistorial(filters = {}) {
    const { fecha_inicio, fecha_fin, id_empresa } = filters || {};

    // Si hay filtros de fecha o empresa, usamos historial_rutas. 
    // Si no, asumimos reporte de tiempo real.
    const tieneFiltros = fecha_inicio || fecha_fin || id_empresa;
    const tabla = tieneFiltros ? 'historial_rutas' : 'rutas_tiempo_real';

    console.log('Generando reporte para tabla:', tabla, 'con filtros:', filters);

    try {
      let query;
      
      if (tabla === 'rutas_tiempo_real') {
        // Relación: rutas_tiempo_real -> buses -> empresas
        // También traemos la ruta para obtener el destino
        query = supabase
          .from('rutas_tiempo_real')
          .select(`
            *,
            bus:buses (
              *,
              empresa:empresas(*)
            ),
            ruta:rutas(*)
          `);
      } else {
        // Relación: historial_rutas -> empresas, buses y rutas
        query = supabase
          .from('historial_rutas')
          .select(`
            *,
            empresa:empresas(*),
            bus:buses(*),
            ruta:rutas(*)
          `);
      }

      // Filtros de base de datos
      if (id_empresa && tabla === 'historial_rutas') {
        query = query.eq('id_empresa', id_empresa);
      }

      if (tabla === 'historial_rutas') {
        if (fecha_inicio) query = query.gte('fecha_registro', fecha_inicio);
        if (fecha_fin) query = query.lte('fecha_registro', fecha_fin);
        query = query.order('fecha_registro', { ascending: true });
      } else {
        query = query.order('id_registro', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      let rows = Array.isArray(data) ? data : [];

      // Filtrado en memoria para rutas_tiempo_real (relación indirecta)
      if (id_empresa && tabla === 'rutas_tiempo_real') {
        rows = rows.filter(r => r.bus?.empresa?.id_empresa === id_empresa);
      }

      console.log(`Datos obtenidos: ${rows.length} registros.`);

      // Mapeo normalizado para el PDF
      return rows.map(r => ({
        id_display: r.id_historial || r.id_registro || '-',
        empresa_nombre: r.empresa?.nombre_empresa || r.bus?.empresa?.nombre_empresa || 'N/A',
        destino: r.ruta?.destino || '-',
        bus_placa: r.bus?.placa || r.bus?.numero || '-',
        hora: r.hora_salida || '-',
        fecha: r.fecha_registro ? new Date(r.fecha_registro).toLocaleDateString('es-ES') : '-',
        raw: r
      }));

    } catch (err) {
      throw new Error(`Error en fetchFilteredHistorial (${tabla}): ${err.message}`);
    }
  }

  /**
   * Genera el PDF con los datos normalizados.
   */
  static async generateFilteredPDF(filters = {}, options = {}) {
    const rows = await this.fetchFilteredHistorial(filters);

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Título y Metadatos
        const tieneFiltros = filters.fecha_inicio || filters.fecha_fin || filters.id_empresa;
        const titulo = tieneFiltros ? 'REPORTE - HISTORIAL DE RUTAS' : 'REPORTE - TIEMPO REAL';
        
        doc.fillColor('#2c3e50').fontSize(20).font('Helvetica-Bold').text(titulo, 50, 50);
        doc.fontSize(10).font('Helvetica').fillColor('#7f8c8d')
           .text(`Fecha de impresión: ${new Date().toLocaleString('es-ES')}`, 50, 80);

        // Línea divisoria
        doc.moveTo(50, 100).lineTo(550, 100).strokeColor('#bdc3c7').lineWidth(1).stroke();

        if (!rows || rows.length === 0) {
          doc.moveDown(5);
          doc.fillColor('#e74c3c').fontSize(14).text('No se encontraron registros para los filtros seleccionados.', { align: 'center' });
          doc.end();
          return;
        }

        // Configuración de Tabla
        const tableTop = 130;
        const colPos = { id: 50, destino: 100, empresa: 220, placa: 340, hora: 400, fecha: 460 };
        const colW = { id: 40, destino: 110, empresa: 110, placa: 55, hora: 55, fecha: 50 };

        // Encabezado de Tabla
        doc.rect(50, tableTop, 500, 25).fillColor('#34495e').fill();
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff');
        doc.text('ID', colPos.id, tableTop + 7, { width: colW.id, align: 'center' });
        doc.text('DESTINO', colPos.destino, tableTop + 7);
        doc.text('EMPRESA', colPos.empresa, tableTop + 7);
        doc.text('PLACA', colPos.placa, tableTop + 7, { width: colW.placa, align: 'center' });
        doc.text('HORA', colPos.hora, tableTop + 7, { width: colW.hora, align: 'center' });
        doc.text('FECHA', colPos.fecha, tableTop + 7, { width: colW.fecha, align: 'center' });

        let currentY = tableTop + 25;

        // Filas
        rows.forEach((r, idx) => {
          // Salto de página automático
          if (currentY > 750) {
            doc.addPage();
            currentY = 50;
            // Re-dibujar encabezado en nueva página si se desea (opcional)
          }

          // Fondo alterno para filas
          if (idx % 2 === 0) {
            doc.rect(50, currentY, 500, 20).fillColor('#f8f9fa').fill();
          }

          doc.fillColor('#2c3e50').font('Helvetica').fontSize(9);
          doc.text(String(r.id_display), colPos.id, currentY + 5, { width: colW.id, align: 'center' });
          doc.text(r.destino, colPos.destino, currentY + 5, { width: colW.destino, ellipsis: true });
          doc.text(r.empresa_nombre, colPos.empresa, currentY + 5, { width: colW.empresa, ellipsis: true });
          doc.text(r.bus_placa, colPos.placa, currentY + 5, { width: colW.placa, align: 'center' });
          doc.text(r.hora, colPos.hora, currentY + 5, { width: colW.hora, align: 'center' });
          doc.text(r.fecha, colPos.fecha, currentY + 5, { width: colW.fecha, align: 'center' });

          currentY += 20;
        });

        // Resumen final
        doc.moveDown(2);
        doc.font('Helvetica-Bold').text(`Total de registros: ${rows.length}`, 50);

        // Numeración de páginas
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
          doc.switchToPage(i);
          doc.fontSize(8).fillColor('#95a5a6').text(
            `Página ${i + 1} de ${pages.count}`,
            50,
            doc.page.height - 40,
            { align: 'center', width: 500 }
          );
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
