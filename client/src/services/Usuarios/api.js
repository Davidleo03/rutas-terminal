import { API_BASE } from "../config";

const BASE_URL = `${API_BASE}/users`;

/**
 * ## 1. Consultar Lista de Usuarios (Read - All) 👤
 * Obtiene la lista de todos los usuarios.
 * @returns {Promise<Array<object>>} Una lista de objetos de usuario.
 */
export async function obtenerTodosUsuarios() {
    try {
        const response = await fetch(BASE_URL, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error al obtener los usuarios: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en obtenerTodosUsuarios:", error);
        throw error;
    }
}

/**
 * ## 2. Crear Nuevo Usuario (Create) ➕
 * Crea un nuevo usuario.
 * @param {object} nuevoUsuario - El objeto de datos del nuevo usuario (ej: { nombre, email, password }).
 * @returns {Promise<object>} El usuario creado devuelto por el servidor.
 */
export async function crearUsuario(nuevoUsuario) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Agregar encabezados de autenticación si es necesario
            },
            body: JSON.stringify(nuevoUsuario),
        });

        if (!response.ok) {
            // Intenta leer el mensaje de error del cuerpo si está disponible
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = errorBody.message || response.statusText;
            throw new Error(`Error al crear el usuario (${response.status}): ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en crearUsuario:", error);
        throw error;
    }
}

/**
 * ## 3. Eliminar Usuario (Delete) 🗑️
 * Elimina un usuario por su ID.
 * @param {string | number} id - El ID del usuario a eliminar.
 * @returns {Promise<void>}
 */
export async function borrarUsuario(id) {
    try {
        const url = `${BASE_URL}/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            // Agregar encabezados de autenticación si es necesario
        });

        if (!response.ok) {
            throw new Error(`Error al borrar el usuario (ID: ${id}): ${response.statusText}`);
        }
        
        // Si el DELETE devuelve un 204 No Content, no llamamos a response.json()
        if (response.status !== 204) {
             // Opcional: devolver el JSON si la API devuelve un mensaje de éxito/objeto borrado
             return await response.json();
        }

    } catch (error) {
        console.error(`Error en borrarUsuario (ID: ${id}):`, error);
        throw error;
    }
}