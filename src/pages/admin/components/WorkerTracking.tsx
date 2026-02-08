import React from 'react';
import { Activity, Clock, AlertCircle, Users, Wifi, Battery } from 'lucide-react';
import { Worker } from '../types';

interface WorkerTrackingProps {
  workers: Worker[];
  selectedWorker: Worker | null;
  onWorkerSelect: (worker: Worker) => void;
}

export const WorkerTracking: React.FC<WorkerTrackingProps> = ({
  workers,
  selectedWorker,
  onWorkerSelect
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'break': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'offline': return 'bg-red-400/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />;
      case 'break': return <Clock className="w-4 h-4" />;
      case 'offline': return <AlertCircle className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">작업자별 실시간 추적</h2>
      
      <div className="space-y-4">
        {workers.map((worker) => (
          <div
            key={worker.id}
            onClick={() => onWorkerSelect(worker)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedWorker?.id === worker.id 
                ? 'border-purple-400 bg-purple-400/10' 
                : 'border-zinc-600 bg-zinc-700/30 hover:border-zinc-500'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-600 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-white">{worker.name[0]}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{worker.name}</h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(worker.status)}`}>
                    {getStatusIcon(worker.status)}
                    {worker.status === 'active' ? '작업중' : worker.status === 'break' ? '휴게중' : '비활성'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  {worker.glassConnected ? <Wifi className="w-4 h-4 text-green-400" /> : <Wifi className="w-4 h-4 text-gray-500" />}
                </div>
                <div className="flex items-center gap-1">
                  <Battery className="w-4 h-4" />
                  <span>{worker.batteryLevel}%</span>
                </div>
              </div>
            </div>

            {worker.currentMachine && (
              <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-600 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{worker.currentMachine.name}</span>
                  <span className="text-sm text-purple-400">{worker.currentMachine.estimatedCompletion} 남음</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full transition-all"
                    style={{ width: `${worker.currentMachine.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-300 mt-1">{worker.currentMachine.progress}% 완료</div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">
                완료: {worker.completedMachines.length}/{worker.totalAssigned}대
              </span>
              <span className="text-gray-400">최근 활동: {worker.lastActivity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};