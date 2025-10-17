# 사용자 경험 시나리오

## 시나리오 1: 스터디 운영자 (비개발자)

### 사용자 프로필
- 이름: 김민지
- 역할: 코딩 스터디 운영자
- 기술 수준: 비개발자 (Notion, Obsidian 사용 가능)
- 요구사항: 주차별 강의 자료를 스터디원들과 공유

### 사용 흐름

#### Step 1: 로컬 작성
```
도구: Obsidian
위치: ~/Documents/coding-study/
구조:
  week1/
    lecture.md
    exercise.md
  week2/
    ...
```

#### Step 2: 배포 (데스크톱 앱)
```
1. MDShare 데스크톱 앱 실행
2. "coding-study/" 폴더를 앱 창에 드래그 & 드롭
3. 자동 업로드 → 3초 후 완료
   [▓▓▓▓▓▓▓▓▓▓] 100%
   ✅ 15 files uploaded successfully
```

#### Step 3: 공유
```
1. "Share" 버튼 클릭
2. "Public (Link)" 선택
3. "Generate Invite Link" 클릭
4. 링크 복사: https://mdshare.io/invite/abc123
5. 카카오톡으로 스터디원들에게 공유
```

#### Step 4: 스터디원 접근
```
스터디원들:
1. 링크 클릭
2. 웹 브라우저에서 즉시 열림 (로그인 선택)
3. 노션처럼 깔끔한 인터페이스로 자료 읽기
4. 필요시 PDF로 다운로드
```

### 핵심 가치
- ✅ 3초 만에 배포 완료
- ✅ 기술 지식 불필요
- ✅ 스터디원들은 링크만으로 즉시 접근
- ✅ 원본 파일은 로컬에 안전하게 보관

---

## 시나리오 2: 교수님 (CLI 사용)

### 사용자 프로필
- 이름: 박교수
- 역할: 대학교 컴퓨터공학 교수
- 기술 수준: 개발자 (Git, Terminal 능숙)
- 요구사항: 강의 노트를 학생들에게 배포, 자주 업데이트

### 사용 흐름

#### Step 1: 초기 설정 (처음 1회만)
```bash
# 터미널에서 작업
$ cd ~/courses/cs101

# MDShare CLI 로그인
$ mdshare login
→ Opening browser for authentication...
→ ✅ Successfully logged in as prof.park@university.edu

# 프로젝트 초기화
$ mdshare init
→ Create new project or link existing?
→ [1] Create new project
→ Project name: CS101 - Data Structures
→ ✅ Project created: cs101-ds
→ .mdshare config file created
```

#### Step 2: 강의 노트 작성
```bash
# VS Code로 강의 노트 작성
$ code lectures/week1.md

# 이미지 추가
$ cp screenshot.png images/
```

#### Step 3: 배포
```bash
# 변경된 파일만 자동 감지하여 배포
$ mdshare deploy
→ Scanning for changes...
→ Found 2 changed files:
   - lectures/week1.md (modified)
   - images/screenshot.png (new)
→ Uploading...
   [▓▓▓▓▓▓▓▓▓▓] 100%
→ ✅ Deployed successfully
→ URL: https://mdshare.io/prof-park/cs101-ds
```

#### Step 4: 자동 동기화 (선택)
```bash
# 파일 저장할 때마다 자동 배포
$ mdshare deploy --watch
→ Watching for changes in ./lectures...
→ Press Ctrl+C to stop

# 파일 저장 (Cmd+S)
→ Detected change: lectures/week2.md
→ Deploying... ✅ Done

# 또 다른 파일 저장
→ Detected change: exercises/hw1.md
→ Deploying... ✅ Done
```

#### Step 5: 학생들과 공유
```bash
# 학생들에게 링크 공유
URL: https://mdshare.io/prof-park/cs101-ds

# 학생이 질문 (AI 챗봇)
학생: "5주차 과제 기한이 언제인가요?"
챗봇: "5주차 과제는 10월 20일 23:59까지입니다. (출처: lectures/week5.md:15)"
```

### 핵심 가치
- ✅ 한 번 설정하면 계속 간편하게 사용
- ✅ 변경된 파일만 자동 감지
- ✅ --watch로 실시간 동기화
- ✅ AI 챗봇으로 학생 질문 자동 답변

---

## 시나리오 3: AI 도입 기업 (사내 매뉴얼 관리) ⭐ NEW

### 기업 프로필
- 기업: 테크 스타트업 (직원 50명)
- 역할: 운영팀장
- 요구사항: **AI 에이전트가 활용할 사내 매뉴얼 구축**
- 핵심 Pain Point: "AI가 우리 회사 매뉴얼을 읽어도 제대로 이해 못함"

### 사용 흐름

#### Step 1: 현재 상황 (문제)
```
문제 상황:
- 사내 매뉴얼 100개 이상 (Word, Notion, Google Docs)
- 흩어져 있어 찾기 어려움
- AI 에이전트에게 "신입 온보딩 절차는?" → 제대로 답변 못함
- 수동으로 인덱스 관리 불가능
- 문서 간 연관성 파악 어려움
```

#### Step 2: 마크다운 변환 및 업로드
```bash
# 1. 기존 문서를 마크다운으로 변환 (Pandoc 등)
$ pandoc onboarding.docx -o onboarding.md

# 2. 프로젝트 구조 정리
company-manual/
├── onboarding/
│   ├── first-day.md
│   ├── setup-guide.md
│   └── team-intro.md
├── processes/
│   ├── expense-report.md
│   ├── pto-request.md
│   └── meeting-guidelines.md
├── engineering/
│   ├── dev-setup.md
│   ├── deploy-process.md
│   └── code-review.md
└── data/
    └── contacts.csv

# 3. 업로드
$ mdshare deploy
→ ✅ 120 files uploaded
→ 🤖 AI analyzing documents...
→ ✅ Indexing complete
```

#### Step 3: AI 자동 구조화 (핵심!)
```
MDShare AI 자동 작업:

1. 자동 인덱스 생성:
   .index/
   ├── by-topic.md
   │   ├── 📂 온보딩 관련 (15개 문서)
   │   ├── 📂 프로세스 (25개 문서)
   │   ├── 📂 개발 (40개 문서)
   │   └── 📂 인사/복지 (20개 문서)
   ├── by-department.md
   │   ├── Engineering (40개)
   │   ├── Operations (30개)
   │   └── HR (20개)
   └── related-docs.md
       └── "온보딩 → 개발 환경 셋업 → 코드 리뷰 가이드"

2. 자동 태깅:
   onboarding/first-day.md
   → AI 자동 태그: #신입, #첫출근, #온보딩, #체크리스트
   → 카테고리: HR
   → 연관 문서: setup-guide.md, team-intro.md

3. 문서 관계 분석:
   "첫 출근 가이드" → "개발 환경 셋업" → "첫 PR 작성하기"
   AI가 자동으로 순서 파악 및 링크 생성

4. AI 친화도 평가:
   onboarding/first-day.md → 85점 ✅
   → "잘 구조화됨, AI가 이해하기 쉬움"

   processes/expense-report.md → 45점 ⚠️
   → "개선 필요: 절차가 명확하지 않음"
   → "제안: 단계별 넘버링 추가"
```

#### Step 4: AI 에이전트 활용
```
케이스 1: 신입 온보딩
신입 직원: "첫 출근 날 뭘 해야 하나요?"

AI 챗봇:
"첫 출근 날 해야 할 일입니다:
1. 9시까지 출근 (건물 1층 리셉션)
2. HR팀에서 장비 수령 (노트북, 키보드)
3. 개발 환경 셋업 (상세: setup-guide.md)
4. 팀 점심 (12시, 회의실 A)
5. 온보딩 미팅 (14시, CEO)

📎 출처: onboarding/first-day.md:15-25"

케이스 2: 업무 프로세스 질문
직원: "경비 처리는 어떻게 하나요?"

AI 챗봇:
"경비 처리 절차입니다:
1. 영수증 사진 촬영
2. Expensify 앱에 업로드
3. 프로젝트 코드 입력
4. 승인 대기 (보통 2-3일)
5. 급여와 함께 지급

💡 팁: 일정 금액 이하는 자동 승인됩니다.
📎 출처: processes/expense-report.md"

케이스 3: 복잡한 기술 질문
개발자: "배포 프로세스에서 롤백은 어떻게 하나요?"

AI 챗봇:
"배포 롤백 절차입니다:
1. kubectl rollout undo deployment/app
2. 또는: 이전 버전 태그로 재배포
3. 모니터링 대시보드 확인 (링크)
4. Slack #deployments 채널에 알림

⚠️ 주의: DB 마이그레이션이 있으면 수동 롤백 필요
📎 출처: engineering/deploy-process.md:45
📎 관련: engineering/monitoring.md"
```

#### Step 5: 지속적 개선
```
주간 AI 리포트:

📊 이번 주 통계:
- 총 질문 수: 145개
- 정답률: 92%
- 가장 많이 찾은 문서: onboarding/setup-guide.md

⚠️ 개선 필요 문서:
- processes/expense-report.md (AI 친화도: 45점)
  → "절차가 불명확, 단계별 정리 필요"
- engineering/api-docs.md (검색 안 됨)
  → "연관 문서 링크 없음, 고립된 문서"

💡 AI 제안:
- "team-intro.md와 org-chart.md를 합치면 좋겠습니다"
- "onboarding/ 폴더에 index.md가 있으면 더 좋습니다"
- "expense-report.md에 예시 추가 권장"
```

### 핵심 가치
- ✅ **AI가 제대로 이해**: 구조화된 매뉴얼로 AI 정답률 92%
- ✅ **수동 인덱싱 불필요**: AI가 자동으로 주제별/부서별 인덱스 생성
- ✅ **문서 관계 자동 파악**: 연관 문서 자동 링크, 학습 경로 제안
- ✅ **지속적 개선**: AI가 매뉴얼 품질 평가, 개선 제안
- ✅ **즉시 활용**: 신입도 AI 챗봇으로 궁금한 거 즉시 해결

### ROI 분석
```
도입 전:
- 신입 온보딩 질문 답변: 평균 30분/건
- 월 신입 5명 × 10건 = 50건 = 25시간
- 시간당 고정 비용으로 월 상당한 비용 발생

도입 후:
- AI 자동 답변: 92% 자동 해결
- 사람 개입: 8% (4건) = 2시간
- 월 상당한 시간 절감
- 연간 큰 비용 절감 효과

추가 가치:
- 매뉴얼 품질 향상 (AI 피드백)
- 지식 유실 방지 (AI가 기억)
- 24/7 즉시 답변 (시간 절약)
```

---

## 시나리오 4: 개발팀 (CI/CD 자동화)

### 팀 프로필
- 팀: 스타트업 백엔드 팀 (5명)
- 요구사항: API 문서 자동 업데이트, 항상 최신 상태 유지
- 기술 스택: GitHub, GitHub Actions

### 사용 흐름

#### Step 1: API 문서 관리
```
저장소 구조:
backend-api/
├── src/
├── docs/          ← API 문서 (마크다운)
│   ├── auth.md
│   ├── users.md
│   └── data/
│       └── endpoints.json
└── .github/
    └── workflows/
        └── deploy-docs.yml
```

#### Step 2: MDShare Deploy Key 생성
```
1. MDShare 웹사이트 로그인
2. 프로젝트 생성: "Backend API Docs"
3. Project Settings > Deploy Keys
4. "Create Deploy Key" 클릭
   Name: GitHub Actions
   Permissions: Read/Write
5. 토큰 복사: mdsk_abc123xyz...
```

#### Step 3: GitHub Secrets 설정
```
GitHub Repository > Settings > Secrets and variables > Actions

New repository secret:
  Name: MDSHARE_TOKEN
  Value: mdsk_abc123xyz...

New repository secret:
  Name: MDSHARE_PROJECT
  Value: backend-api-docs
```

#### Step 4: GitHub Actions Workflow
```yaml
# .github/workflows/deploy-docs.yml
name: Deploy API Documentation

on:
  push:
    branches: [main]
    paths: ['docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install MDShare CLI
        run: npm install -g mdshare-cli

      - name: Deploy to MDShare
        run: mdshare deploy ./docs
        env:
          MDSHARE_TOKEN: ${{ secrets.MDSHARE_TOKEN }}
          MDSHARE_PROJECT: ${{ secrets.MDSHARE_PROJECT }}
```

#### Step 5: 자동화된 워크플로우
```
개발자 A: docs/users.md 수정
→ git add docs/users.md
→ git commit -m "Update user API documentation"
→ git push origin main

GitHub Actions:
→ ✅ Workflow triggered
→ ✅ Checkout code
→ ✅ Install mdshare-cli
→ ✅ Deploy to MDShare
→ ✅ Deployment successful

팀원들:
→ https://mdshare.io/company/backend-api-docs
→ 항상 최신 문서 확인
→ AI 검색으로 빠르게 원하는 API 찾기

외부 협력사:
→ 특정 섹션만 공유 (폴더별 권한)
→ Public API만 접근 가능
→ 내부 API는 비공개
```

### 핵심 가치
- ✅ 완전 자동화 (수동 배포 불필요)
- ✅ Git push만 하면 자동 업데이트
- ✅ 팀원들은 항상 최신 문서 확인
- ✅ 외부 협력사에 선택적 공유

---

## 시나리오 5: 블로거 (CLI + 로컬 동기화)

### 사용자 프로필
- 이름: 이개발
- 역할: 기술 블로거
- 기술 수준: 개발자 (마크다운 에디터 선호)
- 요구사항: 로컬에서 글 작성 후 즉시 공개

### 사용 흐름

#### Step 1: 로컬에서 글 작성
```bash
# 좋아하는 에디터로 작성 (Typora, iA Writer, etc.)
$ typora ~/blog/posts/nextjs-optimization.md
```

#### Step 2: 실시간 동기화 활성화
```bash
# 터미널에서 watch 모드 실행
$ cd ~/blog
$ mdshare deploy --watch
→ Watching for changes in ./posts...
→ Deploying initial version...
→ ✅ Live at: https://mdshare.io/devlee/blog
→ Press Ctrl+C to stop
```

#### Step 3: 글 작성 중 저장
```
Typora에서 글 작성...
→ Cmd+S (저장)

터미널:
→ Detected change: posts/nextjs-optimization.md
→ Deploying... [▓▓▓▓▓▓] 100%
→ ✅ Updated successfully
→ Preview: https://mdshare.io/devlee/blog/posts/nextjs-optimization
```

#### Step 4: 실시간 미리보기
```
브라우저에서:
→ https://mdshare.io/devlee/blog/posts/nextjs-optimization
→ 새로고침하면 즉시 업데이트된 내용 확인
→ 노션처럼 깔끔한 인터페이스로 렌더링
```

#### Step 5: 공개
```
글 작성 완료 후:
1. frontmatter에 status: published 추가
2. 저장 → 자동 배포
3. 소셜 미디어에 링크 공유
4. SEO 최적화 자동 적용
5. 독자들은 즉시 읽기 시작
```

### 핵심 가치
- ✅ 로컬 에디터 자유롭게 사용
- ✅ 저장하면 즉시 웹에 반영
- ✅ 실시간 미리보기 가능
- ✅ SEO 자동 최적화

---

## 시나리오 6: 기업 팀 (Enterprise)

### 팀 프로필
- 기업: 테크 기업 (직원 500명)
- 팀: 제품 팀 (20명)
- 요구사항: 내부 위키, 온보딩 자료, 감사 로그

### 사용 흐름

#### Step 1: 조직 설정
```
엔터프라이즈 플랜 가입
→ SSO 통합 (Google Workspace)
→ 도메인 기반 자동 초대: @company.com
→ IP 화이트리스트 설정
```

#### Step 2: 프로젝트 생성
```
프로젝트들:
1. Product Wiki (Private)
2. Engineering Docs (Private)
3. Customer Success KB (Public)
4. Onboarding Guide (Private)
```

#### Step 3: 폴더별 권한 설정
```
Product Wiki/
├── public/          → 전 직원 읽기
├── team-only/       → 제품 팀만
└── leadership/      → 리더십만

권한 설정:
public/ → All employees: Viewer
team-only/ → Product team: Viewer, Others: No access
leadership/ → Leadership: Viewer, Others: No access
```

#### Step 4: 팀원 자동 추가
```
신입 사원 입사:
→ Google Workspace 계정 생성: newbie@company.com
→ MDShare 자동 접근 권한 부여
→ Onboarding Guide 자동 표시
→ 필요한 위키 자동 접근
```

#### Step 5: 감사 로그
```
Admin Dashboard > Audit Log

2025-10-17 14:30 - john@company.com
  - Viewed: /product-wiki/leadership/roadmap-2026.md
  - IP: 192.168.1.100

2025-10-17 14:25 - jane@company.com
  - Downloaded: /engineering-docs/architecture.md
  - IP: 192.168.1.150

2025-10-17 14:20 - admin@company.com
  - Changed permissions: /product-wiki/leadership/
  - From: Team-only → Leadership-only
  - IP: 192.168.1.10
```

### 핵심 가치
- ✅ SSO 통합으로 간편 로그인
- ✅ 도메인 기반 자동 권한 부여
- ✅ 세밀한 폴더별 권한 제어
- ✅ 감사 로그로 보안 관리

---

## 공통 성공 요소

### 1. 빠른 시작
- 모든 시나리오에서 5분 이내 시작 가능
- 복잡한 설정 불필요
- 즉시 가치 체감

### 2. 유연한 배포 방법
- 비개발자: 데스크톱 앱 (드래그 & 드롭)
- 개발자: CLI (터미널 명령어)
- 팀: CI/CD (완전 자동화)

### 3. 데이터 소유권
- 원본 파일은 로컬에 보관
- Lock-in 없음
- 플랫폼 독립적

### 4. 아름다운 렌더링
- 노션 수준의 UI/UX
- 확장 마크다운 자동 처리
- 모바일 최적화

### 5. 강력한 AI 기능 ⭐ 핵심 차별화
- **AI 자동 인덱싱**: 문서 구조 자동 분석, 수동 관리 불필요
- **자동 태깅 및 분류**: AI가 내용 읽고 주제/카테고리 자동 추출
- **문서 관계 분석**: 연관 문서 자동 링크, 학습 경로 생성
- **AI 친화도 평가**: AI가 이해하기 쉬운 문서인지 자동 평가
- **지식 베이스 챗봇**: "신입 온보딩 절차는?" → 즉시 답변
- **의미 기반 검색**: 키워드가 아닌 의미로 검색
