# 마크다운 파일 공유 플랫폼 - 요구사항 문서

마크다운 파일을 노션처럼 아름답게 공유하는 웹 플랫폼 프로젝트 요구사항 문서입니다.

## 📚 문서 구조

### 1. [프로젝트 개요](./overview/)
**핵심 컨셉 및 비즈니스 전략**

이제 overview 폴더 내 6개 문서로 구성되어 있습니다:
- [핵심 컨셉](./overview/core-concept.md) - 가치 제안, 차별화, 타겟 고객
- [확장 마크다운](./overview/extended-markdown.md) - 핵심 기술 철학 및 스마트 렌더링
- [배포 방법](./overview/deployment.md) - GUI/CLI/CI-CD 배포 시스템
- [핵심 기능](./overview/features.md) - Phase별 기능 로드맵
- [접근 제어](./overview/access-control.md) - Notion 스타일 공유 시스템
- [사용자 시나리오](./overview/scenarios.md) - 5가지 실제 사용 사례

**추천 대상**: 비즈니스 이해관계자, 투자자, 기획자

### 2. [기술 아키텍처](./technical-architecture.md)
**시스템 설계 및 구현 상세**

- 🏗️ 전체 시스템 아키텍처
- 🎨 프론트엔드 (Next.js)
  - 컴포넌트 구조
  - 페이지 라우팅
  - 상태 관리
- 💻 백엔드 (Node.js)
  - API 엔드포인트
  - 데이터베이스 스키마
  - 인증/인가
- 🖥️ 데스크톱 앱 (Electron)
- 🤖 AI 서비스 (벡터DB + LLM)
- 🔒 보안 설계
- 📊 성능 최적화
- 🚀 배포 전략

**추천 대상**: 개발자, 기술 아키텍트, DevOps 엔지니어

### 3. [개발 로드맵](./roadmap.md)
**단계별 실행 계획 및 수익 모델**

- 🗺️ Phase별 개발 계획
  - Phase 0: 시장 검증 (2주)
  - Phase 1: MVP 개발 (6주)
  - Phase 2: 베타 론칭 (2주)
  - Phase 3: 성장 (3개월)
  - Phase 4: 스케일링 (6개월)
- 💰 상세 수익 모델
  - 가격 전략
  - 수익 예측 (3가지 시나리오)
  - 비용 구조
  - Break-even 분석
- 📊 핵심 성과 지표 (KPIs)
- 🚨 리스크 관리
- 📈 Exit 전략

**추천 대상**: 프로젝트 매니저, CEO, 투자자

## 🎯 핵심 요약

### "엘리베이터 피치" (30초)
> 개발자, 교육자, 팀들이 로컬에서 작성한 마크다운 파일을 폴더째 업로드하면, 노션처럼 아름답게 렌더링되어 팀원들과 공유할 수 있는 플랫폼입니다. 향후 AI 기능(벡터 검색, 챗봇)으로 문서를 더 스마트하게 활용할 수 있습니다.

### 핵심 특징 4가지
1. **확장 마크다운**: CSV→테이블, JSON→구조화 뷰, 다이어그램 자동 렌더링
2. **간결한 원본 + 풍부한 렌더링**: 순수 MD 파일 + 노션급 UX
3. **3가지 배포 방법**: 드래그 & 드롭 (GUI) / CLI / CI/CD 자동화
4. **AI 통합**: 의미 기반 검색 및 문서 Q&A 챗봇

### 타겟 시장
- **1차**: 스터디/커뮤니티, 교육 기관, 기술 문서 작성자
- **2차**: 소규모 팀/스타트업 (내부 위키)
- **3차**: 엔터프라이즈 (Confluence 대체)

### 수익 모델
- **무료**: 100MB, 광고 있음
- **Pro ($9/월)**: 5GB, 무제한 프로젝트, AI 기능
- **Team ($29/월)**: 50GB, 고급 권한 관리, Analytics
- **Enterprise (협상)**: 온프레미스, SSO, 무제한

### 12개월 목표
- 👥 50,000 사용자
- 💰 $50,000 MRR (월 반복 수익)
- 🚀 AI 기능 출시
- 🏢 10개 엔터프라이즈 고객

## 🚀 다음 단계

### 즉시 실행 가능한 액션 아이템

1. **Week 1: 시장 검증**
   ```bash
   - [ ] Landing page 제작 (Framer/Webflow)
   - [ ] 대기자 명단 폼 설정
   - [ ] Google Ads $100 캠페인 시작
   - [ ] Reddit, HN에서 아이디어 피드백 받기
   ```

2. **Week 2: 기술 스택 결정**
   ```bash
   - [ ] 프론트엔드: Next.js vs Remix
   - [ ] 백엔드: Fastify vs Express
   - [ ] DB: Supabase vs Railway
   - [ ] AI: Pinecone vs Qdrant
   - [ ] Monorepo 셋업 (Turborepo)
   ```

3. **Week 3-4: 프로토타입**
   ```bash
   - [ ] 간단한 웹 뷰어 (마크다운 렌더링)
   - [ ] 파일 업로드 API
   - [ ] 10명에게 테스트
   - [ ] 피드백 수집 및 개선
   ```

## 📖 읽기 가이드

### 비즈니스 우선 독자
```
1. overview/core-concept.md → 핵심 가치 및 차별화
2. overview/access-control.md → 공유 시스템
3. roadmap.md의 "수익 모델" 섹션
4. roadmap.md의 "성공 지표" 섹션
```

### 기술 우선 독자
```
1. overview/extended-markdown.md → 핵심 기술 철학
2. technical-architecture.md 전체 읽기
3. overview/deployment.md → 배포 시스템
4. roadmap.md의 "개발 단계" 섹션
```

### 투자자/의사결정자
```
1. overview/core-concept.md → 핵심 가치 제안 및 타겟
2. roadmap.md의 "수익 예측"
3. overview/scenarios.md → 실제 사용 사례
4. roadmap.md의 "Exit 전략"
```

### 프로젝트 팀원
```
1. overview/ → 전체 컨셉 이해
2. roadmap.md의 "Phase 1: MVP"
3. technical-architecture.md (담당 영역)
4. overview/deployment.md → 배포 방법
5. roadmap.md의 "마일스톤"
```

## 🔄 문서 업데이트

이 요구사항 문서는 **살아있는 문서(Living Document)**입니다.

### 업데이트 트리거
- 사용자 피드백 수집 시
- 기술 스택 변경 시
- 비즈니스 전략 피벗 시
- 주요 마일스톤 달성 시

### 버전 관리
- Git으로 버전 추적
- 주요 변경사항은 커밋 메시지에 명시
- 월 1회 정기 리뷰 및 업데이트

## 💬 피드백 & 질문

이 문서에 대한 질문이나 제안사항이 있으시면:

1. GitHub Issues로 제보
2. 팀 Slack #product 채널
3. 이메일: [연락처]

---

**마지막 업데이트**: 2025-10-17
**버전**: 1.0
**작성자**: Product Team
