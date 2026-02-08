import { useState, useCallback } from 'react';

interface UseOpenAITTSReturn {
  speak: (text: string) => Promise<void>;
  isSpeaking: boolean;
}

export const useOpenAITTS = (): UseOpenAITTSReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not found');
      return;
    }

    try {
      setIsSpeaking(true);

      // OpenAI TTS API 호출
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'alloy',
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 바이너리 데이터를 Blob으로 변환
      const audioBlob = await response.blob();
      
      // URL.createObjectURL을 사용해 오디오 객체 생성
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // 음성이 완전히 끝날 때까지 기다리는 Promise 생성
      const playbackPromise = new Promise<void>((resolve, reject) => {
        // 오디오 이벤트 리스너 설정
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl); // 메모리 정리
          resolve();
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl); // 메모리 정리
          console.error('Audio playback error');
          reject(new Error('Audio playback failed'));
        };
      });

      // 즉시 재생
      await audio.play();
      
      // 음성이 완전히 끝날 때까지 기다림
      await playbackPromise;
      
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    isSpeaking,
  };
};