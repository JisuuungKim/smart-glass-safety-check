import api from './api';

/**
 * 체크리스트를 가져오는 함수
 */
export const fetchChecklist = async (machine_id: string) => {
  const response = await api.get('/api/checklists/machine', {
    params: { machine_id }
  });
  return response.data;
};

/**
 * TTS 데이터를 가져오는 함수
 */
export const fetchTTS = async (machine_id: string) => {
  const response = await api.get('/api/tts/machine', {
    params: { machine_id }
  });
  return response.data;
};