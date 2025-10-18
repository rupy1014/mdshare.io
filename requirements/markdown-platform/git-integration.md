# Git 연동 시스템

## 개요

MDShare 플랫폼에 Git 저장소 연동 기능을 추가하여 실제 Git 저장소의 마크다운 문서를 읽고 편집할 수 있는 시스템을 구현합니다. 사용자는 Git 저장소의 문서를 온라인에서 편집하고, 안전한 브랜치 기반 워크플로우를 통해 변경사항을 관리할 수 있습니다.

## 핵심 개념

### 브랜치 기반 편집 시스템
- **자동 브랜치 생성**: 편집 시작 시 `feature/edit-{timestamp}-{userId}` 형태의 임시 브랜치 자동 생성
- **임시 브랜치 편집**: 모든 편집 작업은 임시 브랜치에서 수행
- **수동 푸시**: 사용자가 명시적으로 푸시 버튼을 클릭해야만 main 브랜치로 머지
- **자동 정리**: 머지 완료 후 임시 브랜치 자동 삭제

### 안전한 편집 워크플로우
1. **편집 시작** → 임시 브랜치 생성
2. **문서 편집** → 임시 브랜치에 자동 커밋
3. **수동 푸시** → main 브랜치로 머지 및 정리

## 기능 요구사항

### 1. Git 저장소 연결

#### 1.1 지원 플랫폼
- GitHub
- GitLab
- Bitbucket
- 로컬 Git 저장소

#### 1.2 인증 방식
- **GitHub/GitLab**: Personal Access Token
- **SSH**: SSH 키 기반 인증
- **HTTPS**: 사용자명/비밀번호 (비권장)

#### 1.3 저장소 설정
```typescript
interface GitRepositoryConfig {
  id: string
  name: string
  type: 'github' | 'gitlab' | 'bitbucket' | 'local'
  url: string
  defaultBranch: string
  accessToken?: string
  sshKey?: string
  localPath?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}
```

### 2. 파일 시스템 읽기

#### 2.1 저장소 동기화
- 저장소 클론/업데이트
- 브랜치 목록 조회
- 파일 트리 구조 파싱
- 마크다운 파일 자동 감지

#### 2.2 문서 탐색
- 폴더 트리 네비게이션
- 파일 검색 기능
- 최근 문서 목록
- 즐겨찾기 기능

#### 2.3 파일 읽기
- 마크다운 파일 내용 읽기
- 이미지 및 에셋 파일 처리
- 상대 경로 링크 해석
- Frontmatter 파싱

### 3. 편집 세션 관리

#### 3.1 편집 세션 생성
```typescript
interface EditSession {
  id: string
  userId: string
  repositoryId: string
  branchName: string
  originalBranch: string
  startTime: Date
  lastEditTime: Date
  status: 'editing' | 'ready-to-merge' | 'merged' | 'abandoned'
  editedFiles: string[]
  commitCount: number
}
```

#### 3.2 브랜치 관리
- 고유한 브랜치명 생성 (`feature/edit-{timestamp}-{userId}`)
- 브랜치 중복 방지
- 브랜치 존재 여부 확인
- 브랜치 삭제 및 정리

#### 3.3 편집 상태 추적
- 실시간 편집 상태 표시
- 변경사항 자동 감지
- 편집 세션 타임아웃 관리
- 세션 복구 기능

### 4. 문서 편집

#### 4.1 온라인 에디터
- 기존 마크다운 에디터 활용
- 실시간 미리보기
- 문법 하이라이팅
- 자동 저장 기능

#### 4.2 변경사항 관리
- 파일별 변경사항 추적
- 변경된 내용 하이라이팅
- 변경사항 되돌리기
- 편집 히스토리

#### 4.3 자동 커밋
- 편집 내용 임시 브랜치에 자동 커밋
- 커밋 메시지 자동 생성
- 커밋 주기 설정 (사용자 설정 가능)
- 부분 저장 기능

### 5. 동기화 및 머지

#### 5.1 충돌 감지
- main 브랜치와의 차이점 분석
- 충돌 파일 자동 감지
- 충돌 해결 가이드 제공
- 3-way 머지 지원

#### 5.2 머지 프로세스
- 변경사항 미리보기
- 커밋 메시지 입력
- 머지 실행
- 결과 확인

#### 5.3 정리 작업
- 임시 브랜치 삭제
- 편집 세션 완료 처리
- 캐시 정리
- 로그 기록

### 6. 사용자 인터페이스

#### 6.1 저장소 관리
- 저장소 목록 및 추가
- 저장소 설정 수정
- 저장소 연결 상태 표시
- 저장소 삭제

#### 6.2 편집 인터페이스
- 편집 상태 표시기
- 브랜치 정보 표시
- 변경사항 요약
- 푸시 버튼

#### 6.3 상태 표시
- 실시간 동기화 상태
- 편집 세션 정보
- 충돌 경고
- 성공/실패 알림

## 기술 구현

### 백엔드 API

#### Git 연동 API
```typescript
// 저장소 관리
POST   /api/git/repositories          // 저장소 연결
GET    /api/git/repositories          // 저장소 목록
PUT    /api/git/repositories/:id      // 저장소 설정 수정
DELETE /api/git/repositories/:id      // 저장소 삭제

// 파일 시스템
GET    /api/git/repositories/:id/tree // 파일 트리 조회
GET    /api/git/repositories/:id/file // 파일 내용 읽기
POST   /api/git/repositories/:id/sync // 저장소 동기화

// 편집 세션
POST   /api/git/sessions              // 편집 세션 시작
GET    /api/git/sessions/:id          // 편집 세션 조회
PUT    /api/git/sessions/:id          // 편집 세션 업데이트
DELETE /api/git/sessions/:id          // 편집 세션 종료

// 문서 편집
PUT    /api/git/sessions/:id/files    // 파일 편집 저장
POST   /api/git/sessions/:id/commit   // 변경사항 커밋
POST   /api/git/sessions/:id/merge    // 메인 브랜치로 머지
```

### 프론트엔드 컴포넌트

#### Git 저장소 관리
```typescript
// GitRepositoryManager.tsx
- 저장소 연결 폼
- 저장소 목록 표시
- 연결 상태 모니터링
- 설정 관리

// GitFileTree.tsx
- 파일 트리 네비게이션
- 파일 타입 아이콘
- 폴더 접기/펼치기
- 검색 기능

// GitEditSession.tsx
- 편집 세션 상태 표시
- 브랜치 정보
- 변경사항 요약
- 푸시 컨트롤
```

### 데이터베이스 스키마

#### 저장소 정보
```sql
CREATE TABLE git_repositories (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('github', 'gitlab', 'bitbucket', 'local') NOT NULL,
  url VARCHAR(500) NOT NULL,
  default_branch VARCHAR(100) DEFAULT 'main',
  access_token TEXT,
  ssh_key TEXT,
  local_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 편집 세션
```sql
CREATE TABLE git_edit_sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  repository_id VARCHAR(36) NOT NULL,
  branch_name VARCHAR(255) NOT NULL,
  original_branch VARCHAR(100) NOT NULL,
  status ENUM('editing', 'ready-to-merge', 'merged', 'abandoned') DEFAULT 'editing',
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_edit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edited_files JSON,
  commit_count INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (repository_id) REFERENCES git_repositories(id)
);
```

## 보안 및 안전장치

### 1. 인증 보안
- 토큰 암호화 저장
- SSH 키 안전 관리
- API 요청 제한
- 접근 권한 검증

### 2. 데이터 보호
- 편집 세션 격리
- 브랜치 충돌 방지
- 자동 백업
- 복구 메커니즘

### 3. 오류 처리
- 네트워크 오류 복구
- Git 명령 실패 처리
- 충돌 해결 가이드
- 세션 복구 기능

## 성능 최적화

### 1. 캐싱 전략
- 파일 내용 캐싱
- 메타데이터 캐싱
- 브랜치 정보 캐싱
- 사용자 설정 캐싱

### 2. 동기화 최적화
- 증분 동기화
- 백그라운드 업데이트
- 변경사항 배치 처리
- 지연 로딩

### 3. 리소스 관리
- 메모리 사용량 모니터링
- 디스크 공간 관리
- 세션 정리
- 가비지 컬렉션

## 사용자 경험

### 1. 직관적인 워크플로우
- 원클릭 편집 시작
- 시각적 상태 표시
- 간단한 푸시 프로세스
- 명확한 피드백

### 2. 오류 복구
- 편집 중단 시 복구
- 충돌 해결 가이드
- 세션 복원
- 백업 및 롤백

### 3. 협업 지원
- 동시 편집 방지
- 편집 상태 공유
- 변경사항 알림
- 히스토리 추적

## 구현 우선순위

### Phase 1: 기본 기능 (4주)
1. GitHub API 연동
2. 저장소 연결 및 파일 읽기
3. 기본 편집 세션 관리
4. 간단한 브랜치 생성

### Phase 2: 편집 시스템 (3주)
1. 온라인 에디터 통합
2. 자동 커밋 시스템
3. 변경사항 추적
4. 편집 상태 UI

### Phase 3: 동기화 및 머지 (3주)
1. 충돌 감지 및 해결
2. 머지 프로세스
3. 브랜치 정리
4. 오류 처리

### Phase 4: 고급 기능 (2주)
1. GitLab/Bitbucket 지원
2. 성능 최적화
3. 고급 협업 기능
4. 모니터링 및 로깅

## 성공 지표

### 기술적 지표
- 저장소 연결 성공률 > 99%
- 편집 세션 안정성 > 99.5%
- 머지 성공률 > 95%
- 평균 응답 시간 < 2초

### 사용자 지표
- 편집 세션 완료율 > 80%
- 사용자 만족도 > 4.5/5
- 기능 사용률 > 70%
- 지원 요청 감소 > 50%

## 위험 요소 및 대응 방안

### 1. Git API 제한
- **위험**: GitHub API 속도 제한
- **대응**: 요청 최적화, 캐싱, 배치 처리

### 2. 충돌 상황
- **위험**: 동시 편집 시 충돌
- **대응**: 실시간 충돌 감지, 사용자 알림

### 3. 네트워크 불안정
- **위험**: 연결 끊김 시 데이터 손실
- **대응**: 로컬 캐싱, 자동 재시도, 복구 메커니즘

### 4. 보안 취약점
- **위험**: 토큰 유출, 권한 오남용
- **대응**: 암호화, 권한 검증, 감사 로그

이 Git 연동 시스템을 통해 MDShare는 실제 Git 워크플로우와 완전히 통합된 강력한 문서 관리 플랫폼이 될 것입니다.
