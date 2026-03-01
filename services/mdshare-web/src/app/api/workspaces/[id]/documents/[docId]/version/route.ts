import { NextRequest, NextResponse } from 'next/server'
import { hasRoleAtLeast } from '@/lib/rbac'
import { appendAuditLog } from '@/lib/audit-log'
import { getDocuments, getMembers, markCommentsStaleForDocumentVersion, saveDocuments } from '@/lib/repositories'

function getUserIdFromAuth(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  const m = token.match(/access-token-(user-\d+)-/)
  return m?.[1] ?? null
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; docId: string }> }
) {
  const { id: workspaceId, docId } = await context.params
  const userId = getUserIdFromAuth(request)
  if (!userId) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })

  const members = await getMembers()
  const member = members.find((m) => m.workspaceId === workspaceId && m.userId === userId)
  if (!member) return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })

  if (!hasRoleAtLeast(member.role, 'editor')) {
    appendAuditLog({ actorId: userId, actorRole: member.role, workspaceId, action: 'doc:version-bump', targetType: 'document', targetId: docId, result: 'deny', meta: { reason: 'role<editor' } })
    return NextResponse.json({ success: false, error: { code: 'INSUFFICIENT_PERMISSIONS', message: '문서 버전 변경은 editor 이상만 가능합니다' } }, { status: 403 })
  }

  const body = await request.json()
  const nextVersion = String(body?.version ?? '').trim()
  if (!nextVersion) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'version을 입력해주세요' } }, { status: 400 })
  }

  const docs = await getDocuments()
  const idx = docs.findIndex((d) => d.workspaceId === workspaceId && d.id === docId)
  if (idx < 0) return NextResponse.json({ success: false, error: { code: 'DOCUMENT_NOT_FOUND', message: '문서를 찾을 수 없습니다' } }, { status: 404 })

  const prevVersion = docs[idx].version
  docs[idx] = { ...docs[idx], version: nextVersion, updatedAt: new Date().toISOString() }
  await saveDocuments(docs)

  const staleCount = await markCommentsStaleForDocumentVersion(workspaceId, docId, nextVersion)

  appendAuditLog({
    actorId: userId,
    actorRole: member.role,
    workspaceId,
    action: 'doc:version-bump',
    targetType: 'document',
    targetId: docId,
    result: 'success',
    meta: { prevVersion, nextVersion, staleCount },
  })

  return NextResponse.json({ success: true, data: { document: docs[idx], staleCount } })
}
