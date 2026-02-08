import { useEffect, useState } from 'react';
import { ArrowLeft, Mic } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ActivationMode } from '../../components/common';
import { useOpenAITTS } from '@/hooks';
import { useTTS, useSTTMutation } from '@/hooks';
import { useMachineStore } from '@/store/machineStore';
import { useUpdateChecklistItem } from '@/hooks';

// interface ChecklistItem {
//   index: number;
//   todo: string;
//   done: boolean;
// }

// interface Checklists {
//   machine_id: string;
//   items: ChecklistItem[];
// }

const VoiceRecorderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const machine_id = searchParams.get('machine_id') || '1'; // 기본값 '1'
  
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const { speak, isSpeaking } = useOpenAITTS();
  const { data: TTSData, isPending: ttsLoading } = useTTS(machine_id);
  const sttMutation = useSTTMutation();
  const updateMutation = useUpdateChecklistItem();
  const { order_idx } = useMachineStore();

  const voices = TTSData?.voices || [];
  const isComplete = currentIndex >= voices.length;

  console.log(order_idx);

  // TTS 데이터 로드 완료 시 첫 번째 음성 자동 재생
  useEffect(() => {
    if (TTSData && !ttsLoading && isLoading && voices.length > 0 && !isComplete) {
      console.log('TTS data:', TTSData);
      playCurrentVoice();
    }
  }, [TTSData, ttsLoading, isLoading]);

  // 컴포넌트 언마운트 시 녹음 정리
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaRecorder]);

  // 현재 음성 재생
  const playCurrentVoice = (index = currentIndex) => {
    const voice = voices[index];
    if (!voice) return;
    
    setIsPlaying(true);
    const audio = new Audio(voice.voice_url);
    
    audio.onended = () => {
      setIsPlaying(false);
    };
    
    audio.onerror = () => {
      console.error('Audio playback failed');
      setIsPlaying(false);
    };
    
    audio.play();
  };

  // 녹음 토글
  const toggleRecording = async () => {
    if (isPlaying) return; // 재생 중일 때는 녹음 불가
    
    if (isRecording) {
      // 녹음 중지
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
      }
    } else {
      // 녹음 시작
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        recorder.onstop = () => {
          handleRecordingComplete(chunks);
        };
        
        setMediaRecorder(recorder);
        recorder.start();
        setIsRecording(true);
        
      } catch (error) {
        console.error('마이크 접근 실패:', error);
        alert('마이크 접근 권한이 필요합니다.');
      }
    }
  };

  // 녹음 완료 처리
  const handleRecordingComplete = (chunks: Blob[]) => {
    if (chunks.length === 0) return;
    
    // 오디오 Blob 생성
    const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
    
    // 현재 인덱스를 저장 (race condition 방지)
    const recordingIndex = currentIndex + 1;
    
    // 파일 저장
    saveAudioFile(audioBlob, `recording_${recordingIndex}_${new Date().toISOString()}.mp3`, recordingIndex);
    
    console.log(`Recording completed for voice ${recordingIndex}`);
    
    // 다음 음성으로 이동
    const nextIndex = currentIndex + 1;
    if (nextIndex < voices.length) {
      setCurrentIndex(nextIndex);
      setTimeout(() => {
        playCurrentVoice(nextIndex);
      }, 1000);
    } else {
      navigate('/user/voice-recorder/complete');
    }
    
    // MediaRecorder 정리
    if (mediaRecorder) {
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  // 파일 저장 함수
  const saveAudioFile = async (audioBlob: Blob, filename: string, index: number) => {
    // 로컬 다운로드
    // const url = URL.createObjectURL(audioBlob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = filename;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
    
    // 서버 업로드
    try {
      const audioFile = new File([audioBlob], filename, { type: 'audio/mp3' });
      await sttMutation.mutateAsync({
        machine_id,
        index: index,
        audio_file: audioFile
      });
      console.log('서버 업로드 성공');
      updateMutation.mutate({
        machine_id,
        item_index: index,
        done: true
      });
      console.log('체크리스트 상태 업데이트 성공');
    } catch (error) {
      console.error('서버 업로드 실패:', error);
    }
  };
  

  const handleAudioStart = async () => {
    if (!isSpeaking) {
      try {
        await speak(`압축기 A-00${machine_id}} 점검 모드를 활성화합니다. 음성 안내에 따라 답변을 진행해 주세요.`);
        setIsLoading(true);
      } catch (error) {
        console.error('TTS error:', error);
        setIsLoading(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white relative overflow-hidden">
      {/* Background decorative elements - matching Figma colors */}
      <div 
        className="absolute -left-28 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(160, 153, 255, 0.3) 0%, rgba(160, 153, 255, 0.1) 50%, transparent 100%)'
        }}
      />
      <div 
        className="absolute right-12 bottom-32 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(160, 153, 255, 0.3) 0%, rgba(160, 153, 255, 0.1) 50%, transparent 100%)'
        }}
      />
      
      <div className="flex flex-col h-screen max-w-sm mx-auto px-6 py-3">

        {!isLoading && (
          <ActivationMode onActivate={handleAudioStart} text={`압축기 A-00${machine_id} 점검 모드 활성화`} />
        )}

        {isLoading && (
          <>
        {/* Header Information */}
        <div className="mb-6 pt-3">
          <div className="text-center space-y-1 mb-4">
            <h1 className="text-lg font-semibold text-white">A 공장</h1>
            <h2 className="text-base text-gray-300">압축기 A-00{machine_id}</h2>
            <div className="text-xs text-gray-400 space-y-0.5">
              <p>공압 시스템 | 생산1라인</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          {voices.length > 0 && (
            <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
              <div 
                className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex) / voices.length) * 100}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* AI Message */}
        <div className="mb-6 px-4 py-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-300 leading-relaxed">
                {isPlaying ? (
                  `음성 ${currentIndex + 1}/${voices.length}번을 재생 중입니다...`
                ) : isRecording ? (
                  `음성 ${currentIndex + 1}번에 대한 답변을 녹음 중입니다...`
                ) : isComplete ? (
                  '모든 음성 재생이 완료되었습니다!'
                ) : (
                  `음성 ${currentIndex + 1}/${voices.length}번 재생이 완료되었습니다.`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content - Timer Circle */}
        <div className="flex-1 flex flex-col items-center justify-center px-1">
          <div className="relative mb-16">
            {/* Outer glow effect - matching Figma */}
            <div 
              className={`w-80 h-80 rounded-full transition-all duration-1000 flex items-center justify-center ${
                isRecording ? 'animate-pulse' : ''
              }`}
              style={{
                boxShadow: '0px 7px 48px rgba(160, 153, 255, 0.2)',
                filter: isRecording ? 'drop-shadow(0 0 60px rgba(160, 153, 255, 0.4))' : 'none'
              }}
            >
              {/* Inner dark circle */}
              <div 
                className="w-44 h-44 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: '#333333',
                  boxShadow: '0px 4px 27px rgba(160, 153, 255, 0.2)'
                }}
              >
                {/* Center indicator */}
                <div className={`w-32 h-32 rounded-full transition-all duration-300 ${
                  isRecording ? 'bg-purple-400/30 animate-pulse' : 'bg-gray-700/30'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Recorder Control */}
        <div 
          className="rounded-xl p-8 mb-6 border border-zinc-600"
          style={{
            backgroundColor: '#262626',
            boxShadow: 'inset -3px -3px 15px rgba(48, 48, 48, 0.8), inset 4px 4px 20px rgba(11, 11, 11, 0.75)'
          }}
        >
          <div className="flex items-center justify-center">
            <button
              onClick={toggleRecording}
              disabled={isPlaying || isComplete}
              className={`w-24 h-24 relative group transition-transform duration-200 ${
                isPlaying || isComplete ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              {/* Outer gradient ring */}
              <div 
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(-42deg, #383838 14%, #454545 85%)',
                  boxShadow: '5px 5px 22px rgba(60, 60, 60, 1)'
                }}
              >
                {/* Inner circle with border */}
                <div 
                  className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(-39deg, #3f3f3f 15%, #262626 85%)'
                  }}
                >
                  <Mic className={`w-6 h-6 transition-all duration-300 ${
                    isRecording ? 'text-red-400' : 'text-white'
                  }`} />
                </div>
              </div>
              
              {/* Recording pulse effect */}
              {isRecording && (
                <>
                  <div className="absolute -inset-2 rounded-full border-2 border-red-400/60 animate-ping" />
                  <div className="absolute -inset-1 rounded-full border border-red-400/40 animate-pulse" />
                </>
              )}
            </button>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorderPage;