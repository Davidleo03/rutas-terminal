import PDFDocument from 'pdfkit';
import fs from 'fs';

export default class ReportGenerator {
  static generateTripsPDF(trips = [], options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          margin: 50, 
          size: 'A4', 
          bufferPages: true 
        });
        
        // Opciones personalizables: colores por columna
        const { columnColors = {
          id: '#0000FF',      // azul para ID
          ruta: '#000000',    // negro para ruta
          bus: '#800080',     // púrpura para bus
          hora: '#333333',    // gris oscuro para hora
          fecha: '#444444',   // gris para fecha
          asientos: '#000000' // color base para asientos (se puede sobreescribir según disponibilidad)
        } } = options;
        
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        
        // Establecer fuente ANTES de cualquier texto
        doc.font('Helvetica');
        
        // ENCABEZADO
        doc.fontSize(20)
          .font('Helvetica-Bold')
          .fillColor('black')  // Color negro explícito
          .text('Reporte de Viajes', 50, 50);
        
        doc.fontSize(10)
          .font('Helvetica')
          .fillColor('#444444')  // Gris oscuro
          .text(`Generado: ${new Date().toLocaleString('es-ES')}`, 50, 85);
        
        // Línea separadora
        doc.moveTo(50, 105)
          .lineTo(550, 105)
          .strokeColor('#cccccc')
          .lineWidth(1)
          .stroke();
        
        // Posición inicial para contenido
        doc.y = 120;
        
        if (!trips || trips.length === 0) {
          doc.fontSize(12)
            .fillColor('black')
            .text('No hay datos disponibles', { align: 'center' });
        } else {
          // DEFINIR POSICIONES EXACTAS PARA CADA COLUMNA
          const columnPositions = {
            id: 50,      // Columna ID empieza en 50px
            ruta: 100,   // Columna RUTA empieza en 100px  
            bus: 280,    // Columna BUS empieza en 280px
            hora: 360,   // Columna HORA empieza en 360px
            fecha: 430,  // Columna FECHA empieza en 430px
            asientos: 520 // Columna ASIENTOS empieza en 520px
          };
          
          const columnWidths = {
            id: 40,      // Ancho 40px para ID
            ruta: 170,   // Ancho 170px para RUTA
            bus: 70,     // Ancho 70px para BUS
            hora: 60,    // Ancho 60px para HORA
            fecha: 80,   // Ancho 80px para FECHA
            asientos: 30 // Ancho 30px para ASIENTOS
          };
          
          // ===== ENCABEZADO DE LA TABLA =====
          const headerY = doc.y;
          
          // Fondo del encabezado
          doc.rect(50, headerY, 500, 30)
            .fillColor('#e0e0e0')
            .fill();
          
          // Texto del encabezado - TODOS EN LA MISMA FILA
          doc.fontSize(11)  // Tamaño mayor para mejor visibilidad
            .font('Helvetica-Bold')
            .fillColor('#000000');  // Negro puro
          
          // ID
          doc.text('ID', columnPositions.id, headerY + 10, {
            width: columnWidths.id,
            align: 'center'
          });
          
          // RUTA
          doc.text('RUTA', columnPositions.ruta, headerY + 10, {
            width: columnWidths.ruta,
            align: 'left'
          });
          
          // BUS
          doc.text('BUS', columnPositions.bus, headerY + 10, {
            width: columnWidths.bus,
            align: 'center'
          });
          
          // HORA
          doc.text('HORA', columnPositions.hora, headerY + 10, {
            width: columnWidths.hora,
            align: 'center'
          });
          
          // FECHA
          doc.text('FECHA', columnPositions.fecha, headerY + 10, {
            width: columnWidths.fecha,
            align: 'center'
          });
          
          // ASIENTOS
          doc.text('ASNT.', columnPositions.asientos, headerY + 10, {  // Abreviado para que quepa
            width: columnWidths.asientos,
            align: 'center'
          });
          
          // Línea bajo encabezado
          doc.moveTo(50, headerY + 30)
            .lineTo(550, headerY + 30)
            .strokeColor('#999999')
            .lineWidth(1)
            .stroke();
          
          // Posición para primera fila de datos
          doc.y = headerY + 35;
          
          // ===== FILAS DE DATOS =====
          doc.fontSize(10)  // Tamaño legible
            .font('Helvetica')
            .fillColor('#000000');  // Negro por defecto
          
          trips.forEach((trip, index) => {
            // Control de nueva página
            if (doc.y > 700) {
              doc.addPage();
              doc.y = 50;
              
              // Redibujar encabezado en nueva página
              const newHeaderY = doc.y;
              
              doc.rect(50, newHeaderY, 500, 30)
                .fillColor('#e0e0e0')
                .fill();
              
              doc.fontSize(11)
                .font('Helvetica-Bold')
                .fillColor('#000000');
              
              doc.text('ID', columnPositions.id, newHeaderY + 10, {
                width: columnWidths.id,
                align: 'center'
              });
              
              doc.text('RUTA', columnPositions.ruta, newHeaderY + 10, {
                width: columnWidths.ruta,
                align: 'left'
              });
              
              doc.text('BUS', columnPositions.bus, newHeaderY + 10, {
                width: columnWidths.bus,
                align: 'center'
              });
              
              doc.text('HORA', columnPositions.hora, newHeaderY + 10, {
                width: columnWidths.hora,
                align: 'center'
              });
              
              doc.text('FECHA', columnPositions.fecha, newHeaderY + 10, {
                width: columnWidths.fecha,
                align: 'center'
              });
              
              doc.text('ASNT.', columnPositions.asientos, newHeaderY + 10, {
                width: columnWidths.asientos,
                align: 'center'
              });
              
              doc.moveTo(50, newHeaderY + 30)
                .lineTo(550, newHeaderY + 30)
                .strokeColor('#999999')
                .lineWidth(1)
                .stroke();
              
              doc.y = newHeaderY + 35;
            }
            
            // Fondo alternado para mejor legibilidad
            if (index % 2 === 0) {
              doc.rect(50, doc.y - 5, 500, 25)
                .fillColor('#f8f8f8')
                .fill();
            }
            
            // Preparar datos
            const fecha = trip.fecha_registro 
              ? new Date(trip.fecha_registro).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              : '-';
            
            const datos = [
              trip.id_registro?.toString() || '-',
              trip.ruta?.destino || '-',
              trip.bus?.placa || '-',
              trip.hora_salida || '-',
              fecha,
              typeof trip.asientos_disponibles !== 'undefined' 
                ? trip.asientos_disponibles.toString() 
                : '-'
            ];

            
            
            // Guardar posición Y de esta fila
            const rowY = doc.y;
            
            // ID - Centro
            doc.fillColor(columnColors.id);
            doc.text(datos[0], columnPositions.id, rowY, {
              width: columnWidths.id,
              align: 'center'
            });
            // Restaurar color antes de la siguiente celda (se volverá a cambiar según columna)
            doc.fillColor('#000000');
            
            // RUTA - Izquierda
            doc.fillColor(columnColors.ruta);
            doc.text(datos[1], columnPositions.ruta, rowY, {
              width: columnWidths.ruta,
              align: 'left'
            });
            doc.fillColor('#000000');
            
            // BUS - Centro
            doc.fillColor(columnColors.bus);
            doc.text(datos[2], columnPositions.bus, rowY, {
              width: columnWidths.bus,
              align: 'center'
            });
            doc.fillColor('#000000');
            
            // HORA - Centro
            doc.fillColor(columnColors.hora);
            doc.text(datos[3], columnPositions.hora, rowY, {
              width: columnWidths.hora,
              align: 'center'
            });
            doc.fillColor('#000000');
            
            // FECHA - Centro
            doc.fillColor(columnColors.fecha);
            doc.text(datos[4], columnPositions.fecha, rowY, {
              width: columnWidths.fecha,
              align: 'center'
            });
            doc.fillColor('#000000');
            
            // ASIENTOS - Centro con color: usamos color base y luego lo sobreescribimos según disponibilidad
            const asientos = datos[5];
            doc.fillColor(columnColors.asientos);
            if (trip.asientos_disponibles !== undefined && trip.asientos_disponibles !== null) {
              if (trip.asientos_disponibles <= 0) {
                doc.fillColor('#ff0000'); // Rojo
              } else if (trip.asientos_disponibles <= 5) {
                doc.fillColor('#ff9900'); // Naranja
              } else {
                doc.fillColor('#009900'); // Verde
              }
            }

            doc.text(asientos, columnPositions.asientos, rowY, {
              width: columnWidths.asientos,
              align: 'center'
            });

            // Restaurar color negro
            doc.fillColor('#000000');
            
            // Mover a siguiente fila
            doc.y = rowY + 25;
          });
          
          // ===== RESUMEN =====
          doc.moveDown(1);
          
          // Línea separadora
          doc.moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .strokeColor('#cccccc')
            .lineWidth(1)
            .stroke();
          
          doc.y += 10;
          
          // Estadísticas
          doc.fontSize(11)
            .font('Helvetica-Bold')
            .fillColor('#000000')
            .text(`Total de viajes: ${trips.length}`, 50, doc.y);
          
          const disponibles = trips.filter(t => 
            typeof t.asientos_disponibles === 'number' && t.asientos_disponibles > 0
          ).length;
          
          const completos = trips.filter(t => 
            typeof t.asientos_disponibles === 'number' && t.asientos_disponibles <= 0
          ).length;
          
          doc.fontSize(10)
            .font('Helvetica')
            .fillColor('#444444')
            .text(`• Disponibles: ${disponibles} | • Completos: ${completos}`, 
                  200, doc.y);
        }
        
        // ===== PIE DE PÁGINA EN TODAS LAS PÁGINAS =====
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
          doc.switchToPage(i);
          
          const footerY = doc.page.height - 30;
          
          // Línea del pie
          doc.moveTo(50, footerY - 10)
            .lineTo(550, footerY - 10)
            .strokeColor('#cccccc')
            .lineWidth(0.5)
            .stroke();
          
          // Número de página
          doc.fontSize(9)
            .font('Helvetica')
            .fillColor('#666666')
            .text(
              `Página ${i + 1} de ${pages.count}`,
              50,
              footerY,
              { align: 'center', width: 500 }
            );
        }
        
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  static async savePDFToFile(buffer, filePath) {
    await fs.promises.writeFile(filePath, buffer);
  }

  static formatCurrency(value, moneda = 'bs') {
    const symbol = moneda === 'bs' ? 'Bs' : moneda.toUpperCase();
    return `${symbol} ${Number(value).toLocaleString('es-ES')}`;
  }
}