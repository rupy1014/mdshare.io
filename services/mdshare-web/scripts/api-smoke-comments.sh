#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:7778}"
TOKEN="${TOKEN:-access-token-user-1-demo}"
WS="${WS:-workspace-1}"
DOC="${DOC:-doc-1}"

echo "[1] GET permissions"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/auth/permissions?workspaceId=$WS" | head -c 400; echo

echo "[2] POST comment"
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"content":"smoke test comment","anchorId":"heading-auth-flow"}' \
  "$BASE_URL/api/workspaces/$WS/documents/$DOC/comments" | head -c 500; echo

echo "[3] PATCH version bump"
curl -s -X PATCH -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"version":"1.2.1"}' \
  "$BASE_URL/api/workspaces/$WS/documents/$DOC/version" | head -c 500; echo

echo "[4] GET comments"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/workspaces/$WS/documents/$DOC/comments" | head -c 700; echo

echo "[5] GET audit"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/workspaces/$WS/audit" | head -c 700; echo

echo "done"
