import { useQuery } from '@tanstack/react-query';
import { fetchChecklist } from '../services';

export const useChecklists = (machine_id?: string) => {
  return useQuery({
    queryKey: ['checklist', machine_id],
    queryFn: () => fetchChecklist(machine_id!),
    enabled: !!machine_id,
  });
};