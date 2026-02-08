import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchChecklist, fetchTTS, updateChecklistItem } from '../services';

export const useChecklists = (machine_id?: string) => {
  return useQuery({
    queryKey: ['checklist', machine_id],
    queryFn: () => fetchChecklist(machine_id!),
    enabled: !!machine_id,
  });
};

export const useTTS = (machine_id?: string) => {
  return useQuery({
    queryKey: ['tts', machine_id],
    queryFn: () => fetchTTS(machine_id!),
    enabled: !!machine_id,
  });
};

export const useUpdateChecklistItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateChecklistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    },
  });
};