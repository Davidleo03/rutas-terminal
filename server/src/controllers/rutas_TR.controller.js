import RutasTRModel from "../models/rutas_TR.model.js";
import ReportGenerator from "../utils/ReportGenerator.js";

class RutasTRController {
    static async getAllRutasTR(req, res) {
        try {
            const rutasTR = await RutasTRModel.getAllRutasTR();
            res.status(200).json(rutasTR);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getRutaTRById(req, res) {
        const { id } = req.params;
        try {
            const rutaTR = await RutasTRModel.getRutaTRById(id);
            res.status(200).json(rutaTR);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createRutaTR(req, res) {
        const rutaTRData = req.body;
        try {
            await RutasTRModel.createRutaTR(rutaTRData);
            res.status(201).json({ msg: "Ruta de tiempo real creada exitosamente"} );
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateRutaTR(req, res) {
        const { id } = req.params;
        const rutaTRData = req.body;
        try {
            await RutasTRModel.updateRutaTR(id, rutaTRData);
            res.status(200).json({ msg: "Ruta de tiempo real actualizada exitosamente"} );
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteRutaTR(req, res) {
        const { id } = req.params;
        try {
            const deletedRutaTR = await RutasTRModel.deleteRutaTR(id);
            res.status(200).json(deletedRutaTR);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async downloadTripsPDF(req, res) {
        try {
            const rutasTR = await RutasTRModel.getAllRutasTR();
            const buffer = await ReportGenerator.generateTripsPDF(rutasTR, { title: 'Reporte - Rutas Tiempo Real' });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="reporte_rutas_tr.pdf"');
            res.send(buffer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default RutasTRController;