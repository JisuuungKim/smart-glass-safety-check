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

/**
 * 체크리스트 아이템 상태 업데이트 함수
 */
export const updateChecklistItem = async ({
  machine_id,
  item_index,
  done
}: {
  machine_id: string;
  item_index: number;
  done: boolean;
}) => {
  const response = await api.put('/api/checklists/machine/item', 
    { done },
    {
      params: { machine_id, item_index }
    }
  );
  return response.data;
};