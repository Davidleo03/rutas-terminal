import supabase from "../config/supabase.js";

class UserModel {
  static async getAllUsers() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async createUser(userData) {
    

    const { data: user } = await supabase
      .from('usuarios')
      .select('*')
      .eq('username', userData.username)
      .single();

    if (user) {
      throw new Error('El usuario con este nombre ya existe');
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert([userData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
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
}

export default UserModel;