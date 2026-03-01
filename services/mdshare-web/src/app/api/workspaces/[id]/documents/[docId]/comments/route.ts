import { NextRequest, NextResponse } from 'next/server'
import type { Comment } from '@/types/comment'

// Mock member store (same shape used by documents route)
const mockMembers = [
  { id: 'member-1', workspaceId: 'workspace-1', userId: 'user-1', role: 'admin' },
  { id: 'member-2', workspaceId: 'workspace-1', userId: 'user-2', role: 'editor' },
  { id: 'member-3', workspaceId: 'workspace-1', userId: 'user-3', role: 'viewer' },
]

// Mock document store (minimal fields needed for version-aware comments)
const mockDocuments = [
  { id: 'doc-1', workspaceId: 'workspace-1', slug: 'api-auth', version: '1.2.0' },
  { id: 'doc-2', workspaceId: 'workspace-1', slug: 'workspace-api', version: '1.0.0' },
]

let mockComments: Comment[] = [
  {
    id: 'cmt-1',
    workspaceId: 'workspace-1',
    documentId: 'doc-1',
    documentSlug: 'api-auth',
    anchorId: 'heading-auth-flow',
    authorId: 'user-2',
    authorName: '박리더',
    content: '이 부분은 2FA 예시도 같이 넣으면 좋아요.',
    status: 'active',
    docVersionAtWrite: '1.2.0',
    createdAt: new Date('2026-03-01T00:00:00Z'),
    updatedAt: new Date('2026-03-01T00:00:00Z'),
  },
]

function getUserIdFromAuth(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  const m = token.match(/access-token-(user-\d+)-/)
  return m?.[1] ?? null
}

function requireMembership(workspaceId: string, userId: string) {
  return mockMembers.find((m) => m.workspaceId === workspaceId && m.userId === userId)
}

function parseParams(context: { params: Promise<{ id: string; docId: string }> }) {
  return context.params
}

// GET comments
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; docId: string }> }
) {
  const { id: workspaceId, docId } = await parseParams(context)
  const userId = getUserIdFromAuth(request)

  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })
  }

  const membership = requireMembership(workspaceId, userId)
  if (!membership) {
    return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })
  }

  const doc = mockDocuments.find((d) => d.workspaceId === workspaceId && d.id === docId)
  if (!doc) {
    return NextResponse.json({ success: false, error: { code: 'DOCUMENT_NOT_FOUND', message: '문서를 찾을 수 없습니다' } }, { status: 404 })
  }

  const rows = mockComments.filter((c) => c.workspaceId === workspaceId && c.documentId === docId)
  const mapped = rows.map((c) => ({
    ...c,
    isOutdated: c.docVersionAtWrite !== doc.version,
    currentVersion: doc.version,
  }))

  const summary = {
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    stale: rows.filter((r) => r.status === 'stale').length,
    orphaned: rows.filter((r) => r.status === 'orphaned').length,
  }

  return NextResponse.json({ success: true, data: { comments: mapped, summary } })
}

// POST comment
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; docId: string }> }
) {
  const { id: workspaceId, docId } = await parseParams(context)
  const userId = getUserIdFromAuth(request)

  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })
  }

  const membership = requireMembership(workspaceId, userId)
  if (!membership) {
    return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })
  }

  if (membership.role === 'viewer') {
    return NextResponse.json({ success: false, error: { code: 'INSUFFICIENT_PERMISSIONS', message: '댓글 작성 권한이 없습니다' } }, { status: 403 })
  }

  const doc = mockDocuments.find((d) => d.workspaceId === workspaceId && d.id === docId)
  if (!doc) {
    return NextResponse.json({ success: false, error: { code: 'DOCUMENT_NOT_FOUND', message: '문서를 찾을 수 없습니다' } }, { status: 404 })
  }

  const body = await request.json()
  const content = String(body?.content ?? '').trim()
  const anchorId = body?.anchorId ? String(body.anchorId) : undefined

  if (!content) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: '댓글 내용을 입력해주세요' } }, { status: 400 })
  }

  const now = new Date()
  const newComment: Comment = {
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

  mockComments.push(newComment)

  return NextResponse.json({ success: true, data: newComment }, { status: 201 })
}

// PATCH comment status / migration
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; docId: string }> }
) {
  const { id: workspaceId, docId } = await parseParams(context)
  const userId = getUserIdFromAuth(request)

  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })
  }

  const membership = requireMembership(workspaceId, userId)
  if (!membership) {
    return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })
  }

  if (!['admin', 'editor'].includes(membership.role)) {
    return NextResponse.json({ success: false, error: { code: 'INSUFFICIENT_PERMISSIONS', message: '댓글 상태 변경 권한이 없습니다' } }, { status: 403 })
  }

  const doc = mockDocuments.find((d) => d.workspaceId === workspaceId && d.id === docId)
  if (!doc) {
    return NextResponse.json({ success: false, error: { code: 'DOCUMENT_NOT_FOUND', message: '문서를 찾을 수 없습니다' } }, { status: 404 })
  }

  const body = await request.json()
  const commentId = String(body?.commentId ?? '')
  const status = body?.status as Comment['status'] | undefined
  const migrateToCurrentVersion = Boolean(body?.migrateToCurrentVersion)

  const row = mockComments.find((c) => c.id === commentId && c.workspaceId === workspaceId && c.documentId === docId)
  if (!row) {
    return NextResponse.json({ success: false, error: { code: 'COMMENT_NOT_FOUND', message: '댓글을 찾을 수 없습니다' } }, { status: 404 })
  }

  if (status && !['active', 'stale', 'orphaned'].includes(status)) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_STATUS', message: '허용되지 않는 상태값입니다' } }, { status: 400 })
  }

  if (status) row.status = status
  if (migrateToCurrentVersion) row.docVersionAtWrite = doc.version
  row.updatedAt = new Date()

  return NextResponse.json({ success: true, data: row })
}
