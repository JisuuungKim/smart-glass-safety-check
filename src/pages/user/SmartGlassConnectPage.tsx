import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SmartGlassConnectPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // 3초 후 연동 완료 상태로 변경
    const timer = setTimeout(() => {
      setIsCompleted(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleStartInspection = () => {
    // 장비 스캔 페이지로 이동
    navigate('/user/equipment-scan');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="flex flex-col h-screen mx-auto px-3 py-3">
        {/* Header */}
        <div className="flex items-center pt-3">
          <button
            onClick={handleBack}
            className="p-3 bg-zinc-800 rounded-xl active:bg-zinc-700"
          >
            <ArrowLeft size={16} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          
          {!isCompleted ? (
            // Loading State
            <>
              {/* Loading Animation - Ripple Effect */}
              <div className="relative mb-16">
                <style jsx>{`
                  @keyframes ripple {
                    0% {
                      transform: scale(0);
                      opacity: 1;
                    }
                    100% {
                      transform: scale(4);
                      opacity: 0;
                    }
                  }
                  .ripple-1 {
                    animation: ripple 2s ease-out infinite;
                  }
                  .ripple-2 {
                    animation: ripple 2s ease-out infinite 0.5s;
                  }
                  .ripple-3 {
                    animation: ripple 2s ease-out infinite 1s;
                  }
                  .ripple-4 {
                    animation: ripple 2s ease-out infinite 1.5s;
                  }
                `}</style>
                <div className="w-64 h-64 flex items-center justify-center relative">
                  {/* Ripple waves */}
                  <div className="absolute w-20 h-20 border-2 border-[#A099FF] rounded-full ripple-1"></div>
                  <div className="absolute w-20 h-20 border-2 border-[#A099FF] rounded-full ripple-2"></div>
                  <div className="absolute w-20 h-20 border-2 border-[#A099FF] rounded-full ripple-3"></div>
                  <div className="absolute w-20 h-20 border-2 border-[#A099FF] rounded-full ripple-4"></div>
                  
                  {/* Center circle */}
                  <div className="w-20 h-20 bg-[#A099FF] rounded-full flex items-center justify-center relative z-10 animate-pulse">
                    <div className="w-12 h-12 bg-zinc-900 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-2 max-w-xs">
                <h1 className="text-xl font-medium text-white leading-7">
                  스마트 글래스를 연동중입니다
                </h1>
                <p className="text-sm text-gray-400 leading-5">
                  스마트 글래스 인터페이스 최적화 중...
                </p>
              </div>
            </>
          ) : (
            // Completed State
            <>
              {/* Check Animation */}
              <div className="relative mb-16">
                <style jsx>{`
                  @keyframes checkScale {
                    0% {
                      transform: scale(0);
                    }
                    50% {
                      transform: scale(1.1);
                    }
                    100% {
                      transform: scale(1);
                    }
                  }
                  @keyframes checkDraw {
                    0% {
                      stroke-dasharray: 0 50;
                    }
                    100% {
                      stroke-dasharray: 50 50;
                    }
                  }
                  .check-circle {
                    animation: checkScale 0.5s ease-out;
                  }
                  .check-icon {
                    animation: checkDraw 0.5s ease-out 0.2s both;
                  }
                `}</style>
                <div className="w-32 h-32 border border-white rounded-full flex items-center justify-center check-circle">
                  <Check size={48} className="text-white check-icon" strokeWidth={3} />
                </div>
              </div>

              {/* Success Text */}
              <div className="text-center space-y-2 max-w-xs mb-12">
                <h1 className="text-xl font-medium text-white leading-7">
                  연동이 완료되었습니다.
                </h1>
                <p className="text-sm text-gray-400 leading-5">
                  점검을 시작해주세요.
                </p>
              </div>

              {/* Start Inspection Button */}
              <button
                onClick={handleStartInspection}
                className="w-full max-w-sm bg-[#A099FF] rounded-xl px-4 py-3 flex items-center justify-center gap-5 shadow-lg transition-colors"
              >
                <div className="w-6 h-6"></div>
                <span className="text-zinc-900 font-medium text-base tracking-tight">
                  점검 시작
                </span>
                <div className="w-6 h-6"></div>
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default SmartGlassConnectPage;