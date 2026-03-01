import { readJsonFile, writeJsonFile } from '@/lib/persistence'
import type { WorkspaceRole } from '@/lib/rbac'
import type { Comment } from '@/types/comment'
import { getDb, isDbStrictMode } from '@/lib/db/client'
import { comments as commentsTable } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

type Member = { workspaceId: string; userId: string; role: WorkspaceRole }
type DocStatus = 'draft' | 'reviewed' | 'canonical'
type DocRow = {
  id: string
  workspaceId: string
  slug: string
  title: string
  status: DocStatus
  version: string
  updatedAt: string
}

const defaultMembers: Member[] = [
  { workspaceId: 'workspace-1', userId: 'user-1', role: 'admin' },
  { workspaceId: 'workspace-1', userId: 'user-2', role: 'editor' },
  { workspaceId: 'workspace-1', userId: 'user-3', role: 'viewer' },
]

const defaultDocs: DocRow[] = [
  { id: 'doc-1', workspaceId: 'workspace-1', slug: 'api-auth', title: 'API 문서 - 사용자 인증', status: 'draft', version: '1.2.0', updatedAt: new Date().toISOString() },
  { id: 'doc-2', workspaceId: 'workspace-1', slug: 'workspace-api', title: '워크스페이스 API', status: 'reviewed', version: '1.0.0', updatedAt: new Date().toISOString() },
]

export async function getMembers(): Promise<Member[]> {
  return readJsonFile<Member[]>('members.json', defaultMembers)
}

export async function getDocuments(): Promise<DocRow[]> {
  return readJsonFile<DocRow[]>('documents.json', defaultDocs)
}

export async function saveDocuments(rows: DocRow[]): Promise<void> {
  await writeJsonFile('documents.json', rows)
}

export async function getComments(workspaceId?: string, documentId?: string): Promise<Comment[]> {
  const db = getDb()
  if (db) {
    const where = workspaceId && documentId
      ? and(eq(commentsTable.workspaceId, workspaceId), eq(commentsTable.documentId, documentId))
      : workspaceId
      ? eq(commentsTable.workspaceId, workspaceId)
      : undefined

    const rows = where ? await db.select().from(commentsTable).where(where) : await db.select().from(commentsTable)

    return rows.map((r) => ({
      id: r.id,
      workspaceId: r.workspaceId,
      documentId: r.documentId,
      documentSlug: r.documentSlug,
      anchorId: r.anchorId ?? undefined,
      authorId: r.authorId,
      authorName: r.authorName,
      content: r.content,
      status: r.status as Comment['status'],
      docVersionAtWrite: r.docVersionAtWrite,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
    }))
  }

  if (isDbStrictMode()) {
    throw new Error('DB_STRICT is enabled: file fallback for comments is disabled')
  }

  const rows = await readJsonFile<Array<Omit<Comment, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }>>('comments.json', [])
  const mapped = rows.map((r) => ({ ...r, createdAt: new Date(r.createdAt), updatedAt: new Date(r.updatedAt) }))
  return mapped.filter((r) => (!workspaceId || r.workspaceId === workspaceId) && (!documentId || r.documentId === documentId))
}

export async function saveComments(
  rows: Comment[],
  scope?: { workspaceId: string; documentId: string }
): Promise<void> {
  const db = getDb()
  if (db) {
    // Scope-aware replace: only update target document's comment set.
    if (scope) {
      await db
        .delete(commentsTable)
        .where(and(eq(commentsTable.workspaceId, scope.workspaceId), eq(commentsTable.documentId, scope.documentId)))
    } else {
      await db.delete(commentsTable)
    }

    if (rows.length > 0) {
      await db.insert(commentsTable).values(
        rows.map((r) => ({
          id: r.id,
          workspaceId: r.workspaceId,
          documentId: r.documentId,
          documentSlug: r.documentSlug,
          anchorId: r.anchorId ?? null,
          authorId: r.authorId,
          authorName: r.authorName,
          content: r.content,
          status: r.status,
          docVersionAtWrite: r.docVersionAtWrite,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }))
      )
    }
    return
  }

  if (isDbStrictMode()) {
    throw new Error('DB_STRICT is enabled: file fallback for comments is disabled')
  }

  const persisted = await readJsonFile<Array<Omit<Comment, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }>>('comments.json', [])
  let merged = persisted.map((r) => ({ ...r, createdAt: new Date(r.createdAt), updatedAt: new Date(r.updatedAt) }))

  if (scope) {
    merged = merged.filter((r) => !(r.workspaceId === scope.workspaceId && r.documentId === scope.documentId))
  } else {
    merged = []
  }

  merged.push(...rows)

  await writeJsonFile(
    'comments.json',
    merged.map((r) => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() }))
  )
}

export async function markCommentsStaleForDocumentVersion(
  workspaceId: string,
  documentId: string,
  nextVersion: string
): Promise<number> {
  const rows = await getComments(workspaceId, documentId)
  let changed = 0
  const nextRows = rows.map((r) => {
    if (r.docVersionAtWrite !== nextVersion && r.status !== 'orphaned') {
      changed += 1
      return { ...r, status: 'stale' as const, updatedAt: new Date() }
    }
    return r
  })

  if (changed > 0) {
    await saveComments(nextRows, { workspaceId, documentId })
  }

  return changed
}
