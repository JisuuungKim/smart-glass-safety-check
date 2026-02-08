import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadSTT } from '../services';

export const useSTTMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ machine_id, index, audio_file }: {
      machine_id: string;
      index: number;
      audio_file: File;
    }) => uploadSTT(machine_id, index, audio_file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist'] });
    },
  });
};