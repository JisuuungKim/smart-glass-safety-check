import React from 'react';
import { CheckCircle, FileText, Download } from 'lucide-react';
import { CompletedMachine } from '../types';

interface ReportDownloadProps {
  completedMachines: CompletedMachine[];
  loadingMachineId: string | null;
  onDownloadReport: (machineId: string, machineName: string) => void;
}

export const ReportDownload: React.FC<ReportDownloadProps> = ({
  completedMachines,
  loadingMachineId,
  onDownloadReport
}) => {
  return (
    <div className="px-6 mt-8">
      <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">완료된 점검 보고서</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FileText className="w-4 h-4" />
            <span>{completedMachines.length}개 완료</span>
          </div>
        </div>

        {completedMachines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedMachines.map((machine) => (
              <div
                key={machine.id}
                className="bg-zinc-700/30 rounded-lg border border-zinc-600 p-4 hover:bg-zinc-700/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{machine.name}</h3>
                    <p className="text-sm text-gray-300 mb-1">{machine.type} | {machine.line}</p>
                    <p className="text-xs text-gray-400">작업자: {machine.workerName}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    <span>완료</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>완료일: {machine.completedDate}</span>
                  <span>완료시간: {machine.completedTime}</span>
                </div>

                <button
                  onClick={() => onDownloadReport(machine.id, `압축기-A00${machine.id}`)}
                  disabled={loadingMachineId === machine.id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-400 rounded-lg border border-purple-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMachineId === machine.id ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                      <span className="text-sm">생성 중...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span className="text-sm">보고서 다운로드</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300">완료된 점검이 없습니다</p>
            <p className="text-sm text-gray-400 mt-1">점검이 완료되면 여기에서 보고서를 다운로드할 수 있습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};