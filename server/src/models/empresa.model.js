import supabase from "../config/supabase.js";

class EmpresaModel {
    static async getEmpresas() {
        const { data, error } = await supabase
            .from('empresas')
            .select('*')
            .order('id_empresa', { ascending: true });

        if (error) {
            throw new Error('Error al obtener las empresas: ' + error.message);
        }

        return data;
    }

    static async createEmpresa(empresa) {
        const { data, error } = await supabase
            .from('empresas')
            .insert([empresa]);

        if (error) {
            throw new Error('Error al crear la empresa: ' + error.message);
        }

        return data;
    }

    static async updateEmpresa(id, empresa) {
        const { data, error } = await supabase
            .from('empresas')
            .update(empresa)
            .eq('id_empresa', id);

        if (error) {
            throw new Error('Error al actualizar la empresa: ' + error.message);
        }

        return data;
    }

    static async deleteEmpresa(id) {

        const { errorBus } = await supabase
            .from('buses')
            .delete()
            .eq('empresa_id', id);

        if (errorBus) {
            throw new Error('Error al eliminar los buses de la empresa: ' + error.message);
        }


        const { error } = await supabase
            .from('empresas')
            .delete()
            .eq('id_empresa', id);

        if (error) {
            throw new Error('Error al eliminar la empresa: ' + error.message);
        }

        
    }
}

export default EmpresaModel;