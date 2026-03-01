import { readJsonFile, writeJsonFile } from '@/lib/persistence'
import type { WorkspaceRole } from '@/lib/rbac'
import type { Comment } from '@/types/comment'

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

export async function getComments(): Promise<Comment[]> {
  const rows = await readJsonFile<Array<Omit<Comment, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }>>('comments.json', [])
  return rows.map((r) => ({ ...r, createdAt: new Date(r.createdAt), updatedAt: new Date(r.updatedAt) }))
}

export async function saveComments(rows: Comment[]): Promise<void> {
  await writeJsonFile('comments.json', rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() })))
}
