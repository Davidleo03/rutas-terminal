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

    static async registerUser(req, res) {
        const userData = req.body;

        try {
            const newUser = await UserModel.createUser(userData);
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: newUser
            });
        } catch (error) {
            console.error('Error en el servidor:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async forgotPassword(req, res) {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email requerido' });

        try {
            await AuthModel.sendPasswordResetEmail(email);
            res.status(200).json({ message: 'Correo de recuperación enviado' });
        } catch (error) {
            console.error('Error sending reset email:', error.message);
            // Don't reveal if user exists or not for security, or do if required. 
            // Supabase returns 200 even if user doesn't exist usually.
            res.status(400).json({ error: error.message });
        }
    }

    static async resetPassword(req, res) {
        const { email, token, newPassword } = req.body;
        if (!email || !token || !newPassword) {
            return res.status(400).json({ error: 'Faltan datos requeridos (email, token, password)' });
        }

        try {
            await AuthModel.resetPasswordWithOtp(email, token, newPassword);
            res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
        } catch (error) {
            console.error('Error resetting password:', error.message);
            res.status(400).json({ error: error.message });
        }
    }
}

export default AuthController;