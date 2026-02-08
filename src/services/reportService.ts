import api from './api';

/**
 * 리포트를 생성하는 함수
 */
export const generateReport = async (machine_id: string) => {
  const response = await api.post('/api/reports/generate', {
    machine_id
  });
  return response.data;
};