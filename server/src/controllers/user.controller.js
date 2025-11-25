import UserModel from "../models/user.model.js";
import { createUserSchema } from '../validations/user.validation.js'

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      const { message } = error;
      console.error(`Ha ocurrido un error al obtener los usuarios: ${message}`);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  }
  
  static async createUser(req, res) {
    try {

      createUserSchema.parse(req);

      const userData = req.body;
      const newUser = await UserModel.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      const { message } = error;
      console.error(`Ha ocurrido un error al crear el usuario: ${message}`);
      res.status(500).json({ message: 'Error al crear el usuario' });
    }
  }
}

export default UserController;