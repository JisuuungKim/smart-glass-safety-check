import { useMutation } from '@tanstack/react-query';
import { generateReport } from '../services';

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: (machine_id: string) => generateReport(machine_id),
  });
};