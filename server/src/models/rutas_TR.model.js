import supabase from '../config/supabase.js';

class RutasTRModel {
    static async getAllRutasTR() {
        const { data, error } = await supabase
            .from('rutas_tiempo_real')
            // incluir la empresa relacionada dentro de la ruta para obtener tipo_ruta
            .select('*, ruta:rutas(*, empresa:empresas(tipo_ruta, nombre_empresa)), bus:buses(*)');
        if (error) throw error;
        // añadir campos raíz para facilitar el filtrado en frontend
        return (data || []).map(d => ({
            ...d,
            tipo_ruta: d?.ruta?.empresa?.tipo_ruta ?? null,
            nombre_empresa: d?.ruta?.empresa?.nombre_empresa ?? null,
        }));
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
            // incluir la empresa relacionada dentro de la ruta para obtener tipo_ruta
            .select('*, ruta:rutas(*, empresa:empresas(tipo_ruta, nombre_empresa)), bus:buses(*)')
            .in('id_ruta', rutaIds);
        if (error) throw error;

        return (data || []).map(d => ({
            ...d,
            tipo_ruta: d?.ruta?.empresa?.tipo_ruta ?? null,
            // fallback: intentar obtener nombre desde la consulta previa a `rutas`
            nombre_empresa: d?.ruta?.empresa?.nombre_empresa ?? rutas.find(r => r.id_ruta === d.id_ruta)?.empresa?.nombre_empresa ?? null,
        }));
    }

    static async getRutaTRById(id) {
        const { data, error } = await supabase
            .from('rutas_tiempo_real')
            .select('*, ruta:rutas(*, empresa:empresas(tipo_ruta, nombre_empresa)), bus:buses(*)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return {
            ...data,
            tipo_ruta: data?.ruta?.empresa?.tipo_ruta ?? null,
            nombre_empresa: data?.ruta?.empresa?.nombre_empresa ?? null,
        };
    }

    static async createRutaTR(rutaTR) {
        const { asientos_disponibles, ...dataRuta } = rutaTR
        const { data, error } = await supabase
            .from('rutas_tiempo_real')
            .insert([rutaTR])
            // devolver también la ruta con su empresa para incluir tipo_ruta si es necesario
            .select('*, ruta:rutas(*, empresa:empresas(tipo_ruta, nombre_empresa))')
            .single();
        
        if (error) throw error;
        const { error: errorHistory } = await supabase
            .from('historial_rutas')
            .insert([{...dataRuta, id_empresa: data?.ruta?.id_empresa}])
            .single();
        if (errorHistory) throw errorHistory;

        return {
            ...data,
            tipo_ruta: data?.ruta?.empresa?.tipo_ruta ?? null,
            nombre_empresa: data?.ruta?.empresa?.nombre_empresa ?? null,
        };
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