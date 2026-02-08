import React from 'react';
import { Users, Activity, CheckCircle, Clock } from 'lucide-react';

interface StatsOverviewProps {
  totalMachines: number;
  completedMachines: number;
  inProgressMachines: number;
  pendingMachines: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalMachines,
  completedMachines,
  inProgressMachines,
  pendingMachines
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 px-6">
      <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">총 점검 대상</p>
            <p className="text-3xl font-bold text-white">{totalMachines}대</p>
          </div>
          <div className="p-3 bg-purple-400/20 rounded-full">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">완료</p>
            <p className="text-3xl font-bold text-green-400">{completedMachines}대</p>
            <p className="text-sm text-gray-400">{Math.round((completedMachines/totalMachines)*100)}%</p>
          </div>
          <div className="p-3 bg-green-400/20 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">진행중</p>
            <p className="text-3xl font-bold text-yellow-400">{inProgressMachines}대</p>
            <p className="text-sm text-gray-400">{Math.round((inProgressMachines/totalMachines)*100)}%</p>
          </div>
          <div className="p-3 bg-yellow-400/20 rounded-full">
            <Activity className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">미시작</p>
            <p className="text-3xl font-bold text-red-400">{pendingMachines}대</p>
            <p className="text-sm text-gray-400">{Math.round((pendingMachines/totalMachines)*100)}%</p>
          </div>
          <div className="p-3 bg-red-400/20 rounded-full">
            <Clock className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
};