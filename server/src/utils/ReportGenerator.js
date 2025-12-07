import PDFDocument from 'pdfkit';
import fs from 'fs';

/**
 * ReportGenerator
 * Clase con métodos estáticos para generar reportes PDF a partir de datos de la base.
 * - generateTripsPDF(trips, options) => Promise<Buffer>
 * - savePDFToFile(buffer, path) => Promise<void>
 * - formatCurrency(value, moneda) => string
 *
 * Nota: requiere la dependencia `pdfkit` en el proyecto (npm i pdfkit).
 */
export default class ReportGenerator {
  /**
   * Genera un PDF con la lista de viajes (trips) y devuelve un Buffer.
   * @param {Array} trips - Arreglo de objetos con la estructura proporcionada.
   * @param {Object} options - { title, subtitle, includeSummary, companyInfo }
   * @returns {Promise<Buffer>}
   */
  static generateTripsPDF(trips = [], options = {}) {
    const {
      title = 'Reporte de Viajes',
      subtitle = 'Listado detallado de viajes programados',
      includeSummary = true,
      companyInfo = null
    } = options;

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          margin: 40, 
          size: 'A4', 
          bufferPages: true,
          info: {
            Title: title,
            Author: 'Sistema de Gestión',
            Creator: 'ReportGenerator',
            CreationDate: new Date()
          }
        });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Configuración de colores y estilos
        const colors = {
          primary: '#1e40af',
          secondary: '#64748b',
          success: '#059669',
          warning: '#d97706',
          lightBg: '#f8fafc',
          border: '#e2e8f0',
          text: '#0f172a',
          textLight: '#475569'
        };

        // Configuración de fuentes
        doc.registerFont('Helvetica-Bold', 'Helvetica-Bold');
        doc.registerFont('Helvetica', 'Helvetica');

        // Constantes de layout
        const pageWidth = doc.page.width;
        const pageMargin = doc.page.margins.left;
        const contentWidth = pageWidth - pageMargin * 2;

        // Columnas ajustadas con mejores proporciones
        const columns = [
          { name: 'ID', width: 40, align: 'center' },
          { name: 'Ruta', width: 180, align: 'left' },
          { name: 'Bus', width: 80, align: 'center' },
          { name: 'Hora', width: 60, align: 'center' },
          { name: 'Fecha', width: 80, align: 'center' },
          { name: 'Asientos', width: 70, align: 'center' }
        ];

        // Función para dibujar encabezado
        const drawHeader = () => {
          // Fondo decorativo en la parte superior
          doc.rect(0, 0, pageWidth, 120)
             .fillOpacity(0.03)
             .fill(colors.primary)
             .fillOpacity(1);

          // Información de la empresa (si se proporciona)
          if (companyInfo) {
            doc.fontSize(10)
               .font('Helvetica')
               .fillColor(colors.textLight)
               .text(companyInfo.name || 'Empresa de Transporte', pageMargin, 50)
               .fontSize(8)
               .text(companyInfo.address || '', pageMargin, 65)
               .text(companyInfo.contact || '', pageMargin, 75);
          }

          // Título principal
          doc.fontSize(24)
             .font('Helvetica-Bold')
             .fillColor(colors.primary)
             .text(title, pageMargin, 100, { align: 'center', width: contentWidth });

          // Subtítulo
          doc.fontSize(12)
             .font('Helvetica')
             .fillColor(colors.secondary)
             .text(subtitle, pageMargin, 130, { align: 'center', width: contentWidth });

          // Línea decorativa
          doc.moveTo(pageMargin, 150)
             .lineTo(pageWidth - pageMargin, 150)
             .lineWidth(2)
             .strokeOpacity(0.1)
             .stroke(colors.primary);

          // Fecha de generación
          doc.fontSize(9)
             .font('Helvetica')
             .fillColor(colors.textLight)
             .text(`Generado: ${new Date().toLocaleString('es-ES', { 
               year: 'numeric', 
               month: 'long', 
               day: 'numeric',
               hour: '2-digit',
               minute: '2-digit'
             })}`, pageMargin, 160, { align: 'right', width: contentWidth });

          doc.moveDown(2.5);
        };

        // Función para dibujar encabezado de tabla
        const drawTableHeader = (y) => {
          const headerHeight = 25;
          const headerX = pageMargin;
          
          // Fondo del encabezado
          doc.rect(headerX, y, contentWidth, headerHeight)
             .fill(colors.primary)
             .fillOpacity(0.1);
          
          // Borde del encabezado
          doc.rect(headerX, y, contentWidth, headerHeight)
             .stroke(colors.border);

          // Textos de las columnas
          let cursorX = headerX + 8;
          doc.font('Helvetica-Bold')
             .fontSize(9)
             .fillColor(colors.primary);

          columns.forEach((col, index) => {
            const options = { 
              width: col.width, 
              align: col.align,
              lineBreak: false
            };
            
            // Ajuste especial para la primera columna (ID)
            if (index === 0) {
              doc.text(col.name, cursorX, y + 8, options);
            } else {
              doc.text(col.name, cursorX, y + 8, options);
            }
            
            cursorX += col.width + (index < columns.length - 1 ? 10 : 0);
          });

          // Línea separadora debajo del encabezado
          doc.moveTo(headerX, y + headerHeight)
             .lineTo(headerX + contentWidth, y + headerHeight)
             .lineWidth(1)
             .stroke(colors.primary)
             .strokeOpacity(0.3);

          doc.y = y + headerHeight + 5;
        };

        // Función para dibujar una fila de datos
        const drawTableRow = (trip, index, y) => {
          const rowHeight = 22;
          const rowX = pageMargin;
          
          // Fondo alternado para mejor legibilidad
          if (index % 2 === 0) {
            doc.rect(rowX, y, contentWidth, rowHeight)
               .fill(colors.lightBg);
          }

          // Borde sutil para cada fila
          doc.rect(rowX, y, contentWidth, rowHeight)
             .strokeOpacity(0.05)
             .stroke(colors.border);

          // Preparar datos
          const fecha = trip.fecha_registro 
            ? new Date(trip.fecha_registro).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
            : '-';

          const rutaDestino = trip.ruta?.destino || '-';
          const placa = trip.bus?.placa || '-';
          const hora = trip.hora_salida || '-';
          
          // Color para asientos basado en disponibilidad
          let asientosColor = colors.text;
          const asientos = trip.asientos_disponibles;
          if (typeof asientos === 'number') {
            if (asientos <= 0) {
              asientosColor = colors.warning;
            } else if (asientos <= 5) {
              asientosColor = colors.warning;
            } else {
              asientosColor = colors.success;
            }
          }

          // Dibujar celdas
          let cursorX = rowX + 8;
          doc.font('Helvetica')
             .fontSize(9)
             .fillColor(colors.text);

          // ID
          doc.text(String(trip.id_registro ?? '-'), cursorX, y + 6, { 
            width: columns[0].width, 
            align: columns[0].align 
          });
          cursorX += columns[0].width + 10;

          // Ruta
          doc.text(rutaDestino, cursorX, y + 6, { 
            width: columns[1].width, 
            align: columns[1].align 
          });
          cursorX += columns[1].width + 10;

          // Bus
          doc.text(placa, cursorX, y + 6, { 
            width: columns[2].width, 
            align: columns[2].align 
          });
          cursorX += columns[2].width + 10;

          // Hora
          doc.text(hora, cursorX, y + 6, { 
            width: columns[3].width, 
            align: columns[3].align 
          });
          cursorX += columns[3].width + 10;

          // Fecha
          doc.text(fecha, cursorX, y + 6, { 
            width: columns[4].width, 
            align: columns[4].align 
          });
          cursorX += columns[4].width + 10;

          // Asientos (con color según disponibilidad)
          doc.fillColor(asientosColor)
             .text(String(asientos ?? '-'), cursorX, y + 6, { 
               width: columns[5].width, 
               align: columns[5].align 
             })
             .fillColor(colors.text); // Reset color

          doc.y = y + rowHeight + 2;
        };

        // Función para dibujar pie de página con números de página
        const drawFooter = (pageNum, totalPages) => {
          const footerY = doc.page.height - 40;
          
          // Línea separadora
          doc.moveTo(pageMargin, footerY - 15)
             .lineTo(pageWidth - pageMargin, footerY - 15)
             .lineWidth(0.5)
             .strokeOpacity(0.2)
             .stroke(colors.border);

          // Número de página
          doc.fontSize(9)
             .font('Helvetica')
             .fillColor(colors.textLight)
             .text(`Página ${pageNum} de ${totalPages}`, 
                   pageMargin, 
                   footerY, 
                   { align: 'center', width: contentWidth });

          // Información de pie de página
          if (companyInfo && companyInfo.footer) {
            doc.fontSize(7)
               .text(companyInfo.footer, 
                     pageMargin, 
                     footerY + 12, 
                     { align: 'center', width: contentWidth });
          }
        };

        // Función para dibujar resumen
        const drawSummary = () => {
          if (!includeSummary || trips.length === 0) return;

          doc.moveDown(1.5);
          
          // Contenedor del resumen
          const summaryY = doc.y;
          const summaryHeight = 60;
          
          doc.rect(pageMargin, summaryY, contentWidth, summaryHeight)
             .fill(colors.lightBg)
             .stroke(colors.border)
             .strokeOpacity(0.3);
          
          // Título del resumen
          doc.fontSize(11)
             .font('Helvetica-Bold')
             .fillColor(colors.primary)
             .text('RESUMEN DEL REPORTE', pageMargin + 15, summaryY + 15);

          // Estadísticas
          const statsY = summaryY + 35;
          
          // Total registros
          doc.fontSize(9)
             .font('Helvetica-Bold')
             .fillColor(colors.text)
             .text('Total de viajes:', pageMargin + 20, statsY)
             .font('Helvetica')
             .fillColor(colors.primary)
             .text(` ${trips.length}`, { continued: true });

          // Espaciado
          const colWidth = contentWidth / 3;
          
          // Viajes con asientos disponibles
          const availableTrips = trips.filter(t => 
            typeof t.asientos_disponibles === 'number' && t.asientos_disponibles > 0
          ).length;
          
          doc.font('Helvetica-Bold')
             .fillColor(colors.text)
             .text('Viajes disponibles:', pageMargin + 20 + colWidth, statsY)
             .font('Helvetica')
             .fillColor(colors.success)
             .text(` ${availableTrips}`, { continued: true });

          // Viajes sin asientos
          const fullTrips = trips.filter(t => 
            typeof t.asientos_disponibles === 'number' && t.asientos_disponibles <= 0
          ).length;
          
          doc.font('Helvetica-Bold')
             .fillColor(colors.text)
             .text('Viajes completos:', pageMargin + 20 + colWidth * 2, statsY)
             .font('Helvetica')
             .fillColor(colors.warning)
             .text(` ${fullTrips}`, { continued: true });

          doc.y = summaryY + summaryHeight + 10;
        };

        // ===== INICIO DEL DOCUMENTO =====
        drawHeader();
        
        const tableStartY = 200;
        doc.y = tableStartY;
        
        // Verificar si hay datos
        if (trips.length === 0) {
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .fillColor(colors.secondary)
             .text('No hay datos disponibles', pageMargin, doc.y, { 
               align: 'center', 
               width: contentWidth 
             });
          doc.moveDown(2);
        } else {
          // Dibujar encabezado de tabla
          drawTableHeader(doc.y);
          
          // Dibujar filas de datos
          trips.forEach((trip, index) => {
            // Verificar si necesitamos nueva página
            if (doc.y > 650) {
              doc.addPage();
              doc.y = 60;
              drawTableHeader(doc.y);
            }
            
            drawTableRow(trip, index, doc.y);
          });

          // Dibujar resumen
          drawSummary();
        }

        // Dibujar pies de página en todas las páginas
        const pageRange = doc.bufferedPageRange();
        for (let i = 0; i < pageRange.count; i++) {
          doc.switchToPage(i);
          drawFooter(i + 1, pageRange.count);
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Guarda el buffer PDF en un archivo en disco
   * @param {Buffer} buffer
   * @param {string} filePath
   */
  static async savePDFToFile(buffer, filePath) {
    await fs.promises.writeFile(filePath, buffer);
  }

  /**
   * Formatea moneda simple
   */
  static formatCurrency(value, moneda = 'bs') {
    const symbol = moneda === 'bs' ? 'Bs' : moneda.toUpperCase();
    return `${symbol} ${Number(value).toLocaleString('es-ES')}`;
  }
}