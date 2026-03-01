import { NextRequest, NextResponse } from 'next/server'
import { hasRoleAtLeast, type WorkspaceRole } from '@/lib/rbac'

type DocStatus = 'draft' | 'reviewed' | 'canonical'

const mockMembers = [
  { workspaceId: 'workspace-1', userId: 'user-1', role: 'admin' as WorkspaceRole },
  { workspaceId: 'workspace-1', userId: 'user-2', role: 'editor' as WorkspaceRole },
  { workspaceId: 'workspace-1', userId: 'user-3', role: 'viewer' as WorkspaceRole },
]

const mockDocs: Array<{ id: string; workspaceId: string; title: string; status: DocStatus; updatedAt: Date }> = [
  { id: 'doc-1', workspaceId: 'workspace-1', title: 'API 문서 - 사용자 인증', status: 'draft', updatedAt: new Date() },
  { id: 'doc-2', workspaceId: 'workspace-1', title: '워크스페이스 API', status: 'reviewed', updatedAt: new Date() },
]

function getUserIdFromAuth(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  const m = token.match(/access-token-(user-\d+)-/)
  return m?.[1] ?? null
}

const allowedNext: Record<DocStatus, DocStatus[]> = {
  draft: ['reviewed'],
  reviewed: ['canonical'],
  canonical: [],
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; docId: string }> }
) {
  const { id: workspaceId, docId } = await context.params
  const userId = getUserIdFromAuth(request)

  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })
  }

  const member = mockMembers.find((m) => m.workspaceId === workspaceId && m.userId === userId)
  if (!member) {
    return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })
  }

  if (!hasRoleAtLeast(member.role, 'admin')) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INSUFFICIENT_PERMISSIONS',
        message: "Permission denied: command 'promote' requires role >= admin.",
      },
    }, { status: 403 })
  }

  const doc = mockDocs.find((d) => d.workspaceId === workspaceId && d.id === docId)
  if (!doc) {
    return NextResponse.json({ success: false, error: { code: 'DOCUMENT_NOT_FOUND', message: '문서를 찾을 수 없습니다' } }, { status: 404 })
  }

  const body = await request.json()
  const target = body?.targetStatus as DocStatus | undefined
  if (!target || !['reviewed', 'canonical'].includes(target)) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_TARGET', message: 'targetStatus는 reviewed 또는 canonical 이어야 합니다' } }, { status: 400 })
  }

  if (!allowedNext[doc.status].includes(target)) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INVALID_TRANSITION',
        message: `허용되지 않는 상태 전이입니다: ${doc.status} -> ${target}`,
      },
    }, { status: 409 })
  }

  doc.status = target
  doc.updatedAt = new Date()

  return NextResponse.json({ success: true, data: doc })
}
