# MDShare 개발 우선순위

## 🎯 현재 상태 분석

### ✅ 완료된 작업
1. **프로젝트 구조 설계** - 멀티 프로젝트 아키텍처
2. **공통 리소스 정의** - 템플릿, 표준, 정책 문서
3. **CLI 시나리오 설계** - 사용자 경험 및 워크플로우
4. **템플릿 시스템 설계** - 다양한 프로젝트 유형 지원

### 📋 필요한 다음 단계
현재 **설계 단계**가 완료되었으므로, 이제 **실제 구현**을 시작해야 합니다.

## 🚀 개발 우선순위

### 1단계: 핵심 아키텍처 구축 (1-2주)
**목표**: MDShare의 기본 동작 원리 구현

#### 1.1 마크다운 파싱 엔진
```typescript
// 우선순위: HIGH
// 목표: 확장된 마크다운 문법 지원
- Frontmatter 파싱
- CSV/JSON 렌더링 (@csv, @json)
- 다이어그램 렌더링 (@mermaid, @plantuml)
- 내부 링크 처리
```

#### 1.2 메타데이터 관리 시스템
```typescript
// 우선순위: HIGH
// 목표: 문서 메타데이터 체계적 관리
- .mdshare/config.json 파싱
- 문서별 메타데이터 추출
- 인덱스 파일 생성/업데이트
- 관계 데이터 관리
```

#### 1.3 기본 파일 구조 생성
```typescript
// 우선순위: MEDIUM
// 목표: 프로젝트 구조 자동 생성
- 디렉토리 구조 생성
- 기본 파일 템플릿 적용
- 설정 파일 초기화
```

### 2단계: AI 기능 구현 (2-3주)
**목표**: 핵심 차별화 기능 구현

#### 2.1 자동 인덱싱 시스템
```typescript
// 우선순위: HIGH
// 목표: 문서 내용 자동 분석 및 인덱싱
- 문서 내용 분석
- 키워드 추출
- 태그 자동 생성
- 카테고리 분류
```

#### 2.2 관계 분석 엔진
```typescript
// 우선순위: HIGH
// 목표: 문서 간 연관성 자동 분석
- 문서 간 참조 관계 분석
- 의존성 그래프 생성
- 관련 문서 추천
```

#### 2.3 AI 챗봇 구현
```typescript
// 우선순위: MEDIUM
// 목표: 문서 기반 질문 답변 시스템
- 문서 임베딩 생성
- 벡터 검색 구현
- RAG (Retrieval Augmented Generation)
- 자연어 질문 처리
```

### 3단계: 사용자 인터페이스 (2-3주)
**목표**: 사용자가 실제로 사용할 수 있는 UI

#### 3.1 웹 인터페이스
```typescript
// 우선순위: HIGH
// 목표: 문서 브라우징 및 검색 UI
- 문서 목록 및 탐색
- 검색 기능
- 문서 뷰어
- 반응형 디자인
```

#### 3.2 편집 인터페이스
```typescript
// 우선순위: MEDIUM
// 목표: 문서 편집 및 관리 UI
- 마크다운 에디터
- 실시간 미리보기
- 파일 업로드
- 메타데이터 편집
```

#### 3.3 관리 대시보드
```typescript
// 우선순위: LOW
// 목표: 프로젝트 관리 및 설정
- 프로젝트 설정
- 사용자 관리
- 통계 및 분석
- 백업/복원
```

### 4단계: 배포 및 운영 (1-2주)
**목표**: 실제 서비스 운영 가능한 상태

#### 4.1 정적 사이트 생성
```typescript
// 우선순위: HIGH
// 목표: GitHub Pages 등에 배포 가능한 정적 사이트
- HTML/CSS/JS 생성
- 검색 인덱스 생성
- 자산 최적화
- SEO 최적화
```

#### 4.2 배포 자동화
```typescript
// 우선순위: MEDIUM
// 목표: 원클릭 배포 시스템
- GitHub Actions 연동
- Vercel/Netlify 배포
- 도메인 설정
- SSL 인증서
```

### 5단계: CLI 도구 (1-2주)
**목표**: 개발자 친화적인 명령줄 도구

#### 5.1 기본 CLI 명령어
```typescript
// 우선순위: MEDIUM
// 목표: 핵심 CLI 기능 구현
- mdshare init
- mdshare serve
- mdshare build
- mdshare deploy
```

#### 5.2 템플릿 시스템
```typescript
// 우선순위: LOW
// 목표: 프로젝트 템플릿 관리
- 템플릿 다운로드
- 변수 치환
- 프로젝트 생성
```

## 📊 개발 리소스 배분

### Phase 1: MVP (4-6주)
**목표**: 기본적인 문서화 시스템 동작

```
Week 1-2: 핵심 아키텍처 (40%)
├── 마크다운 파싱 엔진 (20%)
├── 메타데이터 관리 (10%)
└── 기본 파일 구조 (10%)

Week 3-4: AI 기능 (40%)
├── 자동 인덱싱 (20%)
├── 관계 분석 (15%)
└── 기본 검색 (5%)

Week 5-6: 사용자 인터페이스 (20%)
├── 웹 인터페이스 (15%)
└── 기본 편집 기능 (5%)
```

### Phase 2: Enhanced (4-6주)
**목표**: 고급 기능 및 사용자 경험 개선

```
Week 7-8: AI 고도화 (30%)
├── AI 챗봇 (20%)
├── 고급 분석 (10%)

Week 9-10: UI/UX 개선 (30%)
├── 편집 인터페이스 (20%)
├── 관리 대시보드 (10%)

Week 11-12: 배포 및 운영 (40%)
├── 정적 사이트 생성 (20%)
├── 배포 자동화 (15%)
└── CLI 도구 (5%)
```

## 🛠️ 기술 스택 결정

### 백엔드 (Node.js)
```typescript
// 핵심 라이브러리
- marked: 마크다운 파싱
- gray-matter: frontmatter 처리
- mermaid: 다이어그램 렌더링
- openai: AI 기능
- sqlite3: 로컬 데이터베이스
```

### 프론트엔드 (React/Next.js)
```typescript
// 핵심 라이브러리
- next.js: 풀스택 프레임워크
- tailwindcss: 스타일링
- @monaco-editor/react: 코드 에디터
- react-markdown: 마크다운 렌더링
- fuse.js: 클라이언트 검색
```

### CLI 도구
```typescript
// 핵심 라이브러리
- commander: CLI 프레임워크
- inquirer: 대화형 프롬프트
- chalk: 터미널 스타일링
- ora: 로딩 스피너
- fs-extra: 파일 시스템
```

## 🎯 첫 번째 구현 목표

### Week 1-2 목표: 기본 동작하는 시스템
```bash
# 목표: 이 명령어들이 동작해야 함
mkdir my-docs
cd my-docs
mdshare init
mdshare serve
```

**구현해야 할 기능:**
1. ✅ 기본 프로젝트 구조 생성
2. ✅ 마크다운 파일 파싱
3. ✅ 간단한 웹 서버 실행
4. ✅ 문서 목록 표시
5. ✅ 기본 검색 기능

### Week 3-4 목표: AI 기능 추가
```bash
# 목표: AI 기능이 동작해야 함
mdshare index    # AI 인덱싱
mdshare serve    # AI 검색 및 챗봇
```

**구현해야 할 기능:**
1. ✅ 문서 내용 분석
2. ✅ 자동 태깅
3. ✅ 관계 분석
4. ✅ AI 검색
5. ✅ 기본 챗봇

## 📋 즉시 시작할 작업

### 1. 프로젝트 초기화
```bash
# 새 프로젝트 생성
mkdir mdshare-core
cd mdshare-core
npm init -y
npm install marked gray-matter mermaid
```

### 2. 핵심 모듈 구조
```
mdshare-core/
├── src/
│   ├── parser/          # 마크다운 파싱
│   ├── metadata/        # 메타데이터 관리
│   ├── ai/             # AI 기능
│   ├── server/         # 웹 서버
│   └── cli/            # CLI 도구
├── templates/          # 프로젝트 템플릿
└── examples/           # 사용 예시
```

### 3. 첫 번째 구현 파일
```typescript
// src/parser/markdown.ts
export class MarkdownParser {
  parse(content: string): ParsedDocument {
    // 마크다운 파싱 로직
  }
}

// src/server/app.ts
export class MDShareServer {
  start(port: number): void {
    // 웹 서버 시작
  }
}
```

## 🚀 다음 단계

1. **즉시 시작**: 핵심 아키텍처 구현
2. **1주 후**: 기본 동작하는 시스템 완성
3. **2주 후**: AI 기능 추가
4. **4주 후**: 사용자 인터페이스 완성
5. **6주 후**: 배포 및 CLI 도구 완성

---

**결론**: CLI 명령어는 마지막 단계이고, 지금은 **핵심 아키텍처부터 구현**해야 합니다. 특히 **마크다운 파싱 엔진**과 **메타데이터 관리 시스템**이 가장 우선순위가 높습니다.
