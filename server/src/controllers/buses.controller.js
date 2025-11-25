import BusesModel from "../models/buses.model.js";


class BusesController {
    static async getBuses(req, res, next) {
        try {
            const buses = await BusesModel.getBuses();
            res.status(200).json(buses);
        } catch (error) {
            return next ? next(error) : res.status(500).json({ error: 'Ha ocurrido un error' });
        }
    }

    static async createBus(req, res) {
        const busData = req.body;
        try {
            await BusesModel.createBus(busData);
            res.status(201).json({ message: 'Bus creado exitosamente' });
        } catch (error) {
            return next ? next(error) : res.status(500).json({ error: 'Ha ocurrido un error' });
        }
    }

    static async updateBus(req, res) {
        const { busId } = req.params;
        const busData = req.body;
        try {
            await BusesModel.updateBus(busId, busData);
            res.status(200).json({ message: 'Bus actualizado exitosamente' });
        } catch (error) {
            return next ? next(error) : res.status(500).json({ error: 'Ha ocurrido un error' });
        }
    }

    static async deleteBus(req, res) {
        const { busId } = req.params;


        try {
            await BusesModel.deleteBus(busId);
            res.status(200).json({ message: 'Bus eliminado exitosamente' });
        } catch (error) {
            return next ? next(error) : res.status(500).json({ error: 'Ha ocurrido un error' });
        }
    }

    static async getBusByEmpresa(req, res) {
        const { empresaId } = req.params;
        try {
            const buses = await BusesModel.getBusByEmpresa(empresaId);
            res.status(200).json(buses);
        } catch (error) {
            return next ? next(error) : res.status(500).json({ error: 'Ha ocurrido un error' });
        }
    }
}

export default BusesController;