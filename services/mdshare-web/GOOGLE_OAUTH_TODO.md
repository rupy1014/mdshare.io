# 구글 로그인 구현 및 Cloudflare 배포 준비 작업

## 📋 개요
MDShare 웹 애플리케이션에 구글 OAuth 로그인을 추가하고 Cloudflare 환경에 배포하기 위한 작업 목록입니다.

## 🎯 목표
- 구글 OAuth 로그인 기능 구현
- Cloudflare Workers 환경에 배포
- 기존 GitHub/GitLab OAuth와 통합

---

## 🔧 1. 구글 OAuth 설정 (Google Cloud Console)

### 1.1 Google Cloud Console 설정
- [ ] Google Cloud Console에서 새 프로젝트 생성
- [ ] OAuth 동의 화면 설정
  - [ ] 사용자 유형: 외부 선택
  - [ ] 앱 이름: MDShare
  - [ ] 사용자 지원 이메일 설정
  - [ ] 개발자 연락처 정보 입력
- [ ] OAuth 2.0 클라이언트 ID 생성
  - [ ] 애플리케이션 유형: 웹 애플리케이션
  - [ ] 승인된 리디렉션 URI 추가:
    - `http://localhost:7778/api/oauth/callback/google` (개발)
    - `https://your-domain.com/api/oauth/callback/google` (프로덕션)
- [ ] 클라이언트 ID와 클라이언트 시크릿 발급 및 안전하게 저장

### 1.2 OAuth 스코프 설정
- [ ] 필요한 스코프 확인:
  - `openid`: 기본 인증
  - `email`: 이메일 정보
  - `profile`: 프로필 정보
  - `https://www.googleapis.com/auth/drive.readonly`: Google Drive 읽기 (선택사항)

---

## 💻 2. 코드 수정 작업

### 2.1 OAuth 서비스 확장 (`src/lib/oauth-service.ts`)
- [ ] 구글 OAuth 설정 추가
  ```typescript
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:7778'}/api/oauth/callback/google`,
    scopes: ['openid', 'email', 'profile']
  }
  ```
- [ ] `getProviders()` 메서드에 구글 프로바이더 추가
- [ ] 구글 OAuth 엔드포인트 URL 설정:
  - `authUrl`: `https://accounts.google.com/o/oauth2/v2/auth`
  - `tokenUrl`: `https://oauth2.googleapis.com/token`
  - `userInfoUrl`: `https://www.googleapis.com/oauth2/v2/userinfo`

### 2.2 OAuth 컴포넌트 업데이트 (`src/components/oauth/oauth-login.tsx`)
- [ ] 구글 아이콘 추가 (Lucide React의 `Chrome` 또는 커스텀 아이콘)
- [ ] `getProviderIcon()` 메서드에 구글 케이스 추가
- [ ] `getProviderDescription()` 메서드에 구글 설명 추가:
  ```typescript
  case 'google':
    return '구글 계정으로 로그인하여 서비스에 접근하세요'
  ```
- [ ] `getProviderBadgeColor()` 메서드에 구글 색상 추가:
  ```typescript
  case 'google':
    return 'bg-red-500 text-white hover:bg-red-600'
  ```

### 2.3 API 라우트 구현

#### 2.3.1 구글 OAuth 리다이렉트 (`src/app/api/oauth/google/route.ts`)
- [ ] 파일 생성
- [ ] 구글 OAuth URL 생성 및 리다이렉트 처리
- [ ] state 파라미터로 CSRF 보호

#### 2.3.2 구글 OAuth 콜백 (`src/app/api/oauth/callback/google/route.ts`)
- [ ] 파일 생성
- [ ] 인증 코드를 액세스 토큰으로 교환
- [ ] 사용자 정보 조회
- [ ] 내부 JWT 토큰 생성
- [ ] 세션 저장 및 리다이렉트

#### 2.3.3 구글 사용자 정보 (`src/app/api/oauth/user/google/route.ts`)
- [ ] 파일 생성
- [ ] 구글 API를 통한 사용자 정보 조회
- [ ] 표준화된 사용자 정보 반환

#### 2.3.4 구글 Drive 파일 (선택사항) (`src/app/api/oauth/repositories/google/route.ts`)
- [ ] 파일 생성
- [ ] Google Drive API를 통한 파일 목록 조회
- [ ] 마크다운 파일 필터링

### 2.4 타입 정의 확장 (`src/types/oauth.ts`)
- [ ] 구글 사용자 정보 인터페이스 추가:
  ```typescript
  interface GoogleUser {
    id: string
    email: string
    name: string
    picture: string
    verified_email: boolean
  }
  ```
- [ ] 구글 Drive 파일 인터페이스 추가 (선택사항)
- [ ] OAuthConfig에 구글 설정 타입 추가

---

## 🔐 3. 환경 변수 설정

### 3.1 로컬 개발용 (`.env.local`)
- [ ] 파일 생성
- [ ] 구글 OAuth 설정 추가:
  ```env
  # 구글 OAuth
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  
  # 기존 설정
  NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
  GITHUB_CLIENT_SECRET=your_github_client_secret
  NEXT_PUBLIC_GITLAB_CLIENT_ID=your_gitlab_client_id
  GITLAB_CLIENT_SECRET=your_gitlab_client_secret
  
  # 앱 URL
  NEXT_PUBLIC_APP_URL=http://localhost:7778
  
  # JWT 시크릿
  JWT_SECRET=your_jwt_secret_key
  ```

### 3.2 Cloudflare 배포용
- [ ] Cloudflare Workers 환경 변수 설정
- [ ] Secrets 관리 (클라이언트 시크릿)
- [ ] 커스텀 도메인 설정

---

## ☁️ 4. Cloudflare 배포 설정

### 4.1 Wrangler 설정 (`wrangler.toml`)
- [ ] 파일 생성
- [ ] 기본 설정 추가:
  ```toml
  name = "mdshare-web"
  compatibility_date = "2024-01-01"
  pages_build_output_dir = ".next"
  
  [env.production]
  name = "mdshare-web-prod"
  
  [env.staging]
  name = "mdshare-web-staging"
  ```
- [ ] 환경 변수 설정
- [ ] 커스텀 도메인 설정

### 4.2 Next.js Cloudflare 최적화 (`next.config.mjs`)
- [ ] `@cloudflare/next-on-pages` 설정 확인
- [ ] Cloudflare 최적화 설정 추가:
  ```javascript
  const nextConfig = {
    // 기존 설정...
    experimental: {
      runtime: 'edge',
    },
  }
  ```
- [ ] 정적 파일 처리 설정
- [ ] 이미지 최적화 설정

### 4.3 배포 스크립트
- [ ] `package.json`에 배포 스크립트 추가:
  ```json
  {
    "scripts": {
      "deploy": "wrangler pages deploy .next",
      "deploy:staging": "wrangler pages deploy .next --env staging",
      "deploy:prod": "wrangler pages deploy .next --env production"
    }
  }
  ```

---

## 🔗 5. 인증 시스템 통합

### 5.1 기존 인증과 통합
- [ ] 구글 로그인 후 기존 사용자 시스템과 연동
- [ ] JWT 토큰 생성 로직 통합 (`src/lib/jwt.ts` 생성)
- [ ] 사용자 정보 매핑 (구글 → 내부 사용자)
- [ ] 세션 관리 통합 (`src/lib/session.ts` 생성)

### 5.2 로그인 페이지 업데이트 (`src/app/login/page.tsx`)
- [ ] 구글 로그인 버튼 추가
- [ ] OAuth 로그인 컴포넌트 통합
- [ ] 기존 이메일/비밀번호 로그인과 병행
- [ ] 로그인 옵션 분리 (소셜 로그인 vs 이메일 로그인)

### 5.3 사용자 정보 통합
- [ ] 구글 사용자 정보를 내부 사용자 모델로 변환
- [ ] 프로필 이미지 처리
- [ ] 이메일 중복 처리 로직

---

## 🛡️ 6. 보안 및 권한 설정

### 6.1 보안 강화
- [ ] CSRF 보호 (state 파라미터 검증)
- [ ] 토큰 만료 시간 설정
- [ ] 리프레시 토큰 처리
- [ ] 오류 처리 및 로깅 강화
- [ ] Rate limiting 구현

### 6.2 권한 관리
- [ ] 구글 로그인 사용자 권한 설정
- [ ] 워크스페이스 접근 권한 통합
- [ ] 관리자 권한 처리

---

## 🧪 7. 테스트 및 검증

### 7.1 로컬 테스트
- [ ] 구글 로그인 플로우 테스트
- [ ] 사용자 정보 조회 테스트
- [ ] 세션 관리 테스트
- [ ] 오류 케이스 테스트 (잘못된 토큰, 만료된 토큰 등)
- [ ] 기존 로그인과의 충돌 테스트

### 7.2 배포 테스트
- [ ] Cloudflare Workers 배포 테스트
- [ ] 프로덕션 환경에서 구글 로그인 테스트
- [ ] 성능 및 안정성 테스트
- [ ] 모바일 환경 테스트

### 7.3 통합 테스트
- [ ] 구글 로그인 → 워크스페이스 생성 플로우
- [ ] 구글 로그인 → 문서 접근 플로우
- [ ] 로그아웃 및 세션 만료 테스트

---

## 📚 8. 문서화 및 정리

### 8.1 코드 문서화
- [ ] OAuth 서비스 JSDoc 주석 추가
- [ ] API 라우트 문서화
- [ ] 타입 정의 문서화

### 8.2 설정 가이드 업데이트
- [ ] `OAUTH_SETUP.md`에 구글 설정 추가
- [ ] 배포 가이드 작성 (`DEPLOYMENT.md`)
- [ ] 환경 변수 설정 가이드 업데이트

### 8.3 README 업데이트
- [ ] 구글 로그인 기능 설명 추가
- [ ] 설치 및 설정 가이드 업데이트
- [ ] 배포 방법 안내 추가

---

## 🎯 우선순위 작업 순서

### Phase 1: 기본 구현 (1-2일)
1. Google Cloud Console 설정
2. OAuth 서비스에 구글 추가
3. API 라우트 구현 (리다이렉트, 콜백)
4. 환경 변수 설정

### Phase 2: 통합 및 UI (1일)
5. 로그인 페이지 통합
6. OAuth 컴포넌트 업데이트
7. 타입 정의 확장

### Phase 3: 배포 준비 (1일)
8. Cloudflare 설정
9. 보안 강화
10. 로컬 테스트

### Phase 4: 배포 및 검증 (1일)
11. 배포 테스트
12. 프로덕션 검증
13. 문서화

---

## 📝 참고사항

### 구글 OAuth 플로우
1. 사용자가 구글 로그인 버튼 클릭
2. `/api/oauth/google`로 리다이렉트
3. 구글 OAuth 페이지로 리다이렉트
4. 사용자 인증 후 `/api/oauth/callback/google`로 콜백
5. 인증 코드를 액세스 토큰으로 교환
6. 구글 API로 사용자 정보 조회
7. 내부 JWT 토큰 생성 및 세션 저장
8. 대시보드로 리다이렉트

### 보안 고려사항
- 클라이언트 시크릿은 절대 프론트엔드에 노출되지 않도록 주의
- state 파라미터로 CSRF 공격 방지
- 토큰 만료 시간 적절히 설정
- 오류 메시지에서 민감한 정보 노출 방지

### Cloudflare 제약사항
- Edge Runtime 사용 시 Node.js API 제한
- 파일 시스템 접근 제한
- 환경 변수와 시크릿 관리 방식 확인

---

**완료 체크**: 각 작업 완료 시 `- [x]`로 변경하여 진행 상황을 추적하세요.
