import { readJsonFile, writeJsonFile } from '@/lib/persistence'
import { getDb } from '@/lib/db/client'
import { auditLogs } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

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

  // best-effort async persistence (DB first, file fallback)
  void (async () => {
    const db = getDb()
    if (db) {
      await db.insert(auditLogs).values({
        id: row.id,
        workspaceId: row.workspaceId,
        actorId: row.actorId,
        actorRole: row.actorRole,
        action: row.action,
        targetType: row.targetType,
        targetId: row.targetId ?? null,
        result: row.result,
        metaJson: row.meta ? JSON.stringify(row.meta) : null,
        createdAt: row.createdAt,
      })
      return
    }

    const rows = await readJsonFile<Persisted[]>(FILE, [])
    rows.unshift({ ...row, createdAt: row.createdAt.toISOString() })
    await writeJsonFile(FILE, rows.slice(0, 5000))
  })()

  return row
}

export async function listAuditLogs(workspaceId: string, limit = 100): Promise<AuditLogEntry[]> {
  const db = getDb()
  if (db) {
    const rows = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, workspaceId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)

    return rows.map((r) => ({
      id: r.id,
      actorId: r.actorId,
      actorRole: r.actorRole,
      workspaceId: r.workspaceId,
      action: r.action,
      targetType: r.targetType as AuditLogEntry['targetType'],
      targetId: r.targetId ?? undefined,
      result: r.result as AuditLogEntry['result'],
      meta: r.metaJson ? JSON.parse(r.metaJson) : undefined,
      createdAt: new Date(r.createdAt),
    }))
  }

  const rows = await readJsonFile<Persisted[]>(FILE, [])
  return rows
    .filter((r) => r.workspaceId === workspaceId)
    .slice(0, limit)
    .map((r) => ({ ...r, createdAt: new Date(r.createdAt) }))
}
