import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBuses, deleteBus, createBus, updateBus } from '../buses/api.js';

export const useBuses = (options = {}) => {
  return useQuery({
    queryKey: ['buses'],
    queryFn: fetchBuses,
    staleTime: 1000 * 60,
    ...options,
  });
};

export const useDeleteBus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBus,
    onSuccess: () => qc.invalidateQueries(['buses']),
  });
};

export const useCreateBus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBus,
    onSuccess: () => qc.invalidateQueries(['buses']),
  });
};

export const useUpdateBus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateBus(data.busId, data.busData),
    onSuccess: () => qc.invalidateQueries(['buses']),
  });
};

export default null;
