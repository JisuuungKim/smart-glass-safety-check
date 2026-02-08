import React, { useState, useEffect } from 'react';
import { useGenerateReport } from '@/hooks';
import MarkdownIt from 'markdown-it';
import { Worker, CompletedMachine } from './types';
import { 
  StatsOverview, 
  WorkerTracking, 
  InspectionProgress, 
  ReportDownload, 
  VideoModal 
} from './components';

// 더미 데이터
const mockWorkers: Worker[] = [
  {
    id: '1',
    name: '김철수',
    status: 'active',
    currentMachine: {
      id: 'A-002',
      name: '압축기 A-002',
      type: '압축기',
      line: '생산1라인',
      status: 'in-progress',
      progress: 60,
      estimatedCompletion: '10분',
      checklist: [
        { id: 1, description: '외관 점검', completed: true, hasAudio: true, hasVideo: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', timestamp: '09:15' },
        { id: 2, description: '압력 게이지 확인', completed: true, hasAudio: true, hasVideo: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', timestamp: '09:18' },
        { id: 3, description: '오일 레벨 점검', completed: false, hasAudio: false, hasVideo: false },
        { id: 4, description: '안전밸브 작동 확인', completed: false, hasAudio: false, hasVideo: false },
        { id: 5, description: '누출 점검', completed: false, hasAudio: false, hasVideo: false },
      ]
    },
    completedMachines: ['A-001'],
    totalAssigned: 6,
    glassConnected: true,
    batteryLevel: 75,
    lastActivity: '방금 전'
  },
  {
    id: '2',
    name: '박영희',
    status: 'break',
    completedMachines: ['A-003', 'A-004', 'A-005'],
    totalAssigned: 5,
    glassConnected: false,
    batteryLevel: 45,
    lastActivity: '15분 전'
  },
  {
    id: '3',
    name: '이민수',
    status: 'active',
    currentMachine: {
      id: 'B-001',
      name: '보일러 B-001',
      type: '보일러',
      line: '생산2라인',
      status: 'in-progress',
      progress: 20,
      estimatedCompletion: '25분',
      checklist: [
        { id: 1, description: '연료 공급 확인', completed: true, hasAudio: true, hasVideo: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', timestamp: '09:30' },
        { id: 2, description: '압력 점검', completed: false, hasAudio: false, hasVideo: false },
        { id: 3, description: '온도 측정', completed: false, hasAudio: false, hasVideo: false },
        { id: 4, description: '안전장치 점검', completed: false, hasAudio: false, hasVideo: false },
        { id: 5, description: '배관 누출 확인', completed: false, hasAudio: false, hasVideo: false },
      ]
    },
    completedMachines: ['B-002', 'B-003'],
    totalAssigned: 4,
    glassConnected: true,
    batteryLevel: 90,
    lastActivity: '방금 전'
  }
];

const DashboardPage: React.FC = () => {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [loadingMachineId, setLoadingMachineId] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');
  const generateReportMutation = useGenerateReport();

  // 전체 통계 계산
  const totalMachines = mockWorkers.reduce((sum, worker) => sum + worker.totalAssigned, 0);
  const completedMachines = mockWorkers.reduce((sum, worker) => sum + worker.completedMachines.length, 0);
  const inProgressMachines = mockWorkers.filter(w => w.currentMachine).length;
  const pendingMachines = totalMachines - completedMachines - inProgressMachines;

  // 완료된 기계들 목록 생성
  const completedMachinesList: CompletedMachine[] = mockWorkers.flatMap(worker => 
    worker.completedMachines.map(machineId => ({
      id: machineId,
      name: `압축기 ${machineId}`,
      type: machineId.startsWith('A') ? '압축기' : '보일러',
      line: machineId.startsWith('A') ? '생산1라인' : '생산2라인',
      workerName: worker.name,
      completedTime: '09:45', // 임시 데이터
      completedDate: '2026-02-09'
    }))
  );

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVideoModalOpen) {
        closeVideoModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen]);

  // 마크다운을 PDF로 변환하는 함수
  const convertMarkdownToPdf = (markdown: string, filename: string) => {
    const md = new MarkdownIt();
    const htmlContent = md.render(markdown);
    
    // PDF 스타일을 포함한 완전한 HTML 문서 생성
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${filename}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
          }
          h1 { border-bottom: 2px solid #3498db; padding-bottom: 10px; }
          h2 { border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Consolas', 'Monaco', monospace;
          }
          pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
          }
          blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding-left: 15px;
            color: #666;
          }
          @media print {
            body { margin: 0; }
            * { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
    
    // 새 창에서 열고 인쇄 대화상자 표시
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(fullHtml);
      printWindow.document.close();
      
      // 내용 로드 완료 후 인쇄 대화상자 표시
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    }
  };

  // 보고서 다운로드 핸들러
  const handleDownloadReport = async (machineId: string, machineName: string) => {
    try {
      setLoadingMachineId(machineId); // 로딩 시작
      const result = await generateReportMutation.mutateAsync(machineId);
      
      // 서버에서 반환된 마크다운 보고서를 PDF로 변환
      if (result && result.report_md) {
        convertMarkdownToPdf(
          result.report_md, 
          `공장${machineName}_점검보고서_${new Date().toISOString().split('T')[0]}`
        );
        console.log(`${machineName} 보고서 PDF 생성 완료`);
      } else {
        console.warn(`${machineName} 보고서 데이터가 없습니다.`);
        // 테스트용 더미 마크다운 (실제 서버 응답이 없을 경우)
        const dummyMarkdown = `
# ${machineName} 점검 보고서

## 기본 정보
- **기계 ID**: 압축기 A-00${machineId}
- **점검 날짜**: ${new Date().toLocaleDateString('ko-KR')}
- **점검 시간**: ${new Date().toLocaleTimeString('ko-KR')}

## 점검 결과 요약
| 항목 | 상태 | 비고 |
|------|------|------|
| 외관 점검 | ✅ 정상 | 특이사항 없음 |
| 압력 게이지 | ✅ 정상 | 정상 범위 내 |
| 오일 레벨 | ✅ 정상 | 적정 수준 유지 |
| 안전밸브 | ✅ 정상 | 작동 확인됨 |
| 누출 점검 | ✅ 정상 | 누출 없음 |

## 상세 점검 내용

### 1. 외관 점검
- 외부 손상 여부: 없음
- 부식 상태: 양호
- 경고 라벨 상태: 정상

### 2. 성능 점검
- 압력: 정상 범위
- 온도: 적정 수준
- 진동: 정상

## 권장 사항
- 정기 점검 주기 준수
- 오일 교환 예정일: 다음 달

## 점검자 정보
- 점검자: 작업자명
- 서명: ________________
        `;
        convertMarkdownToPdf(dummyMarkdown, `${machineName}_점검보고서_${new Date().toISOString().split('T')[0]}`);
      }
    } catch (error) {
      console.error(`${machineName} 보고서 다운로드 실패:`, error);
    } finally {
      setLoadingMachineId(null); // 로딩 종료
    }
  };

  // 비디오 모달 핸들러 및 기타 유틸리티 함수들
  const handleVideoClick = (videoUrl: string, itemDescription: string) => {
    setSelectedVideoUrl(videoUrl);
    setSelectedVideoTitle(itemDescription);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideoUrl('');
    setSelectedVideoTitle('');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white relative overflow-hidden pt-12">
      {/* 오늘의 점검 현황 */}
      <StatsOverview 
        totalMachines={totalMachines}
        completedMachines={completedMachines}
        inProgressMachines={inProgressMachines}
        pendingMachines={pendingMachines}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6">
        {/* 작업자별 실시간 추적 */}
        <WorkerTracking 
          workers={mockWorkers}
          selectedWorker={selectedWorker}
          onWorkerSelect={setSelectedWorker}
        />

        {/* 점검 세부 진행률 */}
        <InspectionProgress 
          selectedWorker={selectedWorker}
          onVideoClick={handleVideoClick}
        />
      </div>

      {/* 완료된 점검 보고서 다운로드 */}
      <ReportDownload 
        completedMachines={completedMachinesList}
        loadingMachineId={loadingMachineId}
        onDownloadReport={handleDownloadReport}
      />

      {/* 비디오 모달 */}
      <VideoModal 
        isOpen={isVideoModalOpen}
        videoUrl={selectedVideoUrl}
        videoTitle={selectedVideoTitle}
        selectedWorker={selectedWorker}
        onClose={closeVideoModal}
      />
    </div>
  );
};

export default DashboardPage;