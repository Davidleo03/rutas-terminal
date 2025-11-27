import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmpresas, createEmpresa, updateEmpresa, deleteEmpresa } from './api';

const EMPRESAS_KEY = ['empresas'];

export function useEmpresas(options = {}) {
  return useQuery({ queryKey: EMPRESAS_KEY, queryFn: getEmpresas, ...options });
}

export function useCreateEmpresa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ empresa }) => createEmpresa(empresa),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMPRESAS_KEY });
    },
  });
}

export function useUpdateEmpresa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, empresa }) => updateEmpresa(id, empresa),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMPRESAS_KEY });
    },
  });
}

export function useDeleteEmpresa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteEmpresa(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMPRESAS_KEY });
    },
  });
}
