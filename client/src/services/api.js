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

export const loginUser = async (credentials) => {
  try {
    // Normalizar URL para evitar doble slash
    const base = String(url || '').replace(/\/+$/, '');
    const res = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || 'Error en login');
    }

    return data;
  } catch (error) {
    console.error('loginUser error:', error);
    throw error;
  }
};