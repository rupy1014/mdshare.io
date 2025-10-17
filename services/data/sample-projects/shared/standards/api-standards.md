---
title: "API 표준"
description: "REST API 설계 및 개발 표준"
author: "아키텍처팀"
category: "standards"
tags: ["api", "rest", "standards", "design"]
difficulty: "intermediate"
createdAt: "2024-01-01T00:00:00Z"
updatedAt: "2024-01-15T10:30:00Z"
version: "2.1.0"
status: "published"
---

# API 표준

모든 REST API에서 준수해야 하는 설계 및 개발 표준입니다.

## 📋 기본 원칙

### 1. RESTful 설계
- HTTP 메서드의 의미에 맞게 사용
- 리소스 중심의 URL 설계
- 상태 코드의 적절한 활용
- 무상태(Stateless) 아키텍처

### 2. 일관성
- 모든 API에서 동일한 응답 형식
- 통일된 에러 처리 방식
- 일관된 네이밍 컨벤션

### 3. 확장성
- 버전 관리 전략
- 하위 호환성 고려
- 확장 가능한 응답 구조

## 🎯 URL 설계 규칙

### 1. 리소스 중심 설계
```http
# 좋은 예
GET    /api/v1/users              # 사용자 목록
GET    /api/v1/users/123          # 특정 사용자
POST   /api/v1/users              # 사용자 생성
PUT    /api/v1/users/123          # 사용자 전체 수정
PATCH  /api/v1/users/123          # 사용자 부분 수정
DELETE /api/v1/users/123          # 사용자 삭제

# 나쁜 예
GET    /api/v1/getUsers
POST   /api/v1/createUser
GET    /api/v1/userDetails?id=123
```

### 2. 계층 구조 표현
```http
# 중첩된 리소스
GET    /api/v1/users/123/orders           # 사용자의 주문 목록
GET    /api/v1/users/123/orders/456       # 특정 주문
POST   /api/v1/users/123/orders           # 새 주문 생성

# 쿼리 파라미터로 필터링
GET    /api/v1/users?role=admin&active=true
GET    /api/v1/orders?status=pending&limit=10&offset=20
```

### 3. 동작 표현
```http
# 리소스가 아닌 동작은 동사 사용
POST   /api/v1/users/123/activate         # 사용자 활성화
POST   /api/v1/orders/456/cancel          # 주문 취소
POST   /api/v1/files/upload               # 파일 업로드
```

## 📊 응답 형식 표준

### 1. 성공 응답
```json
{
  "success": true,
  "data": {
    // 실제 데이터
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "v1",
    "requestId": "req_123456789"
  }
}
```

### 2. 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": {
      "field": "email",
      "reason": "유효하지 않은 이메일 형식"
    },
    "requestId": "req_123456789"
  }
}
```

### 3. 페이지네이션 응답
```json
{
  "success": true,
  "data": {
    "items": [
      // 데이터 배열
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🔒 인증 및 권한

### 1. 인증 방식
```http
# Bearer Token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Key
X-API-Key: ak_live_1234567890abcdef

# Basic Auth (비추천, HTTPS 필수)
Authorization: Basic base64(username:password)
```

### 2. 권한 검증
```typescript
// 권한 체크 예시
function checkPermission(user: User, resource: string, action: string): boolean {
  const userPermissions = user.permissions;
  const requiredPermission = `${action}:${resource}`;
  
  return userPermissions.includes(requiredPermission) || 
         userPermissions.includes('admin:all');
}
```

## 📝 요청/응답 예시

### 사용자 관리 API

#### 사용자 목록 조회
```http
GET /api/v1/users?role=admin&limit=10&offset=0
Authorization: Bearer {token}
```

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "user_123",
        "email": "admin@example.com",
        "name": "관리자",
        "role": "admin",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### 사용자 생성
```http
POST /api/v1/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "새 사용자",
  "password": "securePassword123",
  "role": "user"
}
```

```json
{
  "success": true,
  "data": {
    "id": "user_456",
    "email": "newuser@example.com",
    "name": "새 사용자",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 사용자 수정
```http
PATCH /api/v1/users/user_456
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "수정된 사용자",
  "role": "editor"
}
```

```json
{
  "success": true,
  "data": {
    "id": "user_456",
    "email": "newuser@example.com",
    "name": "수정된 사용자",
    "role": "editor",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

## 🚨 에러 처리 표준

### 1. HTTP 상태 코드 사용
```http
200 OK          # 성공
201 Created     # 생성 성공
400 Bad Request # 잘못된 요청
401 Unauthorized # 인증 실패
403 Forbidden   # 권한 없음
404 Not Found   # 리소스 없음
409 Conflict    # 충돌 (중복 등)
422 Unprocessable Entity # 검증 실패
429 Too Many Requests    # Rate Limit 초과
500 Internal Server Error # 서버 에러
```

### 2. 에러 코드 체계
```
SYSTEM_ERRORS
├── VALIDATION_ERROR     # 입력값 검증 실패
├── AUTHENTICATION_ERROR # 인증 실패
├── AUTHORIZATION_ERROR  # 권한 없음
├── NOT_FOUND_ERROR     # 리소스 없음
├── CONFLICT_ERROR      # 충돌
├── RATE_LIMIT_ERROR    # 요청 한도 초과
└── INTERNAL_ERROR      # 내부 서버 에러

BUSINESS_ERRORS
├── USER_NOT_FOUND
├── EMAIL_ALREADY_EXISTS
├── INVALID_CREDENTIALS
├── ACCOUNT_LOCKED
└── INSUFFICIENT_PERMISSIONS
```

### 3. 에러 응답 예시
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": [
      {
        "field": "email",
        "message": "유효하지 않은 이메일 형식입니다."
      },
      {
        "field": "password",
        "message": "비밀번호는 최소 8자 이상이어야 합니다."
      }
    ],
    "requestId": "req_123456789"
  }
}
```

## 🔧 API 버전 관리

### 1. URL 버전 관리
```http
# URL에 버전 포함 (권장)
GET /api/v1/users
GET /api/v2/users

# Header에 버전 포함
GET /api/users
Accept: application/vnd.company.v1+json
```

### 2. 버전 호환성 정책
- **Major 버전**: 하위 호환성 깨지는 변경
- **Minor 버전**: 하위 호환성 유지하는 기능 추가
- **Patch 버전**: 버그 수정

### 3. Deprecation 정책
```http
# Deprecated API 응답
{
  "success": true,
  "data": { /* ... */ },
  "meta": {
    "deprecated": true,
    "deprecationDate": "2024-06-01T00:00:00Z",
    "sunsetDate": "2024-12-01T00:00:00Z",
    "alternatives": [
      {
        "version": "v2",
        "url": "/api/v2/users",
        "migrationGuide": "https://docs.company.com/migration/v1-to-v2"
      }
    ]
  }
}
```

## 🚀 성능 최적화

### 1. 캐싱 전략
```http
# 캐시 헤더 설정
Cache-Control: public, max-age=3600
ETag: "abc123"
Last-Modified: Wed, 15 Jan 2024 10:30:00 GMT

# 조건부 요청
If-None-Match: "abc123"
If-Modified-Since: Wed, 15 Jan 2024 10:30:00 GMT
```

### 2. 페이지네이션
```http
# Cursor 기반 페이지네이션 (권장)
GET /api/v1/users?cursor=eyJpZCI6IjEyMyJ9&limit=20

# Offset 기반 페이지네이션
GET /api/v1/users?offset=40&limit=20
```

### 3. 필드 선택
```http
# 필요한 필드만 요청
GET /api/v1/users?fields=id,name,email

# 중첩된 필드 선택
GET /api/v1/users?fields=id,name,profile.avatar,orders.id
```

## 🔒 보안 표준

### 1. 입력값 검증
```typescript
// 입력값 검증 예시
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100)
});

function validateUserInput(data: unknown): UserInput {
  return userSchema.parse(data);
}
```

### 2. Rate Limiting
```http
# Rate Limit 헤더
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### 3. CORS 설정
```typescript
// CORS 설정 예시
const corsOptions = {
  origin: ['https://app.company.com', 'https://admin.company.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true
};
```

## 📚 API 문서화

### 1. OpenAPI/Swagger 스펙
```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
  description: 사용자 관리 API

paths:
  /api/v1/users:
    get:
      summary: 사용자 목록 조회
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: 성공
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
```

### 2. 문서화 체크리스트
- [ ] API 엔드포인트 목록
- [ ] 요청/응답 예시
- [ ] 에러 코드 및 메시지
- [ ] 인증 방법
- [ ] Rate Limiting 정보
- [ ] 버전 정보

## 🧪 테스트 표준

### 1. 단위 테스트
```typescript
describe('UserService', () => {
  it('should create user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123'
    };
    
    const result = await userService.createUser(userData);
    
    expect(result.success).toBe(true);
    expect(result.data.email).toBe(userData.email);
  });
});
```

### 2. 통합 테스트
```typescript
describe('POST /api/v1/users', () => {
  it('should create user with valid data', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

---

**중요**: 이 표준은 모든 API에서 준수해야 하는 최소 기준입니다. 프로젝트별 특성에 맞게 추가 규칙을 정의할 수 있지만, 기본 원칙과 충돌해서는 안 됩니다.
