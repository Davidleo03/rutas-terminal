import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    obtenerTodosUsuarios,
    crearUsuario,
    borrarUsuario
} from './api.js'; // Asume que tus funciones de API de Usuarios están aquí

// Clave única para identificar y cachear las consultas de Usuarios
const USUARIOS_KEY = ['usuarios'];



/**
 * ## 1. Hook para Consultar Todos los Usuarios (Read) 📋
 * Usa: const { data: usuarios, isLoading } = useUsuarios();
 * @param {object} options - Opciones de useQuery.
 * @returns {object} Resultado de useQuery.
 */
export function useUsuarios(options = {}) {
    return useQuery({
        queryKey: USUARIOS_KEY,
        queryFn: obtenerTodosUsuarios,
        ...options
    });
}

/**
 * ## 2. Hook para Crear un Usuario (Create) ➕
 * Usa: const { mutate: crear, isLoading } = useCreateUsuario();
 * Llamada: crear({ nuevoUsuario });
 */
export function useCreateUsuario() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ nuevoUsuario }) => crearUsuario(nuevoUsuario),
        // Al crear un usuario, invalidamos la lista para que se recargue automáticamente
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: USUARIOS_KEY });
        },
    });
}

/**
 * ## 3. Hook para Eliminar un Usuario (Delete) 🗑️
 * Usa: const { mutate: eliminar, isLoading } = useDeleteUsuario();
 * Llamada: eliminar({ id: 456 });
 */
export function useDeleteUsuario() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id }) => borrarUsuario(id),
        // Al eliminar un usuario, invalidamos la lista para forzar la recarga
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: USUARIOS_KEY });
        },
    });
}