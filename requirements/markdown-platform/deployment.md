# 배포 방법 및 API 키 시스템

## 🚀 배포 방법 (3가지 옵션)

### 방법 1: 데스크톱 앱 (비개발자용)

**특징:**
- 폴더 드래그 & 드롭
- GUI 기반 설정
- 실시간 진행 상황 표시
- 자동 동기화 옵션

**사용 시나리오:**
스터디 운영자, 교수님, 비개발자가 로컬 마크다운 파일을 쉽게 공유하고 싶을 때

### 방법 2: CLI 도구 (개발자용)

**초기 설정 (1회만):**
```bash
mdshare login                          # 웹 브라우저로 인증
mdshare init                           # 프로젝트 연결
```

**배포 명령어:**
```bash
mdshare deploy                         # 현재 폴더 전체 배포
mdshare deploy ./docs                  # 특정 폴더만 배포
mdshare deploy --watch                 # 파일 변경 시 자동 배포
```

**프로젝트 관리:**
```bash
mdshare projects                       # 내 프로젝트 목록
mdshare link <project-id>              # 기존 프로젝트 연결
mdshare status                         # 동기화 상태 확인
```

**사용 시나리오:**
개발자가 터미널에서 빠르게 문서를 배포하고, 파일 변경 시 자동으로 업데이트하고 싶을 때

### 방법 3: CI/CD 자동화 (팀용)

**GitHub Actions 예시:**
```yaml
# .github/workflows/deploy-docs.yml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths: ['docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to MDShare
        run: |
          npm install -g mdshare-cli
          mdshare deploy ./docs
        env:
          MDSHARE_TOKEN: ${{ secrets.MDSHARE_TOKEN }}
          MDSHARE_PROJECT: ${{ secrets.MDSHARE_PROJECT }}
```

**사용 시나리오:**
개발 팀이 Git push 시 자동으로 문서를 업데이트하고, 항상 최신 상태를 유지하고 싶을 때

## 🔑 API 키 시스템

### User API Token

**개요:**
- 계정 전체에 대한 권한
- Settings > API Tokens에서 생성
- 여러 프로젝트에 사용 가능
- 만료 기간 설정 (30일, 90일, 무제한)

**용도:**
- CLI 로그인
- CI/CD 인증

**특징:**
- 전체 계정 권한
- 모든 프로젝트 접근 가능
- 개인 개발 환경에 적합

### Project Deploy Key

**개요:**
- 특정 프로젝트만 배포 가능
- 읽기 전용 vs 쓰기 권한
- 프로젝트 Settings > Deploy Keys에서 생성

**용도:**
- CI/CD 파이프라인 (권한 최소화)
- 특정 프로젝트 자동 배포

**특징:**
- 단일 프로젝트 제한
- 권한 최소화 (보안 강화)
- CI/CD 환경에 적합

## 🛡️ 보안 설계

### 토큰 보안 정책
1. **토큰 생성 시 한 번만 표시** (재확인 불가)
2. **암호화 저장** (bcrypt)
3. **IP 화이트리스트** (엔터프라이즈)
4. **사용 로그 추적**
5. **의심 활동 시 자동 비활성화**

### 권한 계층 구조
```
User API Token
└─ 계정 전체 권한
   ├─ 모든 프로젝트 읽기/쓰기
   ├─ 프로젝트 생성/삭제
   └─ 설정 변경

Project Deploy Key
└─ 단일 프로젝트 제한
   ├─ 읽기 전용 (Read-only)
   │   └─ 프로젝트 정보 조회
   └─ 쓰기 권한 (Read/Write)
       ├─ 파일 업로드
       └─ 파일 삭제
```

## 📊 배포 방법 비교

| 항목 | 데스크톱 앱 | CLI | CI/CD |
|------|-----------|-----|-------|
| **진입 장벽** | 낮음 | 중간 | 높음 |
| **대상 사용자** | 비개발자 | 개발자 | 개발 팀 |
| **자동화** | 선택적 | 가능 (--watch) | 완전 자동 |
| **설정 복잡도** | 매우 쉬움 | 쉬움 | 중간 |
| **사용 빈도** | 가끔 | 자주 | 항상 |
| **권한 관리** | User Token | User Token | Deploy Key |
| **적합한 상황** | 1회성 업로드 | 반복 작업 | 지속적 배포 |
