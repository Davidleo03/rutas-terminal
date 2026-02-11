import supabase, { supabaseAdmin } from "../config/supabase.js";

class AuthModel {
    static async sendPasswordResetEmail(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    static async resetPasswordWithOtp(email, token, newPassword) {
        // 1. Verificar el OTP (esto devuelve una sesión si es válido)
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'recovery',
        });

        if (error) {
            throw new Error('Código inválido o expirado');
        }

        const user = data.user;
        
        if (!user) {
             throw new Error('No se pudo verificar el usuario');
        }

        // 2. Actualizar la contraseña usando el cliente admin
        if (!supabaseAdmin) {
            throw new Error('Error de configuración del servidor (service_role no definido)');
        }

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { password: newPassword }
        );

        if (updateError) {
            throw new Error('Error al actualizar la contraseña: ' + updateError.message);
        }
        
        return true;
    }

    static async LoginUser(userData) {

        // Lógica de inicio de sesión
        const { data, error } = await supabase.auth.signInWithPassword(userData)

        if (error) {
            throw new Error('Error al iniciar sesión: ' + error.message);
        }

        return {
            user: data.user,
            session: data.session
        };




    }
}


export default AuthModel;