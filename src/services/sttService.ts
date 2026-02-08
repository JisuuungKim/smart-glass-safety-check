import api from './api';

/**
 * 음성을 텍스트로 변환하는 함수
 */
export const uploadSTT = async (machine_id: string, index: number, audio_file: File) => {
  const formData = new FormData();
  formData.append('machine_id', machine_id);
  formData.append('index', index.toString());
  formData.append('audio_file', audio_file);

  const response = await api.post('/api/stt', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};