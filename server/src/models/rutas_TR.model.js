import supabase from '../config/supabase.js';

class RutasTRModel {
    static async getAllRutasTR() {
        const { data, error } = await supabase
            .from('rutas_tiempo_real')
            .select('*, ruta:rutas(*), bus:buses(*)');
        if (error) throw error;
        return data;
    }

    static async getRutasTRByEmpresa(id_empresa) {
        // Primero obtener los ids de las rutas que pertenecen a la empresa
        const { data: rutas, error: rutasError } = await supabase
            .from('rutas')
            .select('id_ruta, empresa:empresas(nombre_empresa)')
            .eq('id_empresa', id_empresa);
            //console.log(rutas)
        if (rutasError) throw rutasError;

        const rutaIds = (rutas || []).map(r => r.id_ruta);
        if (rutaIds.length === 0) return [];

        // Luego obtener las rutas en tiempo real cuya columna FK (id_ruta) esté en esos ids
        const { data, error } = await supabase
            .from('rutas_tiempo_real')
            .select('*, ruta:rutas(*), bus:buses(*)')
            .in('id_ruta', rutaIds);
        if (error) throw error;

        return data?.map(d => ({...d, nombre_empresa: rutas[0].nombre_empresa}));
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