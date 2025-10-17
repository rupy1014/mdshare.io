---
title: "코딩 표준"
description: "모든 프로젝트에서 준수해야 하는 코딩 표준"
author: "아키텍처팀"
category: "standards"
tags: ["coding", "standards", "best-practices", "guidelines"]
difficulty: "intermediate"
createdAt: "2024-01-01T00:00:00Z"
updatedAt: "2024-01-15T10:30:00Z"
version: "2.0.0"
status: "published"
---

# 코딩 표준

모든 프로젝트에서 일관된 코드 품질을 보장하기 위한 코딩 표준입니다.

## 📋 일반 원칙

### 1. 가독성 우선
- 코드는 사람이 읽기 쉬워야 합니다
- 명확하고 의미 있는 변수명과 함수명 사용
- 복잡한 로직은 주석으로 설명

### 2. 일관성 유지
- 팀 내 동일한 코딩 스타일 적용
- 기존 코드베이스와의 일관성 유지
- 프로젝트별 스타일 가이드 준수

### 3. 단순성 추구
- 복잡한 로직보다 단순하고 명확한 코드
- 불필요한 추상화 지양
- 이해하기 쉬운 구조

## 🎯 언어별 표준

### JavaScript/TypeScript

#### 네이밍 컨벤션
```javascript
// 변수명: camelCase
const userName = 'john_doe';
const isAuthenticated = true;

// 함수명: camelCase, 동사로 시작
function getUserInfo() { }
function validateEmail() { }
function calculateTotal() { }

// 클래스명: PascalCase
class UserService { }
class PaymentProcessor { }

// 상수: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// 인터페이스/타입: PascalCase, I 접두사 (선택적)
interface UserInfo { }
type ApiResponse<T> = { }
```

#### 함수 작성 규칙
```typescript
// 좋은 예
function calculateOrderTotal(items: OrderItem[]): number {
  if (!items || items.length === 0) {
    return 0;
  }
  
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

// 나쁜 예
function calc(items: any): any {
  let t = 0;
  for (let i = 0; i < items.length; i++) {
    t += items[i].p * items[i].q;
  }
  return t;
}
```

#### 에러 처리
```typescript
// 좋은 예
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error.status === 404) {
      throw new UserNotFoundError(`User with id ${id} not found`);
    }
    throw new ApiError('Failed to fetch user', error);
  }
}

// 나쁜 예
async function fetchUser(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data; // 에러 처리 없음
}
```

### Python

#### 네이밍 컨벤션
```python
# 변수명/함수명: snake_case
user_name = "john_doe"
is_authenticated = True

def get_user_info():
    pass

def validate_email():
    pass

# 클래스명: PascalCase
class UserService:
    pass

# 상수: UPPER_SNAKE_CASE
API_BASE_URL = "https://api.example.com"
MAX_RETRY_ATTEMPTS = 3
```

#### 함수 작성 규칙
```python
# 좋은 예
def calculate_order_total(items: List[OrderItem]) -> float:
    """
    주문 아이템들의 총 금액을 계산합니다.
    
    Args:
        items: 주문 아이템 리스트
        
    Returns:
        계산된 총 금액
        
    Raises:
        ValueError: 아이템 리스트가 비어있을 때
    """
    if not items:
        raise ValueError("Items list cannot be empty")
    
    return sum(item.price * item.quantity for item in items)

# 나쁜 예
def calc(items):
    t = 0
    for i in items:
        t += i.p * i.q
    return t
```

### Java

#### 네이밍 컨벤션
```java
// 변수명/메서드명: camelCase
String userName = "john_doe";
boolean isAuthenticated = true;

public void getUserInfo() { }
public boolean validateEmail() { }

// 클래스명: PascalCase
public class UserService { }
public class PaymentProcessor { }

// 상수: UPPER_SNAKE_CASE
public static final String API_BASE_URL = "https://api.example.com";
public static final int MAX_RETRY_ATTEMPTS = 3;
```

## 📝 주석 작성 규칙

### 1. 함수/메서드 주석
```typescript
/**
 * 사용자 인증을 처리합니다.
 * 
 * @param email - 사용자 이메일
 * @param password - 사용자 비밀번호
 * @param rememberMe - 로그인 상태 유지 여부
 * @returns 인증 결과와 토큰 정보
 * @throws AuthenticationError 인증 실패 시
 * @throws ValidationError 입력값 검증 실패 시
 */
async function authenticateUser(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<AuthResult> {
  // 구현...
}
```

### 2. 복잡한 로직 주석
```typescript
function calculateTax(amount: number, region: string): number {
  // 세율 계산 로직
  // 1. 기본 세율 조회
  // 2. 지역별 할인율 적용
  // 3. 최종 세금 계산
  
  const baseRate = getBaseTaxRate(region);
  const discountRate = getRegionalDiscount(region);
  
  // 할인율 적용 후 세금 계산
  const adjustedRate = baseRate * (1 - discountRate);
  return amount * adjustedRate;
}
```

### 3. TODO 주석
```typescript
// TODO: 2024-02-01 - 캐싱 로직 추가 필요
// FIXME: 메모리 누수 가능성 있음, 리팩토링 필요
// HACK: 임시 해결책, 향후 개선 필요
```

## 🔍 코드 리뷰 체크리스트

### 필수 체크 항목
- [ ] 코딩 표준 준수
- [ ] 의미 있는 변수/함수명 사용
- [ ] 적절한 주석 작성
- [ ] 에러 처리 구현
- [ ] 테스트 코드 작성
- [ ] 성능 고려사항 검토
- [ ] 보안 취약점 검토

### 권장 체크 항목
- [ ] 코드 중복 제거
- [ ] 함수 크기 적절성 (50줄 이하 권장)
- [ ] 매직 넘버 상수화
- [ ] 타입 안정성 확인
- [ ] 로깅 적절성

## 🛠️ 도구 및 설정

### ESLint 설정 (JavaScript/TypeScript)
```json
{
  "extends": [
    "@company/eslint-config",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "camelcase": "error",
    "no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

### Prettier 설정
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Pre-commit 훅
```bash
#!/bin/sh
# pre-commit 훅 예시
npm run lint
npm run test
npm run type-check
```

## 📊 코드 품질 지표

### 목표 지표
- **코드 커버리지**: 80% 이상
- **복잡도**: 순환 복잡도 10 이하
- **중복률**: 5% 이하
- **테스트 통과율**: 100%

### 모니터링 도구
- **SonarQube**: 코드 품질 분석
- **CodeClimate**: 코드 복잡도 분석
- **Coveralls**: 코드 커버리지 분석

## 🔄 리팩토링 가이드

### 리팩토링이 필요한 경우
1. 함수가 50줄을 초과하는 경우
2. 중복 코드가 3회 이상 반복되는 경우
3. 복잡도가 높아 이해하기 어려운 경우
4. 성능상 문제가 있는 경우

### 리팩토링 원칙
1. 테스트 코드 먼저 작성
2. 작은 단위로 점진적 개선
3. 기능 변경 없이 구조만 개선
4. 리뷰 후 적용

## 📚 참고 자료

- [Clean Code - Robert Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [TypeScript Style Guide](https://typescript-eslint.io/rules/)
- [Python PEP 8](https://pep8.org/)

---

**중요**: 이 표준은 모든 프로젝트에서 준수해야 하는 최소 기준입니다. 프로젝트별로 추가적인 규칙을 정의할 수 있지만, 이 표준과 충돌해서는 안 됩니다.
