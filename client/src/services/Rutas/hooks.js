import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRutas, createRuta, updateRuta, deleteRuta } from './api';

const RUTAS_KEY = ['rutas'];

export function useRutas(options = {}) {
	return useQuery({ queryKey: RUTAS_KEY, queryFn: fetchRutas, ...options });
}

export function useCreateRuta() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ ruta }) => createRuta(ruta),
		onSuccess: () => qc.invalidateQueries({ queryKey: RUTAS_KEY }),
	});
}

export function useUpdateRuta() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, ruta }) => updateRuta(id, ruta),
		onSuccess: () => qc.invalidateQueries({ queryKey: RUTAS_KEY }),
	});
}

export function useDeleteRuta() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id }) => deleteRuta(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: RUTAS_KEY }),
	});
}