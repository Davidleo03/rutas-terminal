import supabase from '../config/supabase.js';

class RutasTRModel {
    static async getAllRutasTR() {
        const { data, error } = await supabase
            .from('rutas_tiempo_real')
            .select('*, ruta:rutas(*), bus:buses(*)');
        if (error) throw error;
        return data;
    }

    static async getRutaTRById(id) {
        const { data, error } = await supabase
            .from('rutas_tiempo_real')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }

    static async createRutaTR(rutaTR) {
        const { asientos_disponibles, ...dataRuta } = rutaTR
        const { data, error } = await supabase
            .from('rutas_tiempo_real')
            .insert([rutaTR])
            .select('*, ruta:rutas(*)')
            .single();
        
        if (error) throw error;
        const { error: errorHistory } = await supabase
            .from('historial_rutas')
            .insert([{...dataRuta, id_empresa: data?.ruta?.id_empresa}])
            .single();
        if (errorHistory) throw errorHistory;

        return data;
    }

    static async updateRutaTR(id, rutaTR) {
        const { data, error } = await supabase
            .from('rutas_tiempo_real')
            .update(rutaTR)
            .eq('id_registro', id)
            .single();
        if (error) throw error;
        return data;
    }

    static async deleteRutaTR(id) {
        const { data, error } = await supabase
            .from('rutas_tiempo_real')
            .delete()
            .eq('id_registro', id)
            .single();
        if (error) throw error;
        return data;
    }
}

export default RutasTRModel;