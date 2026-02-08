import { useQuery } from '@tanstack/react-query';
import { fetchChecklist, fetchTTS } from '../services';

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