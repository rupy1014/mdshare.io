# 접근 제어 및 공유 시스템

## 🔐 개요

Notion의 Share/Public 모드와 유사한 유연한 접근 제어 시스템을 제공합니다. 프로젝트 소유자가 간단하게 공개 범위와 권한을 설정할 수 있습니다.

## 🌐 공개 범위 설정

### 1. Private (비공개)

**설명:** 초대된 멤버만 접근 가능

**사용 시나리오:**
- 내부 팀 위키
- 기밀 문서
- 프로젝트 초기 단계

**설정:**
```
프로젝트 설정 > Access Control > Visibility: Private
```

**접근 방법:**
- 초대 링크를 통한 가입
- 이메일 초대
- 멤버 목록에 직접 추가

### 2. Public - 제한적 공개

**설명:** 링크를 아는 사람은 누구나 접근 가능 (Notion의 "Share to web"과 유사)

**사용 시나리오:**
- 스터디 자료 공유
- 강의 노트 배포
- 오픈소스 프로젝트 문서

**설정:**
```
프로젝트 설정 > Access Control > Visibility: Public (Link)
```

**접근 방법:**
- 공유 링크를 통한 즉시 접근
- 로그인 불필요 (선택적)
- 검색 엔진 노출 안 됨

**옵션:**
- Allow anonymous access (로그인 없이 읽기)
- Require account (계정 필요, 읽기 전용)
- Allow search engines (검색 엔진 인덱싱)

### 3. Public - 완전 공개

**설명:** 누구나 접근 가능하며, 검색 엔진에도 노출

**사용 시나리오:**
- 기술 블로그
- 공개 튜토리얼
- API 문서
- 제품 문서

**설정:**
```
프로젝트 설정 > Access Control > Visibility: Public (Web)
```

**접근 방법:**
- 직접 URL 접근
- 검색 엔진을 통한 발견
- 소셜 미디어 공유

**SEO 최적화:**
- Open Graph 태그 자동 생성
- Sitemap.xml 제공
- 구조화된 데이터 (Schema.org)

## 👥 초대 시스템

### 초대 방법 1: 초대 링크

**특징:**
- 한 번의 클릭으로 간편 초대
- 만료 기간 설정 가능
- 사용 횟수 제한 가능

**생성 방법:**
```
프로젝트 설정 > Members > Generate Invite Link
```

**옵션:**
```yaml
설정 가능한 항목:
  - 만료 기간: 24시간, 7일, 30일, 무제한
  - 사용 횟수: 1회, 10회, 100회, 무제한
  - 기본 권한: Viewer, Editor, Admin
```

**사용 예시:**
```
https://mdshare.io/invite/abc123xyz
→ 링크 클릭 시 자동으로 프로젝트 멤버 추가
→ 설정된 권한으로 즉시 접근 가능
```

### 초대 방법 2: 이메일 초대

**특징:**
- 이메일 주소로 직접 초대
- 개인화된 초대 메시지
- 권한 설정 가능

**초대 방법:**
```
프로젝트 설정 > Members > Invite by Email
→ 이메일 주소 입력
→ 권한 선택 (Viewer/Editor/Admin)
→ 초대 메시지 작성 (선택)
→ Send Invitation
```

**이메일 내용:**
```
[프로젝트 소유자]님이 [프로젝트 이름]에 초대했습니다.

[초대 메시지]

[Accept Invitation] 버튼
```

### 초대 방법 3: 도메인 기반 자동 초대

**특징 (Enterprise):**
- 특정 도메인 이메일 자동 승인
- 조직 전체 공유 간편화

**설정:**
```
프로젝트 설정 > Members > Domain-based Access
→ 허용 도메인: @company.com
→ 기본 권한: Viewer
```

**효과:**
```
@company.com 이메일로 가입한 사용자는
자동으로 프로젝트 접근 권한 획득
```

## 🎭 권한 관리

### 권한 레벨 (4단계)

#### 1. Guest (손님)
**접근:**
- Public 프로젝트만 읽기 가능
- 로그인 불필요

**권한:**
- ✅ 문서 읽기
- ❌ 다운로드 (제한 가능)
- ❌ 검색
- ❌ AI 챗봇 사용

#### 2. Viewer (뷰어)
**접근:**
- 초대받은 프로젝트 읽기
- 로그인 필요

**권한:**
- ✅ 문서 읽기
- ✅ 풀텍스트 검색
- ✅ 다운로드 (원본 MD, PDF)
- ✅ AI 챗봇 사용
- ❌ 편집
- ❌ 댓글 (Phase 3)

#### 3. Editor (편집자)
**접근:**
- 문서 편집 권한 (Phase 3)

**권한:**
- ✅ Viewer 권한 모두
- ✅ 문서 편집 (웹 에디터)
- ✅ 댓글 달기
- ✅ 파일 업로드
- ❌ 프로젝트 설정 변경
- ❌ 멤버 관리

#### 4. Admin (관리자)
**접근:**
- 프로젝트 전체 관리 권한

**권한:**
- ✅ Editor 권한 모두
- ✅ 프로젝트 설정 변경
- ✅ 멤버 초대/제거
- ✅ 권한 변경
- ✅ 프로젝트 삭제
- ✅ 접근 제어 설정

### 폴더/파일별 권한 (Phase 3)

**세부 권한 설정:**
```
프로젝트 구조:
docs/
├── public/          → 모든 사람 읽기
├── internal/        → 멤버만 읽기
└── confidential/    → Admin만 읽기
```

**설정 방법:**
```
파일/폴더 우클릭 > Permissions
→ Inherit from parent (상위 폴더 권한 상속)
→ Custom permissions (개별 설정)
  → Guest: Hidden
  → Viewer: Read-only
  → Editor: Read-only
  → Admin: Full access
```

## 🔗 공유 옵션 (Notion 스타일)

### 공유 설정 UI

**프로젝트 우측 상단 "Share" 버튼:**
```
┌─────────────────────────────────────────┐
│ Share "AI Study Project"                │
├─────────────────────────────────────────┤
│ 🌐 Web Access                           │
│ ○ Private - Only invited members        │
│ ● Public - Anyone with the link         │
│   ☑ Allow anonymous viewing             │
│   ☐ Allow search engines                │
│                                         │
│ 👥 Members (5)                          │
│ • john@example.com    [Admin] [⋮]      │
│ • jane@example.com    [Editor] [⋮]     │
│ • bob@example.com     [Viewer] [⋮]     │
│                                         │
│ [+ Invite people]                       │
│                                         │
│ 🔗 Invite Link                          │
│ https://mdshare.io/invite/abc123        │
│ Expires: 7 days · Max uses: Unlimited   │
│ [Copy Link] [Settings]                  │
│                                         │
│ [Done]                                  │
└─────────────────────────────────────────┘
```

### 페이지별 공유 (Phase 3)

**특정 페이지만 공유:**
```
문서 상단 "Share this page" 버튼
→ 해당 페이지만 접근 가능한 링크 생성
→ 프로젝트 전체는 비공개 유지
```

**사용 예시:**
```
프로젝트: Private
특정 페이지: Public

→ https://mdshare.io/project/docs/week1.md
→ 이 링크만 공유하면 week1.md만 접근 가능
→ 다른 페이지는 접근 불가
```

## 🛡️ 보안 기능

### 비밀번호 보호

**설정:**
```
프로젝트 설정 > Access Control > Password Protection
→ Require password for access
→ 비밀번호 입력: ********
```

**동작:**
```
Public 링크 접속 시
→ 비밀번호 입력 요구
→ 정확한 비밀번호 입력 시 접근 허용
```

### IP 화이트리스트 (Enterprise)

**설정:**
```
프로젝트 설정 > Access Control > IP Whitelist
→ 허용 IP 범위 입력
→ 예: 192.168.1.0/24, 10.0.0.1
```

**효과:**
```
허용된 IP 범위에서만 접근 가능
→ 외부 네트워크 차단
→ 기업 VPN 필수
```

### 다운로드 제한

**설정:**
```
프로젝트 설정 > Access Control > Download Options
☐ Allow download original markdown
☐ Allow PDF export
☐ Allow full project download
```

**Viewer별 제한:**
```
Guest: 모든 다운로드 불가
Viewer: 소유자 설정에 따름
Editor: 모든 다운로드 가능
Admin: 모든 다운로드 가능
```

## 📊 접근 분석

### 방문 통계

**제공 정보:**
- 총 방문자 수
- 순 방문자 수
- 페이지별 조회수
- 인기 페이지 순위
- 평균 체류 시간

**대시보드:**
```
프로젝트 설정 > Analytics
→ 일별/주별/월별 통계
→ 페이지별 인사이트
→ 검색어 순위
```

### 멤버 활동 로그 (Enterprise)

**추적 항목:**
- 로그인/로그아웃
- 페이지 접근
- 파일 다운로드
- 설정 변경
- 멤버 초대/제거

**감사 로그:**
```
프로젝트 설정 > Audit Log
→ 2025-10-17 14:30 - john@example.com - Viewed /docs/week1.md
→ 2025-10-17 14:25 - jane@example.com - Downloaded project.zip
→ 2025-10-17 14:20 - admin@example.com - Changed visibility to Public
```

## 비교: Notion vs 우리 서비스

| 기능 | Notion | MDShare |
|------|--------|---------|
| **공개 범위** | Private, Public | Private, Public (Link), Public (Web) |
| **초대 방법** | 이메일, 링크 | 이메일, 링크, 도메인 기반 |
| **권한 레벨** | 3단계 | 4단계 (Guest 포함) |
| **폴더별 권한** | ✅ | ✅ (Phase 3) |
| **페이지별 공유** | ✅ | ✅ (Phase 3) |
| **비밀번호 보호** | ❌ | ✅ |
| **IP 화이트리스트** | ❌ | ✅ (Enterprise) |
| **다운로드 제한** | 제한적 | 세밀한 제어 |
| **접근 분석** | 제한적 | 상세 분석 |
| **감사 로그** | ❌ | ✅ (Enterprise) |
