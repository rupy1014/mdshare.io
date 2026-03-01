# 진행 현황 (Phase 2)

## 이번 단계 완료
- 댓글 저장 전략 개선: 전체 replace -> 문서 범위(scope) replace
- 문서 버전 변경 API 추가:
  - `PATCH /api/workspaces/:id/documents/:docId/version`
  - 버전 변경 시 해당 문서 댓글 자동 `stale` 전환
- 감사로그에 version-bump 이벤트 기록

## 핵심 효과
- 다른 문서 댓글 오염 없이 대상 문서만 업데이트
- 버전 변경과 댓글 상태 불일치 자동 정리
- 운영 관점에서 누가 버전을 바꿨는지 추적 가능
