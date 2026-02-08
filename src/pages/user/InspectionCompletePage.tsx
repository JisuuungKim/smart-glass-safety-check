import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMachineStore } from '../../store/machineStore';

export const InspectionCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const { addOrderIdx, isFinished, initOrderIdx } = useMachineStore();

  const goNextStep = () => {
    addOrderIdx();
    if (!isFinished()) {
      navigate('/user/equipment-scan');
    } else {
      initOrderIdx();
      navigate('/user');
    }
  }


  return (
    <div className="min-h-screen bg-zinc-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Check Animation - SmartGlassConnectPage와 동일한 애니메이션 */}
          <div className="relative mb-16" onClick={goNextStep}>
            <style>{`
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
              점검이 완료되었습니다
            </h1>
            <p className="text-sm text-gray-400 leading-5">
              점검 결과가 시스템에 저장되었습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionCompletePage;