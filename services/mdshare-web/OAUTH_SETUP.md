# OAuth 설정 가이드

MDShare Git 연동을 위한 OAuth 설정 방법을 안내합니다.

## GitHub OAuth 앱 설정

### 1. GitHub에서 OAuth 앱 생성

1. GitHub에 로그인 후 [Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)로 이동
2. "New OAuth App" 클릭
3. 다음 정보 입력:
   - **Application name**: MDShare Web
   - **Homepage URL**: `http://localhost:7778`
   - **Authorization callback URL**: `http://localhost:7778/api/oauth/callback/github`
4. "Register application" 클릭

### 2. 클라이언트 정보 확인

OAuth 앱 생성 후 다음 정보를 확인하세요:
- **Client ID**: 공개 정보
- **Client Secret**: 비밀 정보 (Generate a new client secret 클릭)

## GitLab OAuth 앱 설정

### 1. GitLab에서 OAuth 앱 생성

1. GitLab에 로그인 후 [User Settings > Applications](https://gitlab.com/-/profile/applications)로 이동
2. "New application" 클릭
3. 다음 정보 입력:
   - **Name**: MDShare Web
   - **Redirect URI**: `http://localhost:7778/api/oauth/callback/gitlab`
   - **Scopes**: `read_user`, `read_repository`, `api` 선택
4. "Save application" 클릭

### 2. 클라이언트 정보 확인

OAuth 앱 생성 후 다음 정보를 확인하세요:
- **Application ID**: 공개 정보
- **Secret**: 비밀 정보

## 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# GitLab OAuth
NEXT_PUBLIC_GITLAB_CLIENT_ID=your_gitlab_client_id
GITLAB_CLIENT_SECRET=your_gitlab_client_secret

# 앱 URL
NEXT_PUBLIC_APP_URL=http://localhost:7778
```

## 권한 스코프

### GitHub
- `repo`: 저장소 접근
- `user`: 사용자 정보
- `read:org`: 조직 정보 읽기

### GitLab
- `read_user`: 사용자 정보 읽기
- `read_repository`: 저장소 읽기
- `api`: API 접근

## 보안 고려사항

1. **Client Secret 보안**: Client Secret은 절대 공개하지 마세요
2. **HTTPS 사용**: 프로덕션 환경에서는 반드시 HTTPS를 사용하세요
3. **토큰 만료**: 액세스 토큰은 1시간 후 자동 만료됩니다
4. **권한 최소화**: 필요한 최소한의 권한만 요청하세요

## 문제 해결

### OAuth 콜백 오류
- 콜백 URL이 정확한지 확인하세요
- 환경변수가 올바르게 설정되었는지 확인하세요

### 권한 오류
- 요청한 스코프가 OAuth 앱 설정과 일치하는지 확인하세요
- 저장소 접근 권한이 있는지 확인하세요

### 토큰 만료
- 토큰이 만료되면 자동으로 재로그인을 요청합니다
- 로그아웃 후 다시 로그인하세요

## 개발 모드

현재는 Mock 데이터를 사용하여 OAuth 플로우를 테스트할 수 있습니다. 실제 Git API 연동을 위해서는 위의 설정을 완료하고 환경변수를 설정하세요.
