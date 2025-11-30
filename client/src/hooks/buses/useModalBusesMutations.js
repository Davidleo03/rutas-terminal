import { useCreateBus, useUpdateBus } from '../../services/buses/hooks';

export function useModalBusesMutations() {
  const createMutation = useCreateBus();
  const updateMutation = useUpdateBus();

  return { createMutation, updateMutation };
}

export default useModalBusesMutations;
