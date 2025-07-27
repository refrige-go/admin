# Admin Dashboard

React와 Next.js로 구축된 현대적인 관리자 대시보드입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: ApexCharts
- **Icons**: Lucide React
- **State Management**: React Hooks

## 주요 기능

- 📊 반응형 대시보드
- 📈 인터랙티브 차트 (ApexCharts)
- 🎨 모던한 UI/UX
- 📱 모바일 친화적 디자인
- ⚡ 빠른 성능 (SSR/SSG 지원)

## 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── charts/           # 차트 컴포넌트
│   ├── Dashboard.tsx     # 메인 대시보드
│   ├── Header.tsx        # 헤더 컴포넌트
│   ├── Sidebar.tsx       # 사이드바 컴포넌트
│   ├── Timeline.tsx      # 타임라인 컴포넌트
│   └── TopStrip.tsx      # 상단 스트립 컴포넌트
└── styles/               # 스타일 파일
    └── globals.css       # 전역 스타일
```

## 컴포넌트 설명

### Dashboard
메인 대시보드 컴포넌트로 모든 섹션을 통합합니다.

### Sidebar
네비게이션 사이드바로 모바일에서는 오버레이로 표시됩니다.

### Header
상단 헤더로 검색, 알림, 사용자 프로필을 포함합니다.

### Charts
- **ProfitChart**: 수익과 지출을 보여주는 영역 차트
- **TrafficChart**: 트래픽 분포를 보여주는 도넛 차트
- **EarningChart**: 수익 추이를 보여주는 라인 차트

### Timeline
업coming 스케줄을 타임라인 형태로 표시합니다.

## 스타일링

Tailwind CSS를 사용하여 스타일링하며, 커스텀 컴포넌트 클래스도 정의되어 있습니다:

- `.btn-primary`: 기본 버튼 스타일
- `.btn-secondary`: 보조 버튼 스타일
- `.card`: 카드 컨테이너 스타일

## 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하여 환경 변수를 설정할 수 있습니다:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
```

## 배포

Vercel, Netlify 등 다양한 플랫폼에 배포할 수 있습니다.

```bash
# Vercel 배포
vercel

# Netlify 배포
npm run build
# dist 폴더를 Netlify에 업로드
```

## 라이선스

MIT License

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 