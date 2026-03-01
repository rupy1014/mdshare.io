import { NextRequest, NextResponse } from 'next/server'
import { hasRoleAtLeast } from '@/lib/rbac'
import { appendAuditLog } from '@/lib/audit-log'
import { getDocuments, getMembers, saveDocuments } from '@/lib/repositories'

type DocStatus = 'draft' | 'reviewed' | 'canonical'

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

export async function POST(request: NextRequest, context: { params: Promise<{ id: string; docId: string }> }) {
  const { id: workspaceId, docId } = await context.params
  const userId = getUserIdFromAuth(request)
  if (!userId) return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다' } }, { status: 401 })

  const members = await getMembers()
  const member = members.find((m) => m.workspaceId === workspaceId && m.userId === userId)
  if (!member) return NextResponse.json({ success: false, error: { code: 'ACCESS_DENIED', message: '워크스페이스 접근 권한이 없습니다' } }, { status: 403 })

  if (!hasRoleAtLeast(member.role, 'admin')) {
    appendAuditLog({ actorId: userId, actorRole: member.role, workspaceId, action: 'promote', targetType: 'document', targetId: docId, result: 'deny', meta: { reason: 'role<admin' } })
    return NextResponse.json({ success: false, error: { code: 'INSUFFICIENT_PERMISSIONS', message: "Permission denied: command 'promote' requires role >= admin." } }, { status: 403 })
  }

  const docs = await getDocuments()
  const idx = docs.findIndex((d) => d.workspaceId === workspaceId && d.id === docId)
  if (idx < 0) return NextResponse.json({ success: false, error: { code: 'DOCUMENT_NOT_FOUND', message: '문서를 찾을 수 없습니다' } }, { status: 404 })

  const body = await request.json()
  const target = body?.targetStatus as DocStatus | undefined
  if (!target || !['reviewed', 'canonical'].includes(target)) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_TARGET', message: 'targetStatus는 reviewed 또는 canonical 이어야 합니다' } }, { status: 400 })
  }

  const current = docs[idx].status as DocStatus
  if (!allowedNext[current].includes(target)) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_TRANSITION', message: `허용되지 않는 상태 전이입니다: ${current} -> ${target}` } }, { status: 409 })
  }

  docs[idx] = { ...docs[idx], status: target, updatedAt: new Date().toISOString() }
  await saveDocuments(docs)

  appendAuditLog({ actorId: userId, actorRole: member.role, workspaceId, action: 'promote', targetType: 'document', targetId: docId, result: 'success', meta: { to: target } })
  return NextResponse.json({ success: true, data: docs[idx] })
}
