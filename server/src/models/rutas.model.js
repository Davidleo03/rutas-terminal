import supabase from '../config/supabase.js'

class RutasModel {
    static async getRutas() {
        const { data, error } = await supabase
            .from('rutas')
            .select('*, empresa:id_empresa(nombre_empresa, tipo_ruta)')
            .order('destino', { ascending: true });

        if (error) {
            throw new Error('Error al obtener las rutas: ' + error.message);
        }

        return data;
    }

    static async createRuta(rutaData) {
        const { data, error } = await supabase
            .from('rutas')
            .insert([rutaData])
            .single();

        if (error) {
            throw new Error('Error al crear la ruta: ' + error.message);
        }

        return data;
    }

    static async updateRuta(rutaId, rutaData) {
        const { data, error } = await supabase
            .from('rutas')
            .update(rutaData)
            .eq('id_ruta', rutaId)
            .single();

        if (error) {
            throw new Error('Error al actualizar la ruta: ' + error.message);
        }

        return data;
    }

    static async deleteRuta(rutaId) {
        const { error } = await supabase
            .from('rutas')
            .delete()
            .eq('id_ruta', rutaId);

        if (error) {
            throw new Error('Error al eliminar la ruta: ' + error.message);
        }
    }

    static async getRutasByEmpresa(empresaId) {
        const { data, error } = await supabase
            .from('rutas')
            .select('*, empresa:id_empresa(nombre_empresa, tipo_ruta)')
            .eq('id_empresa', empresaId);
            
        if (error) {
            throw new Error('Error al obtener las rutas por empresa: ' + error.message);
        }
        return data;
    }
}

export default RutasModel;