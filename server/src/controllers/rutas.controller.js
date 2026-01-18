import RutasModel from "../models/rutas.model.js";

class RutasController {
    static async getRutas(req, res) {
        try {
            const rutas = await RutasModel.getRutas();
            res.status(200).json(rutas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createRuta(req, res) {
        try {
            const rutaData = req.body;
            
            await RutasModel.createRuta(rutaData);
            res.status(201).json({ msg : 'Ruta creada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateRuta(req, res) {
        try {
            const rutaId = req.params.id;
            const rutaData = req.body;
            await RutasModel.updateRuta(rutaId, rutaData);
            res.status(200).json({ msg : 'Ruta actualizada exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteRuta(req, res) {
        try {
            const rutaId = req.params.id;
            await RutasModel.deleteRuta(rutaId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getRutasByEmpresa(req, res) {
        try {
            const empresaId = req.params.id;
            const rutas = await RutasModel.getRutasByEmpresa(empresaId);
            res.status(200).json(rutas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default RutasController;