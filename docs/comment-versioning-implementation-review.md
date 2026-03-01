# 댓글 버전 연동 구현/리뷰 노트

작성일: 2026-03-01

## 구현 범위
- 타입 추가: `services/mdshare-web/src/types/comment.d.ts`
- API 추가: `services/mdshare-web/src/app/api/workspaces/[id]/documents/[docId]/comments/route.ts`

## 핵심 설계 반영
1. 댓글은 문서 `slug` 기준으로 연속성 유지 (`documentSlug`)
2. 댓글 작성 시점 버전 저장 (`docVersionAtWrite`)
3. 조회 시 현재 버전과 비교해 `isOutdated` 표시
4. 상태 분리: `active | stale | orphaned`
5. 수동 마이그레이션 지원: `PATCH` with `migrateToCurrentVersion`

## API 동작 요약
- `GET` : 댓글 목록 + 버전 불일치 정보 + 요약 통계
- `POST` : 댓글 생성 (viewer 차단)
- `PATCH` : 상태 변경/버전 마이그레이션 (admin/editor만)

## 코드 리뷰 메모
### 잘된 점
- 문서 버전 변경 시 토론 연속성 유지 + 맥락 정보(작성 버전) 동시 보존
- 역할 기반 제어(admin/editor/member/viewer) 반영
- stale/orphaned 개념으로 UI 확장 여지 확보

### 남은 TODO (권장)
1. Mock 저장소 -> 실제 DB 테이블/인덱스 적용
2. stable block id(anchor) 유효성 검증기 추가
3. 자동 stale 전환 배치(문서 버전 변경 이벤트 훅)
4. 댓글 마이그레이션 이력 감사로그
5. 테스트 코드(권한/상태전이/버전비교) 추가

## 검증 상태
- 로컬 타입체크는 `tsc` 미설치로 미실행 (환경 의존)
- 런타임 API 구조/권한 로직은 코드 기준 검토 완료
