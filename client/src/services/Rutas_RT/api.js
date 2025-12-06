import { API_BASE } from "../config";

const BASE_URL = `${API_BASE}/rutas_tiempo_real`;

/**
 * ## 1. Crear (Create) ➕

 */
export async function crearRutaTR(nuevaRuta) {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Si la API requiere un token de autenticación:
                // 'Authorization': `Bearer ${tokenDeUsuario}`
            },
            body: JSON.stringify(nuevaRuta),
        });

        if (!response.ok) {
            throw new Error(`Error al crear la ruta: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en crearRutaTR:", error);
        throw error;
    }
}

/**
 * ## 2. Consultar Lista (Read - All) 📋
 */
export async function obtenerTodasRutasTR() {
    try {
        const response = await fetch(BASE_URL, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error al obtener las rutas: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en obtenerTodasRutasTR:", error);
        throw error;
    }
}

/**
 * ## 3. Consultar por ID (Read - One) 🔎
 */
export async function obtenerRutaTRPorId(id) {
    try {
        const url = `${BASE_URL}/${id}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (response.status === 404) {
             throw new Error("Ruta no encontrada.");
        }

        if (!response.ok) {
            throw new Error(`Error al obtener la ruta (ID: ${id}): ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en obtenerRutaTRPorId (ID: ${id}):`, error);
        throw error;
    }
}

/**
 * ## 4. Actualizar (Update) ✏️
 * Actualiza una ruta de tiempo real existente.
 */
export async function actualizarRutaTR(id, datosActualizados) {
    try {
        const url = `${BASE_URL}/${id}`;
        const response = await fetch(url, {
            method: 'PUT', // O 'PATCH' si solo envías los campos modificados.
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosActualizados),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la ruta (ID: ${id}): ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error en actualizarRutaTR (ID: ${id}):`, error);
        throw error;
    }
}

/**
 * ## 5. Borrar (Delete) 🗑️
 */
export async function borrarRutaTR(id) {
    try {
        const url = `${BASE_URL}/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al borrar la ruta (ID: ${id}): ${response.statusText}`);
        }
        
        // Si el DELETE devuelve un 204 No Content, no llamamos a response.json()
        if (response.status !== 204) {
             // Opcional: devolver el JSON si la API devuelve un mensaje de éxito/objeto borrado
             return await response.json();
        }

    } catch (error) {
        console.error(`Error en borrarRutaTR (ID: ${id}):`, error);
        throw error;
    }
}