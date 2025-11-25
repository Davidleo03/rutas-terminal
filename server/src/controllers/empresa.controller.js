import EmpresaModel from "../models/empresa.model.js";

class EmpresaController {
    static async getEmpresas(req, res, next) {
        try {
            const empresas = await EmpresaModel.getEmpresas();
            res.status(200).json(empresas);
        } catch (error) {
            
            return next ? next(error) : res.status(500).json({ error: 'Ha ocurrido un error' });
        }
    }

    static async createEmpresa(req, res, next) {
        try {
            const nuevaEmpresa = req.body;
            await EmpresaModel.createEmpresa(nuevaEmpresa);
            res.status(201).json({ message: 'Empresa creada exitosamente' });
        } catch (error) {
            
            return next ? next(error) : res.status(500).json({ error: 'Ha ocurrido un error' });
        }
    }

    static async updateEmpresa(req, res, next) {
        try {
            const id = req.params.id;

            const datosActualizados = req.body;

            await EmpresaModel.updateEmpresa(id, datosActualizados);

            res.status(200).json({ message: 'Empresa actualizada exitosamente' });
        } catch (error) {
            return next ? next(error) : res.status(500).json({ error: 'Ha ocurrido un error' });
        }
    }
    
    static async deleteEmpresa(req, res, next) {
        try {
            const id = req.params.id;
            await EmpresaModel.deleteEmpresa(id);
            res.status(204).send();
        } catch (error) {
            return next ? next(error) : res.status(500).json({ error: 'Ha ocurrido un error' });
        }
    }
}

export default EmpresaController;