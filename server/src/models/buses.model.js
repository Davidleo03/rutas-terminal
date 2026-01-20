import supabase from "../config/supabase.js";

class BusesModel {
    static async getBuses() {
        const { data, error } = await supabase
            .from('buses')
            .select('*, empresa:empresa_id(*)');

        if (error) {
            throw new Error('Error al obtener los buses: ' + error.message);
        }

        

        return data;
    }



    static async createBus(busData) {
        const { data, error } = await supabase
            .from('buses')
            .insert([busData])
            .single();

        if (error) {
            throw new Error('Error al crear el bus: ' + error.message);
        }

        return data;
    }


    static async updateBus(busId, busData) {
        const { data, error } = await supabase
            .from('buses')
            .update(busData)
            .eq('id_bus', busId)
            .single();

        if (error) {
            throw new Error('Error al actualizar el bus: ' + error.message);
        }

        return data;
    }
    
    static async deleteBus(busId) {

        const { errorBus } = await supabase
            .from('buses')
            .delete()
            .eq('id_bus', busId)
            
            

        if (errorBus) {
            throw new Error('Error al eliminar el bus: ' + error.message);
        }

    }

    

    static async getBusByEmpresa(empresaId) {
        const { data, error } = await supabase
            .from('buses')
            .select('*')
            .eq('empresa_id', empresaId);

        if (error) {
            throw new Error('Error al obtener los buses por empresa: ' + error.message);
        }

        return data;
    }
}

export default BusesModel;