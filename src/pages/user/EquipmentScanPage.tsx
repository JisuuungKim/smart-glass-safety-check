import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachineStore } from '../../store/machineStore';

const EquipmentScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { order_idx, machine_order } = useMachineStore();

  // 시뮬레이션: 4초 후 점검 모드 활성화
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/user/voice-recorder?machine_id=${machine_order[order_idx]}`);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div/>
      <div/>
      
      <div className="flex flex-col h-screen max-w-sm mx-auto px-6 py-3">
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            {/* Laser Detection Animation */}
            <div className="relative mb-16">
              <style>{`
                @keyframes radarSweep {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
                @keyframes radarPing {
                  0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                  }
                  50% {
                    opacity: 0.3;
                    transform: scale(1.1);
                  }
                }
                .radar-sweep {
                  animation: radarSweep 2s linear infinite;
                }
                .radar-ping {
                  animation: radarPing 1s ease-in-out infinite;
                }
                .laser-beam {
                  background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
                  animation: laserMove 1.5s ease-in-out infinite;
                }
                @keyframes laserMove {
                  0%, 100% {
                    transform: translateX(-100%);
                    opacity: 0;
                  }
                  50% {
                    transform: translateX(0);
                    opacity: 1;
                  }
                }
              `}</style>
              
              <div className="w-64 h-64 flex items-center justify-center relative">
                {/* Radar circles */}
                <div className="absolute w-64 h-64 border border-[#5B578A] rounded-full opacity-30"></div>
                <div className="absolute w-48 h-48 border border-[#5B578A] rounded-full opacity-50"></div>
                <div className="absolute w-32 h-32 border border-[#5B578A] rounded-full opacity-70"></div>
                <div className="absolute w-16 h-16 border border-[#5B578A] rounded-full"></div>
                
                {/* Rotating sweep line */}
                <div className="absolute w-full h-full radar-sweep">
                  <div className="absolute top-1/2 left-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#5B578A] to-transparent transform -translate-y-1/2 origin-left"></div>
                </div>
                
                {/* Center dot */}
                <div className="w-4 h-4 bg-[#5B578A] rounded-full radar-ping"></div>
              </div>
            </div>

            {/* Scanning Text */}
            <div className="text-center space-y-2 max-w-xs">
              <h1 className="text-xl font-medium text-white leading-7">
                현재 위치에서 점검 대상 설비를 검색 중입니다
              </h1>
              <p className="text-sm text-gray-400 leading-5">
                AR 센서로 주변 설비를 탐지하고 있습니다...
              </p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default EquipmentScanPage;