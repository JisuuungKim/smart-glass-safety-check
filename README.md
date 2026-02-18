# Smart Glass Safety Check (Frontend)

스마트글래스 기반 공장 **안전/설비 점검 PoC** 프론트엔드입니다.

- 작업자(User) 모드: 공장 선택 → 스마트글래스 연동 → 설비 스캔 → TTS 안내 + 음성 답변 녹음(STT 업로드) → 점검 완료
- 관리자(Admin) 모드: 작업자/설비 점검 현황 모니터링, 완료 설비 리포트 생성 및 다운로드

---

## 주요 기능

### ✅ 작업자(User) 점검 플로우
- **공장 선택 UI** 
- **스마트글래스 연동 화면**
- **설비 탐지/스캔 화면** 
- **음성 점검 모드(핵심)**
  - 점검 시작 시: OpenAI TTS API를 직접 호출하여 안내 멘트 재생
  - 점검 항목 안내: 백엔드 TTS 응답(`voices[].voice_url`)을 순차 재생
  - 사용자 답변: 브라우저 `MediaRecorder`로 녹음 → 백엔드 `/api/stt` 업로드
  - 업로드 성공 시: `/api/checklists/machine/item` 호출로 해당 체크리스트 항목 `done=true` 업데이트
- **점검 완료 화면**
  - 다음 설비로 진행 또는 초기 화면으로 복귀(로컬 상태 기반)

### ✅ 관리자(Admin) 대시보드
- 작업자별 상태(작업중/휴게/오프라인), 스마트글래스 연결 여부
- 작업자 선택 시 설비 진행률/체크리스트 상세 표시
- 체크리스트 항목에 영상이 있는 경우(샘플): 모달로 영상 재생
- 완료된 설비에 대해 점검 리포트 생성/다운로드
   
---

## 기술 스택

- React 18 + TypeScript
- Vite (dev server 기본 포트: 3000)
- Tailwind CSS
- Routing: `react-router-dom`
- Data fetching/state:
  - `@tanstack/react-query`
  - `zustand`
- HTTP: `axios`
- Markdown: `markdown-it`
- Icons: `lucide-react`

---

## 실행 화면 라우트

### User
- `/user` : 공장 선택
- `/user/smart-glass-connect` : 스마트글래스 연동
- `/user/equipment-scan` : 점검 대상 설비 스캔(시뮬레이션)
- `/user/voice-recorder?machine_id=1` : 음성 점검
- `/user/voice-recorder/complete` : 점검 완료

### Admin
- `/admin` : 관리자 대시보드

---

## 사전 요구사항

- Node.js 18+ 권장
- npm(또는 yarn/pnpm)
- 백엔드 서버 실행(필수)
  - 기본 주소: `http://localhost:8000`

---

## 설치 및 실행

```bash
# 0) 저장소 클론
git clone https://github.com/skala-1112-1/smart-glass-safety-check.git
cd smart-glass-safety-check
```



```bash
# 1) 의존성 설치
npm install

# 2) 개발 서버 실행 (Vite)
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend Swagger (예): `http://localhost:8000/docs`

---

## 환경 변수(.env)

이 프로젝트는 PoC 단계로 **브라우저에서 OpenAI TTS를 직접 호출**하는 코드가 포함되어 있습니다.

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정하세요.

```bash
# (PoC) 브라우저에서 OpenAI TTS 호출에 사용
VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

### ⚠️ 보안 주의
- `VITE_` 로 시작하는 환경변수는 **빌드 결과물에 포함되어 브라우저에 노출**됩니다.
- 운영 환경에서는 **절대** OpenAI API Key를 프론트에 넣지 마세요.
- 권장 구조: **백엔드에 TTS 프록시 엔드포인트**를 두고, 프론트는 백엔드를 호출하도록 변경

---

## 백엔드 연동(현재 프론트가 호출하는 API)

프론트에서 사용하는 엔드포인트는 다음과 같습니다. (코드 기준)

### 체크리스트
- `GET /api/checklists/machine?machine_id={id}`
  - 설비/기계별 체크리스트 조회

- `PUT /api/checklists/machine/item?machine_id={id}&item_index={index}`
  - Body(JSON): `{ "done": true }`
  - 특정 체크리스트 항목 완료 처리

### TTS (점검 항목 음성 안내)
- `GET /api/tts/machine?machine_id={id}`
  - 프론트는 응답에서 다음 형태를 기대합니다.

```json
{
  "voices": [
    {
      "voice_url": "http://localhost:8000/static/tts/...mp3"
    }
  ]
}
```

### STT (사용자 음성 답변 업로드)
- `POST /api/stt`
  - Content-Type: `multipart/form-data`
  - FormData:
    - `machine_id`: string
    - `index`: string(number)
    - `audio_file`: File

### 리포트 생성
- `POST /api/reports/generate`
  - Body(JSON): `{ "machine_id": "A-001" }` 또는 `{ "machine_id": "1" }` (백엔드 구현에 따라)
  - 프론트는 가능하면 `report_md`(Markdown) 필드를 기대합니다.

---

## 프로젝트 구조

```
smart-glass-safety-check/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components/
    │   ├── common/
    │   │   ├── ActivationMode.tsx
    │   │   └── index.ts
    │   ├── admin/
    │   └── user/
    ├── hooks/
    │   ├── useChecklist.ts
    │   ├── useSTTMutation.ts
    │   ├── useReport.ts
    │   ├── useOpenAITTS.ts
    │   └── index.ts
    ├── layouts/
    │   ├── AdminLayout.tsx
    │   ├── UserLayout.tsx
    │   └── index.ts
    ├── pages/
    │   ├── admin/
    │   │   ├── DashboardPage.tsx
    │   │   ├── types.ts
    │   │   └── components/
    │   └── user/
    │       ├── SelectFactoryPage.tsx
    │       ├── SmartGlassConnectPage.tsx
    │       ├── EquipmentScanPage.tsx
    │       ├── VoiceRecorderPage.tsx
    │       └── InspectionCompletePage.tsx
    ├── services/
    │   ├── api.ts
    │   ├── checklistService.ts
    │   ├── sttService.ts
    │   ├── reportService.ts
    │   └── index.ts
    ├── store/
    │   ├── machineStore.ts
    │   └── index.ts
    └── types/
        └── index.ts
```

---

## 트러블슈팅

### 1) 마이크 권한 오류
- 브라우저에서 마이크 권한을 허용해야 합니다.
- HTTPS가 아닌 환경에서는 일부 브라우저에서 권한 동작이 제한될 수 있습니다.

### 2) STT 업로드 실패(오디오 포맷)
현재 구현은 `MediaRecorder`로 수집한 Blob에 대해 `type: 'audio/mp3'`로 지정하지만,
실제 녹음 컨테이너는 브라우저에 따라 `webm/ogg`일 수 있습니다.

- 증상: 백엔드에서 디코딩 실패 / Whisper 처리 오류
- 해결:
  - 백엔드에서 ffmpeg로 입력 포맷을 강제 변환
  - 또는 프론트에서 `MediaRecorder` 생성 시 `mimeType`을 명시하고, Blob 타입/확장자도 일치시키기

### 3) 리포트 다운로드는 파일 저장이 아니라 인쇄입니다
- 현재는 Markdown → HTML 변환 후 새 창을 열어 `window.print()` 를 호출합니다.
- 사용자는 브라우저 인쇄창에서 **PDF로 저장**을 선택해야 합니다.

