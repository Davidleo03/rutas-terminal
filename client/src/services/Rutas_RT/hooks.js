import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    obtenerTodasRutasTR,
    obtenerRutaTRPorId,
    crearRutaTR,
    actualizarRutaTR,
    borrarRutaTR
} from './api.js'; // Asume que tus funciones de API están aquí

// Clave única para identificar y cachear las consultas de Rutas de Tiempo Real
const RUTAS_TR_KEY = ['rutas_tiempo_real'];



/**
 * ## 1. Hook para Consultar Todas las Rutas (Read - All) 📋
 * Usa: const { data: rutas, isLoading } = useRutasTR();
 * @param {object} options - Opciones de useQuery.
 * @returns {object} Resultado de useQuery.
 */
export function useRutasTR(options = {}) {
    return useQuery({
        queryKey: RUTAS_TR_KEY,
        queryFn: obtenerTodasRutasTR,
        ...options
    });
}

/**
 * ## 2. Hook para Consultar una Ruta por ID (Read - One) 🔎
 * Usa: const { data: ruta, isLoading } = useRutaTRPorId(123);
 * @param {string | number} id - El ID de la ruta.
 * @param {object} options - Opciones de useQuery.
 * @returns {object} Resultado de useQuery.
 */
export function useRutaTRPorId(id, options = {}) {
    return useQuery({
        // La clave incluye el ID para cachear cada ruta individualmente
        queryKey: [...RUTAS_TR_KEY, id],
        // Solo ejecuta la consulta si el 'id' es válido
        queryFn: () => obtenerRutaTRPorId(id),
        enabled: !!id, 
        ...options
    });
}



/**
 * ## 3. Hook para Crear una Ruta (Create) ➕
 * Usa: const { mutate: crear, isLoading } = useCreateRutaTR();
 * Llamada: crear({ nuevaRuta });
 */
export function useCreateRutaTR() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ nuevaRuta }) => crearRutaTR(nuevaRuta),
        // Invalida la lista completa de rutas para forzar una nueva consulta
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: RUTAS_TR_KEY });
        },
    });
}

/**
 * ## 4. Hook para Actualizar una Ruta (Update) ✏️
 * Usa: const { mutate: actualizar, isLoading } = useUpdateRutaTR();
 * Llamada: actualizar({ id: 123, datosActualizados });
 */
export function useUpdateRutaTR() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, datosActualizados }) => actualizarRutaTR(id, datosActualizados),
        onSuccess: (data, variables) => {
            // Invalida la lista completa
            qc.invalidateQueries({ queryKey: RUTAS_TR_KEY });
            // Opcional: Actualiza directamente la caché del objeto individual
            qc.invalidateQueries({ queryKey: [...RUTAS_TR_KEY, variables.id] });
        },
    });
}

/**
 * ## 5. Hook para Borrar una Ruta (Delete) 🗑️
 * Usa: const { mutate: borrar, isLoading } = useDeleteRutaTR();
 * Llamada: borrar({ id: 123 });
 */
export function useDeleteRutaTR() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id }) => borrarRutaTR(id),
        // Invalida la lista completa de rutas
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: RUTAS_TR_KEY });
        },
    });
}