import { NextRequest, NextResponse } from 'next/server'
import { getPermissionSnapshot } from '@/lib/rbac'
import { getMembers } from '@/lib/repositories'

function getUserIdFromAuth(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  const m = token.match(/access-token-(user-\d+)-/)
  return m?.[1] ?? null
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromAuth(request)
  if (!userId) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })

  const workspaceId = request.nextUrl.searchParams.get('workspaceId') || 'workspace-1'
  const members = await getMembers()
  const member = members.find((m) => m.workspaceId === workspaceId && m.userId === userId)
  if (!member) return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })

  return NextResponse.json({ success: true, data: { workspaceId, ...getPermissionSnapshot(member.role) } })
}
