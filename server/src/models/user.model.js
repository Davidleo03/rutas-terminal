import supabase from "../config/supabase.js";
import { supabaseAdmin } from "../config/supabase.js";

class UserModel {
  static async getAllUsers() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*, empresa:empresas(*)');

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async createUser(user) {
    const { email, password, id_empresa, role  } = user;
    try {
        // Ensure we have an admin client
        if (!supabaseAdmin) {
          throw new Error('Supabase admin client is not configured. Set SUPABASE_SERVICE_ROLE_KEY in environment variables.');
        }

        // 1. Crear el usuario en Supabase Authentication (Auth) usando el cliente admin
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true // Marca el email como confirmado
        });

        if (authError) {
          console.error('Error al crear usuario en Auth:', authError);
          // Evitar exponer detalles sensibles del error
          throw new Error(authError.message || 'Error creating user in Auth');
        }

        const createdUser = authData?.user;
        if (!createdUser || !createdUser.id) {
          throw new Error('Auth returned unexpected response when creating user');
        }

        // 2. Insertar información adicional en tu tabla 'usuarios'
        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('usuarios')
          .insert([
            {
              // Guarda el id de Auth para poder referenciarlo al eliminar el usuario
              auth_id: createdUser.id,
              email: createdUser.email || email,
              id_empresa: id_empresa,
              role: role,
            },
          ])
          .select();

        if (profileError) {
          // Si la inserción del perfil falla, eliminamos el usuario Auth para mantener la consistencia
          try {
            await supabaseAdmin.auth.admin.deleteUser(createdUser.id);
          } catch (delErr) {
            console.error('Failed to delete auth user after profile insertion failure:', delErr);
          }
          console.error('Error al insertar perfil:', profileError);
          throw new Error('Error al crear perfil del usuario.');
        }

        // Éxito
        return profileData;

      } catch (err) {
        console.error('Error general de servidor:', err);
        throw err;
      }

    
  }

  static async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id_usuario', id)
      .select();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async deleteUserById(id) {


    const { data: user, error: fetchError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id_usuario', id)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    // Primero, eliminar el usuario de Supabase Auth usando el cliente admin
    try {
      if (!supabaseAdmin) {
        throw new Error('Supabase admin client is not configured. Set SUPABASE_SERVICE_ROLE_KEY in environment variables.');
      }

      // Validate auth_id exists and looks like a UUID before calling deleteUser
      const authId = user.auth_id || user.id || user.authId;
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
      if (!authId || typeof authId !== 'string' || !uuidRegex.test(authId)) {
        throw new Error('Invalid or missing auth_id for user; cannot delete from Auth.');
      }

      try {
        const result = await supabaseAdmin.auth.admin.deleteUser(authId);
        // The admin.deleteUser may throw or return an error object depending on the client version
        if (result && result.error) {
          console.error('Error al eliminar usuario de Auth:', result.error);
          throw result.error;
        }
      } catch (delErr) {
        console.error('Error al eliminar usuario de Auth:', delErr);
        throw delErr;
      }
    } catch (err) {
      console.error('Error general al eliminar usuario de Auth:', err);
      throw err;
    }

    // Luego, eliminar el registro del usuario de la tabla 'usuarios'

    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id_usuario', id);

    if (error) {
      throw new Error(error.message);
    }
    return true;
  }
}

export default UserModel;