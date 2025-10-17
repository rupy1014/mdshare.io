---
title: "인증 API 엔드포인트"
description: "사용자 인증 및 토큰 관리 API"
author: "백엔드팀"
category: "api-reference"
tags: ["authentication", "jwt", "security", "api"]
difficulty: "intermediate"
createdAt: "2024-01-05T00:00:00Z"
updatedAt: "2024-01-12T10:15:00Z"
version: "2.1.0"
status: "published"
related: ["docs/api/user-management.md", "docs/security/authentication.md"]
estimatedTime: "8분"
---

# 인증 API 엔드포인트

사용자 인증, 토큰 관리, 세션 처리를 위한 API 엔드포인트들입니다.

## 🔐 기본 인증

### POST /auth/login
사용자 로그인을 처리합니다.

**요청:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "rememberMe": false
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "user",
      "permissions": ["read:profile", "write:orders"]
    }
  }
}
```

**에러 응답:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다.",
    "details": {
      "attempts": 2,
      "maxAttempts": 5,
      "lockoutTime": null
    }
  }
}
```

### POST /auth/refresh
액세스 토큰을 갱신합니다.

**요청:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### POST /auth/logout
사용자 로그아웃을 처리합니다.

**요청:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**응답:**
```json
{
  "success": true,
  "message": "로그아웃이 완료되었습니다."
}
```

### GET /auth/me
현재 인증된 사용자 정보를 조회합니다.

**헤더:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**응답:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user",
    "permissions": ["read:profile", "write:orders"],
    "lastLoginAt": "2024-01-15T09:30:00Z",
    "profile": {
      "avatar": "https://cdn.example.com/avatars/user123.jpg",
      "phone": "+82-10-1234-5678",
      "department": "개발팀"
    }
  }
}
```

## 🔑 API 키 인증

### POST /auth/api-key
API 키를 생성합니다. (관리자만 가능)

**요청:**
```json
{
  "name": "모바일 앱",
  "permissions": ["read:users", "write:orders"],
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "apiKey": "ak_live_1234567890abcdef",
    "keyId": "key_abc123",
    "name": "모바일 앱",
    "permissions": ["read:users", "write:orders"],
    "createdAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

### GET /auth/api-keys
생성된 API 키 목록을 조회합니다.

**응답:**
```json
{
  "success": true,
  "data": {
    "keys": [
      {
        "keyId": "key_abc123",
        "name": "모바일 앱",
        "permissions": ["read:users", "write:orders"],
        "createdAt": "2024-01-15T10:30:00Z",
        "expiresAt": "2024-12-31T23:59:59Z",
        "lastUsedAt": "2024-01-15T11:45:00Z",
        "status": "active"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "hasNext": false
    }
  }
}
```

### DELETE /auth/api-keys/:keyId
API 키를 삭제합니다.

**응답:**
```json
{
  "success": true,
  "message": "API 키가 삭제되었습니다."
}
```

## 🔒 OAuth 2.0

### GET /auth/oauth/:provider
OAuth 제공자로 리디렉션합니다.

**지원 제공자:**
- `google`
- `github`
- `microsoft`

**응답:** 302 리디렉션

### GET /auth/oauth/:provider/callback
OAuth 콜백을 처리합니다.

**쿼리 파라미터:**
- `code`: OAuth 인증 코드
- `state`: CSRF 방지를 위한 상태 토큰

**응답:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "홍길동",
      "provider": "google"
    }
  }
}
```

## 📊 인증 통계

### GET /auth/stats
인증 관련 통계를 조회합니다. (관리자만 가능)

**응답:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 890,
    "loginAttempts": {
      "today": 245,
      "thisWeek": 1680,
      "failedAttempts": 23
    },
    "tokenStats": {
      "activeTokens": 890,
      "expiredTokens": 156,
      "refreshRate": 0.85
    },
    "security": {
      "lockoutsToday": 2,
      "suspiciousActivities": 0
    }
  }
}
```

## 🚨 에러 코드

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `INVALID_CREDENTIALS` | 401 | 잘못된 인증 정보 |
| `TOKEN_EXPIRED` | 401 | 토큰 만료 |
| `TOKEN_INVALID` | 401 | 유효하지 않은 토큰 |
| `ACCOUNT_LOCKED` | 423 | 계정 잠김 |
| `ACCOUNT_DISABLED` | 403 | 비활성화된 계정 |
| `PERMISSION_DENIED` | 403 | 권한 없음 |
| `RATE_LIMIT_EXCEEDED` | 429 | 요청 한도 초과 |
| `INVALID_API_KEY` | 401 | 유효하지 않은 API 키 |

## 🔧 설정

### 환경 변수
```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_EXPIRES_IN=604800
OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
OAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_ATTEMPTS=5
```

### 보안 정책
- **비밀번호 정책**: 최소 8자, 대소문자, 숫자, 특수문자 포함
- **토큰 만료**: 액세스 토큰 1시간, 리프레시 토큰 7일
- **Rate Limiting**: IP당 분당 60회 요청 제한
- **계정 잠금**: 5회 실패 시 15분 잠금

## 🧪 테스트 예시

### cURL 예시
```bash
# 로그인
curl -X POST https://api-internal.company.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'

# 사용자 정보 조회
curl -X GET https://api-internal.company.com/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# API 키로 인증
curl -X GET https://api-internal.company.com/users \
  -H "X-API-Key: ak_live_1234567890abcdef"
```

### JavaScript 예시
```javascript
// 로그인
const login = async (email, password) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
  }
  return data;
};

// 토큰 갱신
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch('/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
  }
  return data;
};
```

---

**보안 주의사항**: 
- 모든 인증 관련 API는 HTTPS를 통해 호출해야 합니다
- 토큰은 안전하게 저장하고 전송해야 합니다
- API 키는 정기적으로 로테이션하는 것을 권장합니다
