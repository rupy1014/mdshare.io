# MDShare 배포 가이드

## 🚀 Cloudflare Pages 배포

### 1. 사전 준비사항

#### 1.1 Google OAuth 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. OAuth 동의 화면 설정:
   - 사용자 유형: 외부
   - 앱 이름: MDShare
   - 사용자 지원 이메일 설정
3. OAuth 2.0 클라이언트 ID 생성:
   - 애플리케이션 유형: 웹 애플리케이션
   - 승인된 리디렉션 URI: `https://mdshare.io/api/oauth/callback/google`
4. 클라이언트 ID와 시크릿 발급

#### 1.2 데이터베이스 설정
- **Turso (권장)**: Cloudflare와 호환되는 SQLite 기반 데이터베이스
- **PlanetScale**: MySQL 기반 서버리스 데이터베이스
- **Neon**: PostgreSQL 기반 서버리스 데이터베이스

### 2. 환경 변수 설정

#### 2.1 Cloudflare Pages 환경 변수
Cloudflare Dashboard에서 다음 환경 변수를 설정:

```bash
# Database
DATABASE_URL=libsql://your-database-url
DATABASE_AUTH_TOKEN=your-auth-token

# OAuth - Google
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://mdshare.io
JWT_SECRET=your-jwt-secret-key
```

#### 2.2 시크릿 설정 (Wrangler CLI)
```bash
# 시크릿 설정
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put DATABASE_AUTH_TOKEN
wrangler secret put JWT_SECRET
```

### 3. 데이터베이스 마이그레이션

#### 3.1 Turso 설정 (권장)
```bash
# Turso CLI 설치
curl -sSfL https://get.tur.so/install.sh | bash

# 데이터베이스 생성
turso db create mdshare-prod

# 데이터베이스 URL 확인
turso db show mdshare-prod

# 토큰 생성
turso db tokens create mdshare-prod
```

#### 3.2 Drizzle 마이그레이션
```bash
# 마이그레이션 생성
npm run db:generate

# 마이그레이션 실행
npm run db:migrate
```

### 4. 배포 과정

#### 4.1 자동 배포 (Git 연동)
1. GitHub 저장소에 코드 푸시
2. Cloudflare Pages에서 GitHub 저장소 연결
3. 빌드 설정:
   - **프레임워크**: Next.js
   - **빌드 명령어**: `npm run build`
   - **빌드 출력 디렉토리**: `.next`
   - **Node.js 버전**: 18.x

#### 4.2 수동 배포 (Wrangler CLI)
```bash
# 로컬 빌드
npm run build

# 배포
npm run deploy:prod
```

### 5. 도메인 설정

#### 5.1 커스텀 도메인 연결
1. Cloudflare Dashboard → Pages → 프로젝트 선택
2. Settings → Domains → Custom domains
3. `mdshare.io` 도메인 추가
4. DNS 설정 확인

#### 5.2 SSL 인증서
- Cloudflare에서 자동으로 SSL 인증서 발급
- HTTPS 리다이렉트 설정 확인

### 6. 모니터링 및 로그

#### 6.1 Cloudflare Analytics
- Cloudflare Dashboard에서 트래픽 분석
- 실시간 요청 모니터링

#### 6.2 에러 로깅
```typescript
// API 라우트에서 에러 로깅
console.error('API Error:', {
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString(),
  url: request.url,
})
```

### 7. 성능 최적화

#### 7.1 Cloudflare 최적화
- **Caching**: 정적 자산 캐싱
- **CDN**: 글로벌 CDN 활용
- **Edge Computing**: Edge Runtime 사용

#### 7.2 Next.js 최적화
```javascript
// next.config.mjs
const nextConfig = {
  experimental: {
    runtime: 'edge', // Edge Runtime 사용
  },
  images: {
    unoptimized: true, // Cloudflare에서 이미지 최적화
  },
}
```

### 8. 보안 설정

#### 8.1 환경 변수 보안
- 시크릿은 절대 코드에 포함하지 않음
- Cloudflare Secrets 사용
- 정기적인 시크릿 로테이션

#### 8.2 OAuth 보안
- CSRF 보호 (state 파라미터)
- 토큰 만료 시간 설정
- HTTPS 강제 사용

### 9. 백업 및 복구

#### 9.1 데이터베이스 백업
```bash
# Turso 백업
turso db dump mdshare-prod --output backup.sql

# 복구
turso db restore mdshare-prod backup.sql
```

#### 9.2 코드 백업
- GitHub 저장소에 모든 코드 저장
- 태그를 사용한 버전 관리
- 릴리즈 노트 작성

### 10. 트러블슈팅

#### 10.1 일반적인 문제들

**빌드 실패**
```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 문제 해결
rm -rf node_modules package-lock.json
npm install
```

**OAuth 오류**
- 리다이렉트 URI 확인
- 클라이언트 시크릿 확인
- 도메인 설정 확인

**데이터베이스 연결 오류**
- DATABASE_URL 확인
- 네트워크 연결 확인
- 마이그레이션 상태 확인

#### 10.2 로그 확인
```bash
# Cloudflare Pages 로그 확인
wrangler pages deployment tail

# 실시간 로그 모니터링
wrangler pages deployment tail --follow
```

### 11. CI/CD 파이프라인

#### 11.1 GitHub Actions 설정
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: mdshare-web
          directory: .next
```

### 12. 비용 최적화

#### 12.1 Cloudflare Pages 요금제
- **무료**: 월 500회 빌드, 20GB 대역폭
- **Pro**: 월 5,000회 빌드, 500GB 대역폭 ($20/월)

#### 12.2 데이터베이스 비용
- **Turso**: 무료 티어 (500MB, 1억 행)
- **PlanetScale**: 무료 티어 (1GB, 1억 행)
- **Neon**: 무료 티어 (3GB, 1억 행)

---

## 📋 배포 체크리스트

- [ ] Google OAuth 앱 생성 및 설정
- [ ] 데이터베이스 생성 및 연결
- [ ] 환경 변수 설정
- [ ] 데이터베이스 마이그레이션 실행
- [ ] 로컬 빌드 테스트
- [ ] Cloudflare Pages 프로젝트 생성
- [ ] GitHub 저장소 연결
- [ ] 커스텀 도메인 설정
- [ ] SSL 인증서 확인
- [ ] OAuth 플로우 테스트
- [ ] 성능 모니터링 설정
- [ ] 백업 전략 수립

---

## 🔗 유용한 링크

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Drizzle ORM 문서](https://orm.drizzle.team/)
- [Turso 문서](https://docs.tur.so/)
- [Google OAuth 문서](https://developers.google.com/identity/protocols/oauth2)
