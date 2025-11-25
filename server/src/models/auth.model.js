import supabase from "../config/supabase.js";

class AuthModel {
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