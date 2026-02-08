import React from 'react';
import { CheckCircle, Clock, Users, Mic, MicOff, Camera } from 'lucide-react';
import { Worker } from '../types';

interface InspectionProgressProps {
  selectedWorker: Worker | null;
  onVideoClick: (videoUrl: string, itemDescription: string) => void;
}

export const InspectionProgress: React.FC<InspectionProgressProps> = ({
  selectedWorker,
  onVideoClick
}) => {
  return (
    <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">점검 세부 진행률</h2>
      
      {selectedWorker ? (
        <div>
          <div className="mb-6 p-4 bg-zinc-700/50 rounded-lg">
            <h3 className="font-semibold text-white mb-1">{selectedWorker.name}</h3>
            <p className="text-sm text-gray-300">현재 작업 현황</p>
          </div>

          {selectedWorker.currentMachine ? (
            <div>
              <div className="mb-4 p-4 bg-purple-400/10 rounded-lg border border-purple-400/30">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{selectedWorker.currentMachine.name}</h4>
                  <span className="px-2 py-1 bg-purple-400/20 text-purple-300 text-xs rounded-full">
                    {selectedWorker.currentMachine.line}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-3">{selectedWorker.currentMachine.type}</p>
                
                <div className="w-full bg-zinc-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-purple-400 h-3 rounded-full transition-all"
                    style={{ width: `${selectedWorker.currentMachine.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{selectedWorker.currentMachine.progress}% 완료</span>
                  <span className="text-purple-400">예상 완료: {selectedWorker.currentMachine.estimatedCompletion}</span>
                </div>
              </div>

              {/* 체크리스트 */}
              <div className="space-y-2">
                <h5 className="font-medium text-white mb-3">점검 체크리스트</h5>
                {selectedWorker.currentMachine.checklist.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      item.completed 
                        ? 'bg-green-400/10 border-green-400/30' 
                        : 'bg-zinc-700/30 border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-400' : 'bg-zinc-600'
                      }`}>
                        {item.completed && <CheckCircle className="w-4 h-4 text-white" />}
                        {!item.completed && <span className="text-xs font-medium text-gray-300">{index + 1}</span>}
                      </div>
                      <div>
                        <span className={`font-medium ${item.completed ? 'text-green-400' : 'text-gray-200'}`}>
                          {item.description}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.hasAudio ? (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded-full">
                          <Mic className="w-3 h-3" />
                          <span>음성</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-600/50 text-gray-400 text-xs rounded-full">
                          <MicOff className="w-3 h-3" />
                          <span>대기</span>
                        </div>
                      )}
                      {item.hasVideo ? (
                        <button
                          onClick={() => onVideoClick("http://localhost:8000/static/det/result_0bda8f9c37aa4208a1541dea582d0dc6.mp4", item.description)}
                          className="flex items-center gap-1 px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded-full hover:bg-green-400/30 transition-colors"
                        >
                          <Camera className="w-3 h-3" />
                          <span>영상</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-600/50 text-gray-400 text-xs rounded-full">
                          <Camera className="w-3 h-3 opacity-50" />
                          <span>없음</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-300">현재 작업 중인 기계가 없습니다</p>
              <p className="text-sm text-gray-400 mt-1">
                완료한 기계: {selectedWorker.completedMachines.length}대
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-300">작업자를 선택하세요</p>
          <p className="text-sm text-gray-400 mt-1">좌측에서 작업자를 클릭하면 세부 진행률을 확인할 수 있습니다</p>
        </div>
      )}
    </div>
  );
};