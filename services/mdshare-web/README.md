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
- **URL**: http://localhost:7778
- **기능**: 마크다운 문서 뷰어, 검색, 편집

## 🔐 데모 계정 정보

테스트를 위한 데모 계정들을 사용할 수 있습니다:

| 역할 | 이메일 | 비밀번호 | 권한 |
|------|--------|----------|------|
| **관리자** | `admin@mdshare.com` | `admin123` | 모든 기능 (워크스페이스 관리, 팀원 관리, 접근 제어) |
| **에디터** | `editor@mdshare.com` | `editor123` | 문서 편집, AI 인덱싱, Git 연동 |
| **뷰어** | `viewer@mdshare.com` | `viewer123` | 문서 읽기, 댓글 작성 |

### 사용 방법
1. 랜딩 페이지에서 "로그인" 클릭
2. 위 계정 정보로 로그인
3. 역할에 따라 다른 기능 체험

## 🚀 주요 기능

### 📝 확장 마크다운 지원
- **Frontmatter**: 메타데이터 관리
- **CSV/JSON 렌더링**: 표 형태로 데이터 표시
- **Mermaid 다이어그램**: 플로우차트, 시퀀스 다이어그램 등
- **내부 링크**: 문서 간 연결 및 네비게이션
- **목차 자동 생성**: 헤딩 기반 네비게이션

### 🤖 AI 기능
- **Claude Code 연동**: 터미널 기반 문서 관리
- **자동 인덱싱**: 문서 구조 분석 및 최적화
- **관계 분석**: 문서 간 연결성 파악
- **의미론적 검색**: AI 기반 콘텐츠 검색
- **개선 제안**: 문서 품질 향상 팁

### 🔐 접근 제어
- **역할 기반 권한**: 관리자, 에디터, 뷰어
- **멤버 관리**: 초대, 역할 변경, 제거
- **초대 코드 시스템**: 안전한 팀 참여

### 🔄 문서 동기화
- **Git 기반 동기화**: Push, Pull, Sync 지원
- **충돌 해결**: 자동 및 수동 충돌 해결
- **상태 추적**: 실시간 동기화 상태 모니터링

### 🔔 알림 시스템
- **실시간 알림**: 문서, 멤버, 동기화 이벤트
- **개인화된 설정**: 알림 타입별 개별 설정
- **다양한 알림 방법**: 브라우저, 이메일 알림

### 🎨 사용자 경험
- **다크/라이트 테마**: 사용자 선호도에 따른 테마 전환
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **키보드 네비게이션**: 접근성 고려
- **접근성 지원**: 고대비, 큰 글씨, 애니메이션 감소


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
