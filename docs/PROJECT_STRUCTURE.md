# MDShare 프로젝트 구조

## 📁 전체 구조

```
study/
├── README.md                    # 프로젝트 메인 README
├── docs/                        # 프로젝트 문서
│   ├── PROJECT_STRUCTURE.md    # 이 파일
│   ├── PROJECT_SUMMARY.md      # 프로젝트 요약
│   ├── DEVELOPMENT_PRIORITIES.md # 개발 우선순위
│   └── project-overview.md     # 프로젝트 개요
│
├── study/                       # 학습 관련 파일들
│   ├── lectures/               # 강의 자료
│   │   └── week1/             # 1주차 강의
│   │       ├── lecture-guide.md # 강의 가이드
│   │       ├── persona/       # 페르소나 문서
│   │       └── qna/           # Q&A 문서
│   ├── week1.md               # 1주차 학습 내용
│   ├── week2.md               # 2주차 학습 내용
│   ├── week3.md               # 3주차 학습 내용
│   └── week4.md               # 4주차 학습 내용
│
├── services/                    # MDShare 서비스 관련
│   ├── mdshare-core/          # 핵심 라이브러리
│   │   ├── src/               # TypeScript 소스 코드
│   │   │   ├── parser/        # 마크다운 파서
│   │   │   ├── metadata/      # 메타데이터 관리
│   │   │   ├── core/          # 핵심 엔진
│   │   │   ├── types/         # 타입 정의
│   │   │   └── index.ts       # 메인 진입점
│   │   ├── examples/          # 사용 예제
│   │   ├── dist/              # 빌드된 라이브러리
│   │   └── test-project/      # 테스트 프로젝트
│   │
│   ├── mdshare-landing/       # 랜딩 페이지 (마케팅)
│   │   ├── src/               # Next.js 소스 코드
│   │   │   ├── app/           # App Router
│   │   │   ├── components/    # React 컴포넌트
│   │   │   ├── lib/           # 유틸리티
│   │   │   └── styles/        # 스타일
│   │   ├── public/            # 정적 파일
│   │   └── deploy.sh          # 배포 스크립트
│   │
│   ├── mdshare-web/           # 마크다운 뷰어 (노션 스타일)
│   │   ├── src/               # Next.js 소스 코드
│   │   │   ├── app/           # App Router
│   │   │   │   ├── (dashboard)/ # 대시보드 라우트
│   │   │   │   ├── (editor)/    # 에디터 라우트
│   │   │   │   └── api/         # API 라우트
│   │   │   ├── components/    # React 컴포넌트
│   │   │   │   ├── editor/     # 에디터 컴포넌트
│   │   │   │   ├── viewer/     # 뷰어 컴포넌트
│   │   │   │   ├── search/     # 검색 컴포넌트
│   │   │   │   └── ui/         # 기본 UI 컴포넌트
│   │   │   └── lib/           # 유틸리티
│   │   └── public/            # 정적 파일
│   │
│   └── data/                   # 데이터 및 샘플
│       ├── sample-projects/   # 샘플 프로젝트들
│       │   ├── my-documentation/ # 기본 문서 프로젝트
│       │   ├── internal-api/  # 내부 API 문서
│       │   ├── external-api/  # 외부 API 문서
│       │   ├── admin-panel/   # 관리자 패널 문서
│       │   └── shared/        # 공통 리소스
│       │       ├── templates/ # 프로젝트 템플릿
│       │       ├── standards/ # 표준 가이드
│       │       ├── policies/  # 정책 문서
│       │       └── guides/    # 가이드 문서
│       └── templates/         # 데이터 템플릿
│
└── requirements/               # 프로젝트 요구사항
    ├── overview/              # 개요 문서
    ├── shared/                # 공통 문서
    └── ai-system/             # AI 시스템 요구사항
```

## 🎯 주요 컴포넌트

### 1. mdshare-core (핵심 라이브러리)
- **역할**: 마크다운 파싱, 메타데이터 관리, 프로젝트 인덱싱
- **기술**: TypeScript, Node.js
- **주요 기능**:
  - 확장된 마크다운 파싱 (@csv, @json, @mermaid)
  - Frontmatter 자동 처리
  - 메타데이터 추출 및 인덱싱
  - 프로젝트 관리 시스템

### 2. mdshare-web (웹 인터페이스)
- **역할**: 사용자 인터페이스, 웹 서비스
- **기술**: Next.js 15, React, TypeScript, Tailwind CSS
- **주요 기능**:
  - 반응형 디자인
  - 다크/라이트 테마
  - AI 기반 검색
  - 실시간 챗봇
  - Cloudflare Pages 배포

### 3. data/sample-projects (샘플 프로젝트)
- **역할**: 실제 사용 예시, 템플릿 제공
- **구성**:
  - `my-documentation`: 기본 문서 프로젝트
  - `internal-api`: 내부 API 문서
  - `external-api`: 외부 API 문서
  - `admin-panel`: 관리자 패널 문서
  - `shared`: 공통 리소스 (템플릿, 표준, 정책)

## 🔄 개발 워크플로우

### 1. Core 라이브러리 개발
```bash
cd services/mdshare-core
npm install
npm run build
npx ts-node examples/parser-test.ts
```

### 2. 랜딩 페이지 개발
```bash
cd services/mdshare-landing
npm install
npm run dev
```

### 3. 마크다운 뷰어 개발
```bash
cd services/mdshare-web
npm install
npm run dev
```

### 4. 샘플 프로젝트 테스트
```bash
cd services/data/sample-projects/my-documentation
# .mdshare/config.json 확인
# README.md 편집
```

### 5. 배포
```bash
# 랜딩 페이지 배포
cd services/mdshare-landing
./deploy.sh production

# 마크다운 뷰어 배포
cd services/mdshare-web
npm run build
npx wrangler pages deploy .next
```

## 📊 프로젝트 상태

### ✅ 완료된 기능
- [x] Core 라이브러리 구현
- [x] 웹 인터페이스 기본 구조
- [x] 샘플 프로젝트 구성
- [x] 배포 설정
- [x] 문서화

### 🚧 진행 중인 작업
- [ ] AI 기능 통합
- [ ] 검색 기능 구현
- [ ] 챗봇 기능 구현
- [ ] CLI 도구 개발

### 📋 향후 계획
- [ ] 사용자 인증 시스템
- [ ] 실시간 협업 기능
- [ ] 플러그인 시스템
- [ ] 모바일 앱

## 🔧 개발 환경

### 필요 조건
- Node.js 18.0.0 이상
- npm 8.0.0 이상
- TypeScript 5.0 이상
- Cloudflare 계정 (배포용)

### 환경 변수
```bash
# services/mdshare-web/.env.local
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.pages.dev
```

## 📞 지원 및 문의

- **문서**: [MDShare 문서](https://docs.mdshare.app)
- **이슈**: [GitHub Issues](https://github.com/mdshare/mdshare/issues)
- **커뮤니티**: [Discord](https://discord.gg/mdshare)
