import { NextRequest, NextResponse } from 'next/server'
import { hasRoleAtLeast, type WorkspaceRole } from '@/lib/rbac'
import { listAuditLogs } from '@/lib/audit-log'

const mockMembers = [
  { workspaceId: 'workspace-1', userId: 'user-1', role: 'admin' as WorkspaceRole },
  { workspaceId: 'workspace-1', userId: 'user-2', role: 'editor' as WorkspaceRole },
  { workspaceId: 'workspace-1', userId: 'user-3', role: 'viewer' as WorkspaceRole },
]

function getUserIdFromAuth(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  const m = token.match(/access-token-(user-\d+)-/)
  return m?.[1] ?? null
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = await context.params
  const userId = getUserIdFromAuth(request)

  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })
  }

  const member = mockMembers.find((m) => m.workspaceId === workspaceId && m.userId === userId)
  if (!member) {
    return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })
  }

  if (!hasRoleAtLeast(member.role, 'admin')) {
    return NextResponse.json({ success: false, error: { code: 'INSUFFICIENT_PERMISSIONS', message: '감사 로그 조회는 admin 이상만 가능합니다' } }, { status: 403 })
  }

  const limit = Number(request.nextUrl.searchParams.get('limit') || 100)
  const rows = listAuditLogs(workspaceId, Number.isFinite(limit) ? Math.max(1, Math.min(limit, 500)) : 100)
  return NextResponse.json({ success: true, data: rows })
}
