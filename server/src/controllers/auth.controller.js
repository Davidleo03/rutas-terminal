import AuthModel from "../models/auth.model.js";
import UserModel from "../models/user.model.js";

class AuthController {
    static async loginUser(req, res) {
        const userData = req.body;
        
        try {
            const auth = await AuthModel.LoginUser(userData);

            const { email } = auth.user;

            const user = await UserModel.getUserByEmail(email);

            

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
             

            
            res.status(200).json({
                message: 'Login exitoso',
                session: auth.session,
                user : user
            });
        } catch (error) {
            console.error('Error en el servidor:', error.message);
            // Si el error parece de autenticación, devolver 401
            const msg = String(error.message || '').toLowerCase();
            if (msg.includes('invalid') || msg.includes('credentials') || msg.includes('email') || msg.includes('password')) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

export default AuthController;