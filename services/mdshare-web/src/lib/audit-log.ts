import { readJsonFile, writeJsonFile } from '@/lib/persistence'

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

type Persisted = Omit<AuditLogEntry, 'createdAt'> & { createdAt: string }

const FILE = 'audit_logs.json'

export function appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>): AuditLogEntry {
  const row: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date(),
    ...entry,
  }

  // best-effort async persistence
  void (async () => {
    const rows = await readJsonFile<Persisted[]>(FILE, [])
    rows.unshift({ ...row, createdAt: row.createdAt.toISOString() })
    await writeJsonFile(FILE, rows.slice(0, 5000))
  })()

  return row
}

export async function listAuditLogs(workspaceId: string, limit = 100): Promise<AuditLogEntry[]> {
  const rows = await readJsonFile<Persisted[]>(FILE, [])
  return rows
    .filter((r) => r.workspaceId === workspaceId)
    .slice(0, limit)
    .map((r) => ({ ...r, createdAt: new Date(r.createdAt) }))
}
