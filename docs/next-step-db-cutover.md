# DB Cutover 메모 (RBAC/댓글)

## 이번 반영
- `src/lib/db/client.ts` 추가 (DATABASE_URL/TURSO_DATABASE_URL 기반)
- `src/lib/db/schema.ts` 추가 (`comments`, `audit_logs`)
- `audit-log.ts` DB 우선 저장 + 파일 fallback
- `repositories.ts` 댓글 조회/저장 DB 우선 + 파일 fallback

## 환경변수
- `DATABASE_URL` (예: libsql://...)
- `DATABASE_AUTH_TOKEN` (필요 시)

## 주의
- 현재 `saveComments`는 단순 replace 전략(DELETE 후 INSERT)
- 다음 단계에서 upsert + 범위 업데이트로 최적화 필요
