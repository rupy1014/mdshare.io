# MDShare Web - Notion-like Markdown Viewer

노션처럼 마크다운을 웹에서 보는 서비스입니다. 확장된 마크다운 기능과 AI 기반 검색을 제공합니다.

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 브라우저에서 확인
- **URL**: http://localhost:3001
- **기능**: 마크다운 문서 뷰어, 검색, 편집

## 🏗️ 주요 기능

### 📝 마크다운 뷰어
- **실시간 렌더링**: 마크다운을 즉시 HTML로 변환
- **확장된 문법**: @csv, @json, @mermaid 다이어그램 지원
- **문법 강조**: 코드 블록 자동 하이라이팅
- **수학 공식**: LaTeX 수식 지원

### 🔍 검색 및 네비게이션
- **전체 텍스트 검색**: 문서 내용 실시간 검색
- **태그 기반 필터링**: 카테고리별 문서 정리
- **목차 자동 생성**: 헤딩 기반 네비게이션

### 🎨 사용자 인터페이스
- **다크/라이트 테마**: 사용자 선호도에 따른 테마 전환
- **반응형 디자인**: 모바일/데스크톱 최적화
- **노션 스타일 UI**: 직관적인 문서 편집 환경

### 🤖 AI 기능
- **자동 태깅**: AI가 문서 내용 분석하여 태그 자동 생성
- **관련 문서 추천**: 유사한 내용의 문서 자동 추천
- **요약 생성**: 긴 문서의 핵심 내용 자동 요약

## 📁 프로젝트 구조

```
mdshare-web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (dashboard)/     # 대시보드 라우트
│   │   ├── (editor)/        # 에디터 라우트
│   │   └── api/             # API 라우트
│   ├── components/          # React 컴포넌트
│   │   ├── editor/          # 에디터 컴포넌트
│   │   ├── viewer/          # 뷰어 컴포넌트
│   │   ├── search/          # 검색 컴포넌트
│   │   └── ui/              # 기본 UI 컴포넌트
│   ├── lib/                 # 유틸리티 및 설정
│   │   ├── markdown/        # 마크다운 처리
│   │   ├── search/          # 검색 로직
│   │   └── ai/              # AI 기능
│   └── types/               # TypeScript 타입
├── public/                  # 정적 파일
└── docs/                    # 문서
```

## 🔧 개발 환경 설정

### 필요 조건
- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 환경 변수
```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 🚀 배포

### Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy .next
```

### Vercel
```bash
npm run build
vercel --prod
```

## 📚 사용법

### 1. 문서 열기
- 대시보드에서 문서 클릭
- URL로 직접 접근: `/doc/[document-id]`

### 2. 문서 편집
- 에디터 모드로 전환
- 실시간 미리보기
- 자동 저장 기능

### 3. 검색하기
- 상단 검색바에서 키워드 입력
- 태그로 필터링
- 고급 검색 옵션

## 🔗 관련 프로젝트

- **mdshare-core**: 핵심 라이브러리
- **mdshare-landing**: 랜딩 페이지
- **data/sample-projects**: 샘플 프로젝트들

## 📞 지원

- **문서**: [MDShare 문서](https://docs.mdshare.app)
- **이슈**: [GitHub Issues](https://github.com/mdshare/mdshare/issues)
- **커뮤니티**: [Discord](https://discord.gg/mdshare)
