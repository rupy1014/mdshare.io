# MDShare Web

MDShare의 웹 인터페이스입니다. AI 기반 마크다운 문서화 플랫폼의 프론트엔드를 제공합니다.

## 🚀 주요 기능

- **AI 기반 검색**: 지능형 문서 검색 및 필터링
- **실시간 챗봇**: 문서 내용 기반 AI 챗봇
- **자동 인덱싱**: 문서 구조 자동 분석 및 인덱싱
- **다크 모드**: 완전한 다크/라이트 테마 지원
- **반응형 디자인**: 모든 디바이스에서 완벽한 사용자 경험
- **Cloudflare Pages 배포**: 빠르고 안정적인 글로벌 배포

## 🛠️ 기술 스택

- **Framework**: Next.js 15.0.0
- **Styling**: Tailwind CSS + Radix UI
- **Language**: TypeScript
- **Deployment**: Cloudflare Pages
- **AI Integration**: OpenAI API
- **Markdown**: Marked.js + React Markdown

## 📦 설치 및 실행

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# Cloudflare Pages 로컬 개발
npm run dev:cf
```

### 환경 변수 설정

```bash
# Cloudflare Pages 환경 변수 설정
./setup-env-vars.sh
```

필요한 환경 변수:
- `OPENAI_API_KEY`: OpenAI API 키 (AI 기능용)
- `NEXT_PUBLIC_APP_URL`: 애플리케이션 URL
- `NEXT_PUBLIC_API_URL`: API URL

## 🚀 배포

### Cloudflare Pages 배포

```bash
# 프로덕션 배포
./deploy.sh production

# 스테이징 배포
./deploy.sh staging

# 개발 환경 배포
./deploy.sh development
```

### 수동 배포

```bash
# 빌드
npm run build:cf

# 배포
npm run deploy:simple
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── docs/              # 문서 페이지
│   ├── projects/          # 프로젝트 페이지
│   ├── search/            # 검색 페이지
│   └── chat/              # 챗봇 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── documentation/    # 문서 관련 컴포넌트
│   ├── search/           # 검색 컴포넌트
│   └── chat/             # 챗봇 컴포넌트
├── lib/                  # 유틸리티 함수
├── types/                # TypeScript 타입 정의
├── utils/                # 헬퍼 함수
├── hooks/                # React 훅
└── styles/               # 스타일 파일
```

## 🎨 UI 컴포넌트

### 기본 컴포넌트
- `Button`: 다양한 변형의 버튼 컴포넌트
- `Badge`: 상태 표시용 배지
- `Card`: 콘텐츠 카드
- `Input`: 입력 필드
- `Dialog`: 모달 다이얼로그

### 레이아웃 컴포넌트
- `Header`: 네비게이션 헤더
- `Footer`: 푸터
- `Sidebar`: 사이드바
- `Layout`: 기본 레이아웃

### 문서 관련 컴포넌트
- `DocumentViewer`: 마크다운 문서 뷰어
- `TableOfContents`: 목차 컴포넌트
- `CodeBlock`: 코드 블록 하이라이터
- `Diagram`: 다이어그램 렌더러

## 🔍 검색 기능

### AI 기반 검색
- 의미 기반 검색
- 자동 완성
- 검색 결과 하이라이팅
- 필터링 및 정렬

### 검색 컴포넌트
- `SearchDialog`: 검색 모달
- `SearchResults`: 검색 결과
- `SearchFilters`: 검색 필터
- `SearchSuggestions`: 검색 제안

## 🤖 AI 챗봇

### 기능
- 문서 내용 기반 답변
- 컨텍스트 인식
- 실시간 대화
- 히스토리 관리

### 컴포넌트
- `ChatInterface`: 챗봇 인터페이스
- `MessageList`: 메시지 목록
- `MessageInput`: 메시지 입력
- `TypingIndicator`: 타이핑 인디케이터

## 🎯 성능 최적화

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 포맷 지원
- 지연 로딩

### 코드 분할
- 동적 import 사용
- 페이지별 코드 분할
- 컴포넌트 지연 로딩

### 캐싱 전략
- Cloudflare 캐싱
- 브라우저 캐싱
- API 응답 캐싱

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 UI
npm run test:e2e:ui
```

## 📊 모니터링

### 성능 모니터링
- Core Web Vitals 추적
- 페이지 로딩 시간
- 사용자 상호작용 메트릭

### 에러 모니터링
- Sentry 통합 (선택사항)
- 에러 로깅
- 사용자 피드백

## 🔧 개발 가이드

### 코드 스타일
- ESLint + Prettier 사용
- TypeScript 엄격 모드
- 컴포넌트 기반 아키텍처

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

## 🚀 배포 환경

### Cloudflare Pages
- **개발**: `mdshare-dev.pages.dev`
- **스테이징**: `mdshare-staging.pages.dev`
- **프로덕션**: `mdshare.pages.dev`

### 빌드 설정
- **Build Command**: `npm run build:cf`
- **Build Output Directory**: `.vercel/output/static`
- **Node.js Version**: 18.x

## 📞 지원 및 문의

- **문서**: [MDShare 문서](https://docs.mdshare.app)
- **이슈**: [GitHub Issues](https://github.com/mdshare/mdshare-web/issues)
- **커뮤니티**: [Discord](https://discord.gg/mdshare)

## 📄 라이선스

MIT License
