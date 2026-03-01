export interface AuditLogEntry {
  id: string
  actorId: string
  actorRole: string
  workspaceId: string
  action: string
  targetType: 'document' | 'comment' | 'workspace' | 'auth'
  targetId?: string
  result: 'success' | 'deny' | 'fail'
  meta?: Record<string, unknown>
  createdAt: Date
}

// TODO: Replace with DB persistence when mdshare-web DB layer is stabilized.
const auditStore: AuditLogEntry[] = []

export function appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>): AuditLogEntry {
  const row: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date(),
    ...entry,
  }
  auditStore.unshift(row)
  return row
}

export function listAuditLogs(workspaceId: string, limit = 100): AuditLogEntry[] {
  return auditStore.filter((r) => r.workspaceId === workspaceId).slice(0, limit)
}
