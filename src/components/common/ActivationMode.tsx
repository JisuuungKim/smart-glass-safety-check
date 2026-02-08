import React from 'react';

interface ActivationModeProps {
  onActivate?: () => void;
  text: string;
}

const ActivationMode: React.FC<ActivationModeProps> = ({ onActivate, text }) => {
  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center px-4"
    >
      {/* Activation Animation */}
      <div className="relative mb-16">
        <style>{`
          @keyframes energyFill {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
          @keyframes energyPulse {
            0%, 100% {
              box-shadow: 0 0 10px rgba(160, 153, 255, 0.3), inset 0 0 10px rgba(160, 153, 255, 0.2);
            }
            50% {
              box-shadow: 0 0 20px rgba(160, 153, 255, 0.6), inset 0 0 20px rgba(160, 153, 255, 0.4);
            }
          }
          @keyframes energySparkle {
            0%, 100% {
              opacity: 0;
              transform: translateX(-10px) scale(0);
            }
            50% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          @keyframes energyWave {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(300%);
            }
          }
          .energy-bar {
            animation: energyFill 2.5s ease-out infinite;
          }
          .energy-glow {
            animation: energyPulse 1.5s ease-in-out infinite;
          }
          .energy-sparkle {
            animation: energySparkle 0.8s ease-out infinite;
          }
          .energy-wave {
            animation: energyWave 2s linear infinite;
          }
        `}</style>
        
        <div className="w-80 h-32 flex items-center justify-center relative" onClick={onActivate}>
          {/* Main Energy Bar Container */}
          <div className="w-72 h-6 bg-zinc-800 rounded-full border-2 border-[#FFFFFF] relative overflow-hidden energy-glow">
            
            {/* Energy Fill Bar */}
            <div className="h-full bg-gradient-to-r from-[#A099FF] via-[#FFFFFF] to-[#A099FF] rounded-full energy-bar relative">
              
              {/* Energy Wave Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFFFF] to-transparent opacity-60 energy-wave" style={{ width: '30%' }}></div>
              
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#A099FF] to-[#FFFFFF] rounded-full opacity-40"></div>
            </div>
            
            {/* Energy Segments */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-0.5 absolute top-1/2 transform -translate-y-1/2"></div>
              <div className="w-0.5 h-full absolute left-1/4"></div>
              <div className="w-0.5 h-full absolute left-2/4"></div>
              <div className="w-0.5 h-full absolute left-3/4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Activation Text */}
      <div className="text-center space-y-3 max-w-sm">
        <h1 className="text-xl font-medium text-white leading-7">
          {text}
        </h1>
        <p className="text-sm text-gray-400 leading-5">
          음성 안내에 따라 답변을 진행해 주세요
        </p>
        
        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-[#A099FF] rounded-full animate-pulse"></div>
          <span className="text-xs text-[#A099FF] font-medium">점검 모드 활성화 중...</span>
        </div>
      </div>
    </div>
  );
};

export default ActivationMode;