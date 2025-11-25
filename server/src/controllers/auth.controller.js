import AuthModel from "../models/auth.model.js";

class AuthController {
    static async loginUser(req, res) {
        const userData = req.body;
        
        try {
            const response = await AuthModel.LoginUser(userData);
            
            res.status(200).json({
                message: 'Login exitoso',
                user: response.user,
                session: response.session
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