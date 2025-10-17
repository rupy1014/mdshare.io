# 프로젝트 개요 - 문서 구조

이 폴더는 마크다운 파일 공유 플랫폼 프로젝트의 핵심 개요와 컨셉을 담고 있습니다.

## 📚 문서 구조

### 1. [핵심 컨셉](./core-concept.md)
**비즈니스 전략 및 가치 제안**

- 🎯 핵심 컨셉 및 가치 제안
- 💡 문제 정의 및 솔루션
- 🎪 차별화 포인트
- 👥 타겟 고객 분석

**추천 대상**: 비즈니스 이해관계자, 투자자, 제품 기획자

### 2. [확장 마크다운 시스템](./extended-markdown.md)
**핵심 철학 및 기술 컨셉**

- 🚀 "마크다운의 확장" 철학
- 📊 데이터 파일 자동 렌더링 (CSV, JSON)
- 🎨 다이어그램 자동 렌더링 (Mermaid, PlantUML)
- 🎬 미디어 임베딩 (YouTube, 이미지 최적화)
- 💻 코드 블록 향상
- 🔗 스마트 링크 시스템
- 📋 실전 예시 및 비교 분석

**추천 대상**: 제품 기획자, 개발자, UX 디자이너

### 3. [배포 방법](./deployment.md)
**배포 옵션 및 API 키 시스템**

- 🖥️ 데스크톱 앱 (비개발자용)
- 💻 CLI 도구 (개발자용)
- 🤖 CI/CD 자동화 (팀용)
- 🔑 API 키 시스템 (User Token, Deploy Key)
- 🛡️ 보안 설계 및 권한 관리

**추천 대상**: 개발자, DevOps 엔지니어, 시스템 관리자

### 4. [핵심 기능](./features.md)
**Phase별 기능 로드맵**

- 📦 파일 관리 (구조 유지, 버전 관리)
- 🌐 웹 뷰어 (노션 스타일 UI, 검색)
- 🔐 접근 제어 (개요)
- 🤖 AI 기능 (벡터DB, 챗봇, 자동 요약)
- 📅 기능 로드맵 (Phase 1-4)

**추천 대상**: 제품 기획자, 개발자, 프로젝트 매니저

### 5. [접근 제어 및 공유](./access-control.md)
**Notion 스타일 공유 시스템**

- 🌐 공개 범위 설정 (Private, Public Link, Public Web)
- 👥 초대 시스템 (링크, 이메일, 도메인 기반)
- 🎭 권한 관리 (Guest, Viewer, Editor, Admin)
- 🔗 공유 옵션 (Notion 스타일 UI)
- 🛡️ 보안 기능 (비밀번호, IP 화이트리스트)
- 📊 접근 분석 및 감사 로그

**추천 대상**: 제품 기획자, 보안 담당자, 엔터프라이즈 고객

### 6. [사용자 시나리오](./scenarios.md)
**실제 사용 사례 및 워크플로우**

- 📖 시나리오 1: 스터디 운영자 (데스크톱 앱)
- 🎓 시나리오 2: 교수님 (CLI)
- 💼 시나리오 3: 개발팀 (CI/CD)
- ✍️ 시나리오 4: 블로거 (실시간 동기화)
- 🏢 시나리오 5: 기업 팀 (Enterprise)

**추천 대상**: 모든 이해관계자, 영업팀, 고객 지원팀

## 🎯 빠른 시작 가이드

### 비즈니스 우선 독자
```
1. core-concept.md → 핵심 가치 제안 이해
2. access-control.md → 공유 및 협업 기능
3. scenarios.md → 실제 사용 사례
```

### 기술 우선 독자
```
1. extended-markdown.md → 기술 철학 및 컨셉
2. deployment.md → 배포 방법 및 API
3. features.md → 기능 로드맵
```

### 제품 기획자
```
1. core-concept.md → 전체 컨셉
2. extended-markdown.md → 핵심 차별화 요소
3. access-control.md → 공유 시스템
4. features.md → 기능 우선순위
```

### 개발자
```
1. extended-markdown.md → 기술 요구사항
2. deployment.md → 배포 시스템 구조
3. features.md → 구현할 기능
```

## 🔗 관련 문서

- **기술 아키텍처**: [../technical-architecture.md](../technical-architecture.md)
- **개발 로드맵**: [../roadmap.md](../roadmap.md)
- **메인 README**: [../README.md](../README.md)

## 📝 문서 업데이트 이력

### 2025-10-17
- ✅ idea.md를 6개 파일로 분리
- ✅ Notion 스타일 공유 시스템 추가
- ✅ 접근 제어 상세 문서화
- ✅ 사용자 시나리오 5개 추가

## 💬 피드백

이 문서에 대한 질문이나 제안사항이 있으시면:
- GitHub Issues로 제보
- 팀 Slack #product 채널
