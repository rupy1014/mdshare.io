# MDShare CLI 사용 예시

## 🚀 실제 사용 시나리오

### 시나리오 1: 개인 블로거 시작하기

```bash
# 1. CLI 설치
npm install -g @mdshare/cli

# 2. 블로그 프로젝트 생성
mkdir my-blog
cd my-blog
mdshare init --template blog

# 대화형 설정
? 블로그 이름을 입력하세요: 김개발의 기술 블로그
? 블로그 설명을 입력하세요: 개발 경험과 기술 노하우를 공유하는 블로그
? 작성자 이름을 입력하세요: 김개발
? 블로그 언어를 선택하세요:
  ❯ 한국어 (ko)
    English (en)

? 카테고리를 선택하세요: (Use arrow keys)
  ❯ 개발
    기술
    일상
    리뷰

? 댓글 기능을 활성화하시겠습니까? (Y/n) Y
? RSS 피드를 생성하시겠습니까? (Y/n) Y
? 다크 모드를 지원하시겠습니까? (Y/n) Y

✅ 블로그 프로젝트가 생성되었습니다!

📁 생성된 구조:
   - README.md (블로그 홈페이지)
   - posts/ (블로그 포스트)
   - categories/ (카테고리별 정리)
   - assets/ (이미지, CSS 등)
   - _meta/ (블로그 메타데이터)

🚀 다음 단계:
   1. mdshare add "첫 번째 포스트" - 새 포스트 작성
   2. mdshare serve - 로컬에서 미리보기
   3. mdshare deploy - GitHub Pages에 배포

# 3. 첫 번째 포스트 작성
mdshare add "Next.js 14 새로운 기능 소개"

? 포스트 카테고리를 선택하세요:
  ❯ 개발
    기술
    일상
    리뷰

? 태그를 입력하세요 (쉼표로 구분): Next.js, React, JavaScript, 웹개발
? 발행 상태를 선택하세요:
  ❯ published
    draft

✅ 포스트가 생성되었습니다!
📄 파일 위치: posts/nextjs-14-new-features.md

# 4. 로컬 서버 시작
mdshare serve

🚀 개발 서버가 시작되었습니다!
📱 로컬 주소: http://localhost:3000
📱 네트워크 주소: http://192.168.1.100:3000

✨ 기능:
   - 실시간 미리보기
   - 핫 리로드
   - AI 챗봇 (http://localhost:3000/chat)

# 5. 배포
mdshare deploy

? 배포 방법을 선택하세요:
  ❯ GitHub Pages
    Vercel
    Netlify
    커스텀 도메인

? GitHub 저장소 URL을 입력하세요: https://github.com/username/my-blog
? 브랜치를 선택하세요: main

🔄 배포 중...
✅ 배포가 완료되었습니다!
🌐 배포 URL: https://username.github.io/my-blog
```

### 시나리오 2: API 문서 작성하기

```bash
# 1. API 문서 프로젝트 생성
mkdir my-api-docs
cd my-api-docs
mdshare init --template api-docs

# 대화형 설정
? API 이름을 입력하세요: 사용자 관리 API
? API 설명을 입력하세요: 사용자 등록, 로그인, 프로필 관리 API
? 작성자 이름을 입력하세요: API팀
? API 유형을 선택하세요:
  ❯ REST API
    GraphQL API
    gRPC API

? 인증 방식을 선택하세요:
  ❯ JWT
    API Key
    OAuth 2.0
    Basic Auth

? 기본 URL을 입력하세요: https://api.mycompany.com
? OpenAPI 스펙을 생성하시겠습니까? (Y/n) Y
? 샘플 코드를 포함하시겠습니까? (Y/n) Y

✅ API 문서 프로젝트가 생성되었습니다!

📁 생성된 구조:
   - README.md (API 개요)
   - docs/api/ (API 문서)
   - docs/examples/ (사용 예시)
   - data/samples/ (요청/응답 샘플)
   - openapi.yaml (OpenAPI 스펙)

# 2. API 엔드포인트 문서 추가
mdshare add "사용자 인증 API"

? 문서 타입을 선택하세요:
  ❯ API 엔드포인트
    사용 가이드
    에러 코드
    샘플 코드

? 엔드포인트 경로를 입력하세요: /api/v1/auth/login
? HTTP 메서드를 선택하세요:
  ❯ POST
    GET
    PUT
    DELETE

? 요청 본문 예시를 입력하세요:
{
  "email": "user@example.com",
  "password": "password123"
}

? 응답 예시를 입력하세요:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "홍길동"
    }
  }
}

✅ API 문서가 생성되었습니다!
📄 파일 위치: docs/api/auth-login.md

# 3. 샘플 코드 생성
mdshare generate sample --endpoint /api/v1/auth/login

? 언어를 선택하세요:
  ❯ JavaScript (fetch)
    JavaScript (axios)
    Python (requests)
    Python (httpx)
    cURL
    Go

✅ 샘플 코드가 생성되었습니다!
📄 파일 위치: docs/examples/auth-login-javascript.md

# 4. OpenAPI 스펙 업데이트
mdshare update openapi

✅ OpenAPI 스펙이 업데이트되었습니다!
📄 파일 위치: openapi.yaml

# 5. API 문서 사이트 배포
mdshare deploy --platform github-pages

🌐 API 문서 사이트: https://username.github.io/my-api-docs
📋 OpenAPI 스펙: https://username.github.io/my-api-docs/openapi.yaml
```

### 시나리오 3: 팀 위키 구축하기

```bash
# 1. 팀 위키 프로젝트 생성
mkdir team-wiki
cd team-wiki
mdshare init --template wiki

# 대화형 설정
? 위키 이름을 입력하세요: 개발팀 위키
? 위키 설명을 입력하세요: 개발팀의 지식 베이스와 가이드라인
? 팀 이름을 입력하세요: 개발팀
? 협업 기능을 활성화하시겠습니까? (Y/n) Y
? 권한 관리를 설정하시겠습니까? (Y/n) Y

✅ 팀 위키 프로젝트가 생성되었습니다!

📁 생성된 구조:
   - README.md (위키 홈페이지)
   - docs/ (문서들)
   - guides/ (가이드라인)
   - policies/ (정책 문서)
   - templates/ (문서 템플릿)

# 2. 팀 멤버 초대
mdshare invite add

? 초대할 사용자의 이메일을 입력하세요: john@company.com
? 권한 레벨을 선택하세요:
  ❯ Editor (편집 가능)
    Viewer (읽기 전용)
    Admin (관리자)

? 초대 메시지를 입력하세요: 팀 위키에 초대합니다!

✅ 초대가 발송되었습니다!
📧 초대 이메일이 john@company.com으로 발송되었습니다.
🔗 초대 링크: https://wiki.mycompany.com/invite/abc123

# 3. 문서 구조 생성
mdshare structure create

? 문서 구조를 선택하세요:
  ❯ 개발 가이드
    프로젝트 문서
    정책 및 절차
    커스텀 구조

? 포함할 섹션을 선택하세요: (Use arrow keys)
  ❯ 온보딩 가이드
    개발 환경 설정
    코딩 표준
    배포 가이드
    문제 해결

✅ 문서 구조가 생성되었습니다!

📁 생성된 구조:
   - docs/onboarding/
   - docs/development/
   - docs/deployment/
   - docs/troubleshooting/

# 4. 온보딩 가이드 작성
mdshare add "신입 개발자 온보딩 가이드"

? 문서 위치를 선택하세요:
  ❯ docs/onboarding/
    docs/development/
    docs/deployment/

? 템플릿을 사용하시겠습니까? (Y/n) Y
? 사용할 템플릿을 선택하세요:
  ❯ 온보딩 가이드 템플릿
    개발 환경 설정 템플릿
    커스텀 템플릿

✅ 온보딩 가이드가 생성되었습니다!
📄 파일 위치: docs/onboarding/new-developer-guide.md

# 5. 팀 위키 배포
mdshare deploy --private

? 배포 플랫폼을 선택하세요:
  ❯ 내부 서버
    Vercel (비공개)
    Netlify (비공개)
    커스텀 도메인

? 내부 서버 주소를 입력하세요: wiki.company.com
? SSL 인증서를 설정하시겠습니까? (Y/n) Y

🔄 배포 중...
✅ 팀 위키가 배포되었습니다!
🔒 비공개 URL: https://wiki.company.com
🔑 접근 코드: TEAM2024
```

### 시나리오 4: 엔터프라이즈 멀티 프로젝트

```bash
# 1. 엔터프라이즈 워크스페이스 생성
mkdir enterprise-platform
cd enterprise-platform
mdshare init --template enterprise

# 대화형 설정
? 워크스페이스 이름을 입력하세요: 우리 회사 플랫폼
? 워크스페이스 타입을 선택하세요:
  ❯ 마이크로서비스 플랫폼
    모놀리식 애플리케이션
    하이브리드 아키텍처

? 포함할 프로젝트를 선택하세요: (Use arrow keys)
  ❯ internal-api (내부 API)
    external-api (외부 API)
    admin-panel (관리자 패널)
    user-portal (사용자 포털)
    analytics-service (분석 서비스)

? 공통 리소스를 포함하시겠습니까? (Y/n) Y
? 보안 정책을 포함하시겠습니까? (Y/n) Y
? 개발 표준을 포함하시겠습니까? (Y/n) Y
? AI 통합 분석을 활성화하시겠습니까? (Y/n) Y

✅ 엔터프라이즈 워크스페이스가 생성되었습니다!

📁 생성된 구조:
   - .mdshare-workspace/ (워크스페이스 설정)
   - projects/ (개별 프로젝트들)
   - shared/ (공통 리소스)
   - README.md (워크스페이스 개요)

# 2. 프로젝트 간 관계 분석
mdshare analyze cross-project

🔍 프로젝트 간 관계를 분석 중...
📊 의존성 그래프 생성 중...
🤖 AI 분석 실행 중...

✅ 분석이 완료되었습니다!

📈 분석 결과:
   - 총 5개 프로젝트
   - 12개 의존성 관계
   - 3개 단일 장애점 식별
   - 5개 최적화 제안

📄 상세 보고서: .mdshare-workspace/ai-analysis/architecture-analysis.json

# 3. 새 기능 영향도 분석
mdshare analyze impact "결제 시스템 추가"

🔍 결제 시스템 추가의 영향을 분석 중...
📊 각 프로젝트별 영향도 계산 중...
🤖 AI 추천사항 생성 중...

✅ 영향도 분석이 완료되었습니다!

📈 분석 결과:
   - internal-api: 높은 영향 (2주 소요)
   - external-api: 중간 영향 (1주 소요)
   - admin-panel: 중간 영향 (1.5주 소요)
   - user-portal: 낮은 영향 (1주 소요)
   - analytics-service: 중간 영향 (0.5주 소요)

📄 상세 계획: .mdshare-workspace/ai-analysis/feature-impact.json

# 4. 보안 정책 업데이트
mdshare policy update security

? 업데이트할 보안 정책을 선택하세요:
  ❯ 결제 데이터 암호화
    API 보안 강화
    접근 권한 관리
    전체 정책 업데이트

? 정책 적용 범위를 선택하세요:
  ❯ 전체 프로젝트
    특정 프로젝트만

✅ 보안 정책이 업데이트되었습니다!
📄 업데이트된 정책: shared/policies/security-policy.md

# 5. 통합 배포
mdshare deploy all --staging

🔄 모든 프로젝트를 스테이징 환경에 배포 중...

📊 배포 진행 상황:
   ✅ internal-api: 배포 완료 (https://api-staging.company.com)
   ✅ external-api: 배포 완료 (https://api-external-staging.company.com)
   ✅ admin-panel: 배포 완료 (https://admin-staging.company.com)
   ✅ user-portal: 배포 완료 (https://portal-staging.company.com)
   ✅ analytics-service: 배포 완료 (https://analytics-staging.company.com)

🎉 모든 프로젝트 배포가 완료되었습니다!
🌐 스테이징 환경: https://staging.company.com
```

### 시나리오 5: 기존 프로젝트 마이그레이션

```bash
# 1. Notion에서 마이그레이션
mdshare migrate from-notion

? Notion 워크스페이스 URL을 입력하세요: https://notion.so/workspace/abc123
? Notion API 토큰을 입력하세요: secret_abc123...
? 마이그레이션할 페이지를 선택하세요:
  ❯ 전체 워크스페이스
    특정 페이지만
    특정 데이터베이스만

? 마이그레이션 옵션을 설정하세요:
  ❯ 이미지 다운로드: Y
    링크 변환: Y
    메타데이터 보존: Y
    폴더 구조 유지: Y

🔄 마이그레이션을 시작합니다...
📥 페이지 다운로드 중... (15/50)
📝 마크다운 변환 중... (30/50)
🖼️ 이미지 처리 중... (45/50)
🔗 링크 변환 중... (50/50)

✅ 마이그레이션이 완료되었습니다!

📊 마이그레이션 결과:
   - 총 50개 페이지 변환
   - 120개 이미지 다운로드
   - 45개 링크 변환
   - 5개 변환 실패 (수동 확인 필요)

📄 상세 로그: migration.log
📁 변환된 파일: ./notion-migration/

# 2. 변환 결과 검토
mdshare migrate review

📋 변환 실패 항목:
   1. "복잡한 데이터베이스" - 수동 변환 필요
   2. "임베드된 비디오" - 링크로 변환됨
   3. "수식 블록" - 텍스트로 변환됨

? 실패 항목을 수동으로 처리하시겠습니까? (Y/n) Y

✅ 수동 처리가 완료되었습니다!

# 3. 마이그레이션된 프로젝트 정리
mdshare organize

? 정리 옵션을 선택하세요:
  ❯ 자동 태깅
    폴더 구조 최적화
    중복 파일 제거
    전체 정리

🤖 AI가 자동으로 정리 중...
📝 자동 태깅 적용 중...
📁 폴더 구조 최적화 중...
🗑️ 중복 파일 제거 중...

✅ 정리가 완료되었습니다!

📊 정리 결과:
   - 25개 문서에 자동 태그 추가
   - 3개 폴더 구조 최적화
   - 8개 중복 파일 제거
   - 12개 관련 문서 연결

# 4. 마이그레이션된 프로젝트 배포
mdshare deploy --migrated

🌐 마이그레이션된 사이트: https://migrated-site.company.com
```

## 🔧 고급 CLI 사용법

### 일괄 작업
```bash
# 여러 문서 한번에 생성
mdshare batch add "문서1,문서2,문서3" --template guide

# 여러 프로젝트 동시 배포
mdshare deploy project1,project2,project3 --parallel

# 전체 워크스페이스 백업
mdshare backup --workspace --compress
```

### 자동화 스크립트
```bash
# CI/CD 파이프라인용
mdshare build --production --optimize
mdshare test --coverage
mdshare deploy --auto --notify

# 정기 업데이트 스크립트
mdshare update templates
mdshare analyze --schedule daily
mdshare backup --schedule weekly
```

### 플러그인 시스템
```bash
# 플러그인 설치
mdshare plugin install @mdshare/plugin-analytics
mdshare plugin install @mdshare/plugin-search

# 플러그인 사용
mdshare analytics setup
mdshare search index
```

---

이러한 CLI 예시를 통해 사용자는 **간단한 명령어로 복잡한 작업**을 수행할 수 있고, **일관된 워크플로우**를 통해 효율적으로 문서를 관리할 수 있습니다.
