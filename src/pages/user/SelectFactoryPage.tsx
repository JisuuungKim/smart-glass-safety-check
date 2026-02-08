import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VoiceItem {
  id: string;
  name: string;
  category: string;
  language: string;
}

const SelectFactoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // 더미 음성 데이터
  const voices: VoiceItem[] = [
    {
      id: '1',
      name: '공장A',
      category: '생산1 | 개발라인',
      language: 'Chinese'
    },
    {
      id: '2',
      name: '공장A',
      category: '생산1 | 개발라인',
      language: 'Chinese'
    },
    {
      id: '3',
      name: '공장B',
      category: '생산2 | 메인라인',
      language: 'Chinese'
    }
  ];

  const filteredVoices = voices.filter(voice =>
    voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voice.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voice.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVoiceSelect = (voice: VoiceItem) => {
    console.log('Selected voice:', voice);
    // 스마트 글래스 연결 페이지로 이동
    navigate('/user/smart-glass-connect');
  };

  const handleBack = () => {
    navigate(-1);
  };

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

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-medium text-center flex-1">
            공장 선택
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <div className="bg-zinc-800 rounded-xl px-4 py-3 flex items-center gap-2">
            <Search size={24} className="text-white shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-400 outline-none"
              placeholder="점검할 공장을 검색하세요"
            />
          </div>
        </div>

        {/* Voice Cards */}
        <div className="flex-1 space-y-3">
          {filteredVoices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => handleVoiceSelect(voice)}
              className="w-full bg-zinc-800 rounded-xl p-4 text-left active:bg-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <h3 className="text-white font-medium text-xs mb-1">
                    {voice.name}
                  </h3>
                  <p className="text-zinc-400 text-[10px]">
                    {voice.category}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty space at bottom */}
        <div className="h-18" />
      </div>
    </div>
  );
};

export default SelectFactoryPage;