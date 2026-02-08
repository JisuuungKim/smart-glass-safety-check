import React from 'react';
import { X, Camera } from 'lucide-react';
import { Worker } from '../types';

interface VideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  videoTitle: string;
  selectedWorker: Worker | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  videoUrl,
  videoTitle,
  selectedWorker,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-zinc-800 rounded-xl border border-zinc-700 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <h3 className="text-xl font-bold text-white">{videoTitle} - 점검 영상</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        {/* 비디오 영역 */}
        <div className="p-6">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <video
              src={videoUrl}
              controls
              autoPlay
              className="absolute top-0 left-0 w-full h-full rounded-lg bg-black"
              onError={(e) => {
                console.error('비디오 로드 실패:', e);
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              브라우저에서 비디오를 지원하지 않습니다.
            </video>
          </div>
          
          {/* 비디오 정보 */}
          <div className="mt-4 p-4 bg-zinc-700/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-4 h-4 text-green-400" />
              <span className="font-medium text-white">점검 영상 정보</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">점검 항목:</span>
                <span className="text-white ml-2">{videoTitle}</span>
              </div>
              <div>
                <span className="text-gray-400">촬영 시간:</span>
                <span className="text-white ml-2">{new Date().toLocaleString('ko-KR')}</span>
              </div>
              <div>
                <span className="text-gray-400">작업자:</span>
                <span className="text-white ml-2">{selectedWorker?.name}</span>
              </div>
              <div>
                <span className="text-gray-400">기계:</span>
                <span className="text-white ml-2">{selectedWorker?.currentMachine?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};