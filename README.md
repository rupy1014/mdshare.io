# MDShare - AI-powered Documentation Platform

AI 기반 마크다운 문서화 플랫폼입니다. 지능형 인덱싱, 검색, 챗봇 기능을 제공합니다.

## 🚀 서비스 실행하기

### 1. 랜딩 페이지 실행
```bash
cd services/mdshare-landing
npm install
npm run dev
# http://localhost:7677 - 마케팅 랜딩 페이지
```

### 2. 마크다운 뷰어 실행
```bash
cd services/mdshare-web
npm install
npm run dev
# http://localhost:7778 - 노션 스타일 마크다운 뷰어
```

### 3. 브라우저에서 확인
- **랜딩 페이지**: http://localhost:7677 (마케팅/홍보용)
- **마크다운 뷰어**: http://localhost:7778 (실제 서비스)

## 🏗️ 프로젝트 구조

```
study/
├── study/                # 학습 관련 파일들
│   ├── lectures/         # 강의 자료
│   ├── week1.md          # 1주차 학습 내용
│   ├── week2.md          # 2주차 학습 내용
│   ├── week3.md          # 3주차 학습 내용
│   └── week4.md          # 4주차 학습 내용
├── services/             # MDShare 서비스 관련
│   ├── mdshare-core/     # 핵심 라이브러리
│   ├── mdshare-landing/  # 랜딩 페이지 (마케팅)
│   ├── mdshare-web/      # 마크다운 뷰어 (노션 스타일)
│   └── data/             # 샘플 프로젝트 및 데이터
├── requirements/         # 프로젝트 요구사항
└── docs/                 # 프로젝트 문서
```

## 📦 Core 라이브러리 사용하기

### 1. Core 라이브러리 빌드
```bash
cd services/mdshare-core
npm install
npm run build
```

### 2. 예제 실행
```bash
# 파서 테스트 예제
npx ts-node examples/parser-test.ts

# 기본 사용법 예제
npx ts-node examples/basic-usage.ts
```

## 🌐 Cloudflare Pages 배포

### 1. 랜딩 페이지 배포
```bash
cd services/mdshare-landing
./setup-env-vars.sh
./deploy.sh production
```

### 2. 마크다운 뷰어 배포
```bash
cd services/mdshare-web
npm run build
npx wrangler pages deploy .next
```

### 3. 배포 URL
- **개발**: https://mdshare-dev.pages.dev
- **스테이징**: https://mdshare-staging.pages.dev
- **프로덕션**: https://mdshare.pages.dev

## 🔧 개발 환경 설정

### 필요 조건
- Node.js 18.0.0 이상
- npm 8.0.0 이상
- Cloudflare 계정 (배포용)

### 환경 변수
```bash
# services/mdshare-web/.env.local
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.pages.dev
```

## 🧪 테스트

### 랜딩 페이지 테스트
```bash
cd services/mdshare-landing
npm run test
npm run test:e2e
```

### 마크다운 뷰어 테스트
```bash
cd services/mdshare-web
npm run test
npm run test:e2e
```

### Core 라이브러리 테스트
```bash
cd services/mdshare-core
npm run test
```

## 📚 주요 기능

### Core 라이브러리
- ✅ 확장된 마크다운 파싱 (@csv, @json, @mermaid)
- ✅ Frontmatter 자동 처리
- ✅ 메타데이터 추출 및 인덱싱
- ✅ 프로젝트 관리 시스템

### 랜딩 페이지
- ✅ 반응형 디자인 (모바일/데스크톱)
- ✅ 다크/라이트 테마
- ✅ 마케팅 페이지
- ✅ 서비스 소개

### 마크다운 뷰어
- ✅ 노션 스타일 UI
- ✅ 실시간 마크다운 편집
- ✅ 문서 대시보드
- ✅ 검색 기능

### 배포 및 운영
- ✅ Cloudflare Pages 자동 배포
- ✅ 환경별 배포 (dev/staging/prod)
- ✅ 환경 변수 자동 설정
- ✅ 성능 모니터링

## 🚀 빠른 시작

1. **랜딩 페이지 실행**:
   ```bash
   cd services/mdshare-landing && npm install && npm run dev
   # http://localhost:7677
   ```

2. **마크다운 뷰어 실행**:
   ```bash
   cd services/mdshare-web && npm install && npm run dev
   # http://localhost:7778
   ```

3. **Core 라이브러리 테스트**:
   ```bash
   cd services/mdshare-core && npm install && npm run build
   npx ts-node examples/parser-test.ts
   ```

## 📞 지원

- **문서**: [MDShare 문서](https://docs.mdshare.app)
- **이슈**: [GitHub Issues](https://github.com/mdshare/mdshare/issues)
- **커뮤니티**: [Discord](https://discord.gg/mdshare)
# mdshare.io
