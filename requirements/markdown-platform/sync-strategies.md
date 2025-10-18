# Private Git 환경에서의 문서 동기화 전략

## 📋 문서 개요

Private Git 저장소를 사용하는 상황에서 MDShare 웹 서비스와 로컬 환경 간의 문서 동기화 방법을 제안합니다.

---

## 🎯 문제 상황

### 현재 제약사항
- **Private Git 저장소**: 직접 API 접근 불가
- **보안 요구사항**: 민감한 코드/문서의 외부 노출 금지
- **동기화 필요**: 웹에서 편집 ↔ 로컬에서 편집
- **충돌 방지**: 동시 편집 시 데이터 손실 방지

---

## 🔄 동기화 방법론

### 1. **Git Clone + Manual Sync** (가장 간단)

#### 워크플로우
```
1. 사용자가 Git 저장소 클론
2. 웹에서 문서 편집 후 다운로드 링크 제공
3. 사용자가 수동으로 로컬 파일 교체
4. 로컬에서 변경사항 커밋
```

#### 장점
- 구현이 간단함
- 보안이 가장 안전함
- 기존 Git 워크플로우 유지

#### 단점
- 수동 작업 필요
- 실시간 동기화 불가
- 충돌 해결 어려움

#### 구현 방법
```typescript
// 웹에서 편집된 문서 다운로드 API
GET /api/export/document/{id}?format=markdown

// 사용자 가이드
1. 웹에서 문서 편집
2. "다운로드" 버튼 클릭
3. 로컬 파일 교체
4. git add, commit, push
```

### 2. **Webhook + Git Integration** (중간 복잡도)

#### 워크플로우
```
1. 사용자가 웹에서 편집
2. MDShare가 임시 브랜치에 커밋
3. 사용자의 로컬에서 git pull
4. 충돌 발생 시 수동 해결
```

#### 장점
- 부분적 자동화
- Git 히스토리 유지
- 충돌 감지 가능

#### 단점
- 임시 저장소 필요
- 복잡한 설정 필요
- 여전히 수동 작업 포함

#### 구현 방법
```typescript
// 1. 사용자 인증 후 임시 저장소 생성
POST /api/sync/setup
{
  "gitUrl": "https://github.com/user/repo.git",
  "authToken": "user-provided-token"
}

// 2. 문서 편집 시 자동 커밋
POST /api/sync/commit
{
  "documentId": "doc-123",
  "content": "updated content",
  "message": "Updated via MDShare"
}
```

### 3. **File-based Sync with Checksums** (권장)

#### 워크플로우
```
1. 사용자가 초기 문서 업로드
2. MDShare가 체크섬 기반 변경 감지
3. 웹/로컬 편집 시 변경사항 추적
4. 동기화 시 충돌 감지 및 해결
```

#### 장점
- Git 의존성 없음
- 실시간 동기화 가능
- 충돌 해결 자동화
- Private 환경 지원

#### 단점
- 구현 복잡도 높음
- 체크섬 관리 필요

#### 구현 방법
```typescript
// 1. 문서 메타데이터 관리
interface DocumentSync {
  id: string
  localPath: string
  webContent: string
  localChecksum: string
  webChecksum: string
  lastSync: Date
  conflictStatus: 'none' | 'local' | 'web' | 'both'
}

// 2. 동기화 API
POST /api/sync/upload
{
  "documentId": "doc-123",
  "content": "local content",
  "checksum": "sha256-hash",
  "lastModified": "2024-01-01T00:00:00Z"
}

GET /api/sync/download/{documentId}
{
  "content": "web content",
  "checksum": "sha256-hash",
  "lastModified": "2024-01-01T00:00:00Z",
  "conflictStatus": "none"
}
```

### 4. **Hybrid Approach: Git + File Sync** (최적)

#### 워크플로우
```
1. 사용자가 Git 저장소 연결 (선택적)
2. 초기 동기화: Git 또는 파일 업로드
3. 편집 모드별 최적화:
   - 웹 편집: 실시간 동기화
   - 로컬 편집: Git 커밋 기반 동기화
4. 충돌 해결: 자동 + 수동 혼합
```

#### 장점
- 유연한 동기화 방식
- 기존 워크플로우 지원
- 실시간 + 배치 동기화

#### 단점
- 복잡한 구현
- 사용자 설정 필요

---

## 🛠️ 구체적 구현 방안

### 1. **CLI 도구 개발**

#### `mdshare` CLI 명령어
```bash
# 초기 설정
mdshare init --workspace=my-docs --sync-mode=git
mdshare init --workspace=my-docs --sync-mode=file

# 동기화
mdshare sync                    # 양방향 동기화
mdshare sync --direction=up     # 로컬 → 웹
mdshare sync --direction=down   # 웹 → 로컬

# 충돌 해결
mdshare resolve-conflicts       # 충돌 목록 확인
mdshare resolve --strategy=web  # 웹 버전 선택
mdshare resolve --strategy=local # 로컬 버전 선택
mdshare resolve --strategy=merge # 수동 병합

# 상태 확인
mdshare status                  # 동기화 상태 확인
mdshare diff                    # 변경사항 비교
```

### 2. **웹 서비스 API**

#### 동기화 API 엔드포인트
```typescript
// 문서 동기화 상태 확인
GET /api/sync/status/{workspaceId}
Response: {
  "documents": [
    {
      "id": "doc-123",
      "path": "docs/api.md",
      "status": "synced" | "conflict" | "pending",
      "lastSync": "2024-01-01T00:00:00Z"
    }
  ]
}

// 문서 업로드 (로컬 → 웹)
POST /api/sync/upload
Body: {
  "documentId": "doc-123",
  "content": "markdown content",
  "checksum": "sha256-hash",
  "lastModified": "2024-01-01T00:00:00Z"
}

// 문서 다운로드 (웹 → 로컬)
GET /api/sync/download/{documentId}
Response: {
  "content": "markdown content",
  "checksum": "sha256-hash",
  "lastModified": "2024-01-01T00:00:00Z",
  "conflictStatus": "none" | "local" | "web" | "both"
}

// 충돌 해결
POST /api/sync/resolve
Body: {
  "documentId": "doc-123",
  "strategy": "web" | "local" | "merge",
  "content": "resolved content" // merge 시에만
}
```

### 3. **충돌 해결 전략**

#### 자동 충돌 해결
```typescript
interface ConflictResolution {
  // 시간 기반: 최신 변경사항 우선
  strategy: 'latest-wins'
  
  // 사용자 설정 기반
  strategy: 'prefer-web' | 'prefer-local'
  
  // 내용 기반: 변경 범위가 작은 것 우선
  strategy: 'smallest-change'
  
  // 수동 병합 필요
  strategy: 'manual-merge'
}
```

#### 충돌 감지 알고리즘
```typescript
function detectConflict(localContent: string, webContent: string): ConflictStatus {
  const localChecksum = sha256(localContent)
  const webChecksum = sha256(webContent)
  
  if (localChecksum === webChecksum) {
    return 'none'
  }
  
  // 변경사항 분석
  const localChanges = getChangeSet(localContent)
  const webChanges = getChangeSet(webContent)
  
  if (hasOverlappingChanges(localChanges, webChanges)) {
    return 'conflict'
  }
  
  return 'safe-merge'
}
```

---

## 🎯 권장 구현 단계

### Phase 1: 기본 파일 동기화 (1-2개월)
1. **문서 업로드/다운로드 API**
2. **체크섬 기반 변경 감지**
3. **기본 CLI 도구**
4. **수동 충돌 해결**

### Phase 2: 고급 동기화 (2-3개월)
1. **자동 충돌 감지**
2. **다양한 충돌 해결 전략**
3. **실시간 동기화**
4. **배치 동기화**

### Phase 3: Git 통합 (3-4개월)
1. **Git 저장소 연결**
2. **브랜치 기반 동기화**
3. **커밋 메시지 자동 생성**
4. **Git 워크플로우 통합**

---

## 💡 추가 고려사항

### 보안
- **토큰 기반 인증**: 사용자별 동기화 토큰
- **암호화**: 민감한 문서 암호화 저장
- **접근 제어**: 워크스페이스별 권한 관리

### 성능
- **증분 동기화**: 변경된 부분만 동기화
- **압축**: 대용량 문서 압축 전송
- **캐싱**: 로컬 캐시로 빠른 접근

### 사용성
- **자동 동기화**: 파일 변경 감지 시 자동 동기화
- **백그라운드 동기화**: 사용자 작업 방해 없음
- **상태 표시**: 동기화 상태 실시간 표시

이러한 전략을 통해 Private Git 환경에서도 MDShare와 로컬 환경 간의 원활한 동기화가 가능할 것입니다.
