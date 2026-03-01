import { NextRequest, NextResponse } from 'next/server'
import type { Comment } from '@/types/comment'
import { hasRoleAtLeast } from '@/lib/rbac'
import { appendAuditLog } from '@/lib/audit-log'
import { getComments, getDocuments, getMembers, saveComments } from '@/lib/repositories'
import { isValidAnchorId } from '@/lib/anchor'

function getUserIdFromAuth(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  const m = token.match(/access-token-(user-\d+)-/)
  return m?.[1] ?? null
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string; docId: string }> }) {
  const { id: workspaceId, docId } = await context.params
  const userId = getUserIdFromAuth(request)
  if (!userId) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })

  const members = await getMembers()
  const membership = members.find((m) => m.workspaceId === workspaceId && m.userId === userId)
  if (!membership) return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })

  const docs = await getDocuments()
  const doc = docs.find((d) => d.workspaceId === workspaceId && d.id === docId)
  if (!doc) return NextResponse.json({ success: false, error: { code: 'DOCUMENT_NOT_FOUND', message: '문서를 찾을 수 없습니다' } }, { status: 404 })

  const rows = await getComments(workspaceId, docId)
  const mapped = rows.map((c) => ({ ...c, isOutdated: c.docVersionAtWrite !== doc.version, currentVersion: doc.version }))
  const summary = {
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    stale: rows.filter((r) => r.status === 'stale').length,
    orphaned: rows.filter((r) => r.status === 'orphaned').length,
  }
  return NextResponse.json({ success: true, data: { comments: mapped, summary } })
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string; docId: string }> }) {
  const { id: workspaceId, docId } = await context.params
  const userId = getUserIdFromAuth(request)
  if (!userId) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })

  const members = await getMembers()
  const membership = members.find((m) => m.workspaceId === workspaceId && m.userId === userId)
  if (!membership) return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })

  if (!hasRoleAtLeast(membership.role, 'member')) {
    appendAuditLog({ actorId: userId, actorRole: membership.role, workspaceId, action: 'comment:create', targetType: 'comment', result: 'deny', meta: { reason: 'role<member', documentId: docId } })
    return NextResponse.json({ success: false, error: { code: 'INSUFFICIENT_PERMISSIONS', message: '댓글 작성 권한이 없습니다 (member 이상 필요)' } }, { status: 403 })
  }

  const docs = await getDocuments()
  const doc = docs.find((d) => d.workspaceId === workspaceId && d.id === docId)
  if (!doc) return NextResponse.json({ success: false, error: { code: 'DOCUMENT_NOT_FOUND', message: '문서를 찾을 수 없습니다' } }, { status: 404 })

  const body = await request.json()
  const content = String(body?.content ?? '').trim()
  const anchorId = body?.anchorId ? String(body.anchorId) : undefined
  if (!content) return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: '댓글 내용을 입력해주세요' } }, { status: 400 })
  if (!isValidAnchorId(anchorId)) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_ANCHOR', message: 'anchorId 형식이 올바르지 않습니다' } }, { status: 400 })
  }

  const rows = await getComments()
  const now = new Date()
  const row: Comment = {
    id: `cmt-${Date.now()}`,
    workspaceId,
    documentId: doc.id,
    documentSlug: doc.slug,
    anchorId,
    authorId: userId,
    authorName: '사용자',
    content,
    status: 'active',
    docVersionAtWrite: doc.version,
    createdAt: now,
    updatedAt: now,
  }
  rows.push(row)
  await saveComments(rows, { workspaceId, documentId: docId })

  appendAuditLog({ actorId: userId, actorRole: membership.role, workspaceId, action: 'comment:create', targetType: 'comment', targetId: row.id, result: 'success', meta: { documentId: docId, anchorId } })
  return NextResponse.json({ success: true, data: row }, { status: 201 })
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string; docId: string }> }) {
  const { id: workspaceId, docId } = await context.params
  const userId = getUserIdFromAuth(request)
  if (!userId) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })

  const members = await getMembers()
  const membership = members.find((m) => m.workspaceId === workspaceId && m.userId === userId)
  if (!membership) return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })

  if (!hasRoleAtLeast(membership.role, 'editor')) {
    appendAuditLog({ actorId: userId, actorRole: membership.role, workspaceId, action: 'comment:patch', targetType: 'comment', result: 'deny', meta: { reason: 'role<editor', documentId: docId } })
    return NextResponse.json({ success: false, error: { code: 'INSUFFICIENT_PERMISSIONS', message: '댓글 상태 변경 권한이 없습니다 (editor 이상 필요)' } }, { status: 403 })
  }

  const docs = await getDocuments()
  const doc = docs.find((d) => d.workspaceId === workspaceId && d.id === docId)
  if (!doc) return NextResponse.json({ success: false, error: { code: 'DOCUMENT_NOT_FOUND', message: '문서를 찾을 수 없습니다' } }, { status: 404 })

  const body = await request.json()
  const commentId = String(body?.commentId ?? '')
  const status = body?.status as Comment['status'] | undefined
  const migrateToCurrentVersion = Boolean(body?.migrateToCurrentVersion)

  const rows = await getComments()
  const idx = rows.findIndex((c) => c.id === commentId && c.workspaceId === workspaceId && c.documentId === docId)
  if (idx < 0) return NextResponse.json({ success: false, error: { code: 'COMMENT_NOT_FOUND', message: '댓글을 찾을 수 없습니다' } }, { status: 404 })

  if (status && !['active', 'stale', 'orphaned'].includes(status)) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_STATUS', message: '허용되지 않는 상태값입니다' } }, { status: 400 })
  }

  if (status) rows[idx].status = status
  if (migrateToCurrentVersion) rows[idx].docVersionAtWrite = doc.version
  rows[idx].updatedAt = new Date()
  await saveComments(rows, { workspaceId, documentId: docId })

  appendAuditLog({ actorId: userId, actorRole: membership.role, workspaceId, action: 'comment:patch', targetType: 'comment', targetId: rows[idx].id, result: 'success', meta: { documentId: docId, status, migrateToCurrentVersion } })
  return NextResponse.json({ success: true, data: rows[idx] })
}
