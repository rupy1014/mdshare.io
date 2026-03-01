import { NextRequest, NextResponse } from 'next/server'
import { getPermissionSnapshot, type WorkspaceRole } from '@/lib/rbac'

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

export async function GET(request: NextRequest) {
  const userId = getUserIdFromAuth(request)
  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })
  }

  const workspaceId = request.nextUrl.searchParams.get('workspaceId') || 'workspace-1'
  const member = mockMembers.find((m) => m.workspaceId === workspaceId && m.userId === userId)

  if (!member) {
    return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })
  }

  return NextResponse.json({
    success: true,
    data: {
      workspaceId,
      ...getPermissionSnapshot(member.role),
    },
  })
}
