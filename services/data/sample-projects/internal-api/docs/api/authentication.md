---
title: "JWT 인증 가이드"
description: "Internal API의 JWT 기반 인증 시스템"
author: "API Team"
category: "api-documentation"
tags: ["authentication", "jwt", "security", "api"]
difficulty: "intermediate"
createdAt: "2024-01-01T00:00:00Z"
updatedAt: "2024-01-15T10:30:00Z"
version: "1.0.0"
status: "published"
---

# JWT 인증 가이드

Internal API는 JWT (JSON Web Token) 기반 인증 시스템을 사용합니다.

## 🔐 인증 개요

### JWT 토큰 구조
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user123",
    "iat": 1640995200,
    "exp": 1641081600,
    "role": "user",
    "permissions": ["read", "write"]
  }
}
```

### 토큰 타입
- **Access Token**: API 접근용 (15분 만료)
- **Refresh Token**: 토큰 갱신용 (7일 만료)

## 🚀 인증 플로우

### 1. 로그인
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "홍길동",
      "role": "user"
    }
  }
}
```

### 2. 토큰 갱신
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. API 요청
```http
GET /api/v1/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔑 권한 관리

### 역할 기반 접근 제어 (RBAC)

#### 역할 정의
```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest'
}
```

#### 권한 정의
```typescript
enum Permission {
  // 사용자 관리
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',
  
  // 주문 관리
  ORDER_READ = 'order:read',
  ORDER_WRITE = 'order:write',
  ORDER_DELETE = 'order:delete',
  
  // 상품 관리
  PRODUCT_READ = 'product:read',
  PRODUCT_WRITE = 'product:write',
  PRODUCT_DELETE = 'product:delete'
}
```

#### 역할별 권한
```typescript
const rolePermissions = {
  [UserRole.SUPER_ADMIN]: ['*'], // 모든 권한
  [UserRole.ADMIN]: [
    Permission.USER_READ,
    Permission.USER_WRITE,
    Permission.ORDER_READ,
    Permission.ORDER_WRITE,
    Permission.PRODUCT_READ,
    Permission.PRODUCT_WRITE
  ],
  [UserRole.MODERATOR]: [
    Permission.USER_READ,
    Permission.ORDER_READ,
    Permission.ORDER_WRITE,
    Permission.PRODUCT_READ
  ],
  [UserRole.USER]: [
    Permission.USER_READ, // 자신의 정보만
    Permission.ORDER_READ, // 자신의 주문만
    Permission.ORDER_WRITE,
    Permission.PRODUCT_READ
  ],
  [UserRole.GUEST]: [
    Permission.PRODUCT_READ
  ]
};
```

## 🛡️ 보안 정책

### 토큰 보안
- **서명 알고리즘**: HS256
- **만료 시간**: Access Token 15분, Refresh Token 7일
- **토큰 크기**: 최대 4KB
- **재사용 방지**: 토큰 블랙리스트 관리

### 요청 보안
- **HTTPS 필수**: 모든 API 요청은 HTTPS 사용
- **CORS 설정**: 허용된 도메인에서만 요청 가능
- **Rate Limiting**: IP당 1000 req/hour
- **입력 검증**: 모든 입력값 검증 및 필터링

### 세션 관리
- **동시 세션**: 사용자당 최대 3개 세션
- **자동 만료**: 30분 비활성 시 자동 로그아웃
- **강제 로그아웃**: 관리자가 강제 로그아웃 가능

## 🔧 구현 예시

### Node.js/Express 미들웨어
```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions
    };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.user.permissions.includes(permission) && !req.user.permissions.includes('*')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

### 사용 예시
```typescript
// 인증이 필요한 엔드포인트
app.get('/api/v1/users/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// 특정 권한이 필요한 엔드포인트
app.delete('/api/v1/users/:id', 
  authenticateToken, 
  requirePermission('user:delete'),
  (req: AuthRequest, res: Response) => {
    // 사용자 삭제 로직
  }
);
```

## 📊 모니터링

### 인증 관련 메트릭
- **로그인 성공률**: 99.5%
- **토큰 검증 시간**: 평균 5ms
- **인증 실패율**: 0.5%
- **동시 세션 수**: 평균 150개

### 보안 이벤트
- **로그인 실패**: 5회 연속 실패 시 계정 잠금
- **비정상 접근**: 다른 지역에서의 접근 시 알림
- **토큰 재사용**: 동일 토큰의 중복 사용 감지

## 🚨 에러 처리

### 일반적인 에러 코드
```json
{
  "error": {
    "code": "AUTH_ERROR",
    "message": "Authentication failed",
    "details": {
      "reason": "Invalid token",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 에러 코드 목록
- **401 Unauthorized**: 토큰 없음 또는 만료
- **403 Forbidden**: 권한 부족
- **429 Too Many Requests**: Rate limit 초과
- **500 Internal Server Error**: 서버 오류

## 🔄 토큰 갱신 전략

### 자동 갱신
```typescript
class TokenManager {
  private refreshPromise: Promise<string> | null = null;

  async getValidToken(): Promise<string> {
    const token = localStorage.getItem('accessToken');
    
    if (this.isTokenExpired(token)) {
      return await this.refreshToken();
    }
    
    return token;
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return await this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();
    const newToken = await this.refreshPromise;
    this.refreshPromise = null;
    
    return newToken;
  }

  private async performRefresh(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      // 리프레시 토큰도 만료된 경우 로그아웃
      this.logout();
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    
    return data.accessToken;
  }
}
```

---

**중요**: JWT 토큰은 민감한 정보를 포함하지 않도록 주의하고, 정기적으로 보안 감사를 실시해야 합니다.
