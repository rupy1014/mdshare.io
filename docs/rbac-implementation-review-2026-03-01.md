# RBAC 구현 리뷰 (2026-03-01)

## 반영 내용

### 1) 공통 RBAC 유틸 추가
- 파일: `services/mdshare-web/src/lib/rbac.ts`
- 기능:
  - 역할 계층 정의(owner > admin > editor > member > viewer)
  - `hasRoleAtLeast` 권한 비교
  - 명령별 필요 권한 매핑
  - `getPermissionSnapshot` (whoami 용)

### 2) 권한 확인 API 추가
- 파일: `services/mdshare-web/src/app/api/auth/permissions/route.ts`
- 기능:
  - 현재 사용자 role 및 명령 권한 스냅샷 반환
  - `workspaceId` 쿼리로 워크스페이스별 권한 조회

### 3) promote 엔드포인트 추가
- 파일: `services/mdshare-web/src/app/api/workspaces/[id]/documents/[docId]/promote/route.ts`
- 기능:
  - admin 이상만 실행 가능
  - 상태 전이 제한 (`draft -> reviewed -> canonical`)
  - 불법 전이 방지

### 4) 기존 API RBAC 적용 강화
- 문서 생성 API: member 이상
- 댓글 작성 API: member 이상
- 댓글 상태 변경 API: editor 이상

## 코드리뷰 요약

### 장점
- 권한 체크가 공통 함수로 통일되어 중복/오류 감소
- promote 상태 전이 규칙이 서버에서 강제됨
- whoami-permissions 기반으로 클라이언트 UX(버튼 비활성화) 연결 가능

### 남은 작업
1. mock member/document store -> 실제 DB 연동
2. 권한 변경/승격 이벤트 감사로그 저장
3. 명령 권한 매핑을 정책파일(`openhow.policy.json`)로 외부화
4. 테스트 코드 추가 (권한/전이 케이스)
