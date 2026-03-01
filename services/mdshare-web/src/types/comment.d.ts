export type CommentStatus = 'active' | 'stale' | 'orphaned'

export interface Comment {
  id: string
  workspaceId: string
  documentId: string
  documentSlug: string
  anchorId?: string
  authorId: string
  authorName: string
  content: string
  status: CommentStatus
  // Version captured when comment was written
  docVersionAtWrite: string
  createdAt: Date
  updatedAt: Date
}

export interface CommentThreadSummary {
  total: number
  active: number
  stale: number
  orphaned: number
}
