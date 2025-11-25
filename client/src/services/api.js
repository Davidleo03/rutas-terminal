import supabase from "../libs/supabase";

const url = import.meta.env.VITE_URL_SEVICE_API;

export const getUsers = async () => {
  try {
    let { data: users, error } = await supabase.from('usuarios').select('*');

    if (error) {
      throw error;
    }

    return users;   
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}