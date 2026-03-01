import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull(),
  documentId: text('document_id').notNull(),
  documentSlug: text('document_slug').notNull(),
  anchorId: text('anchor_id'),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  content: text('content').notNull(),
  status: text('status').notNull().default('active'),
  docVersionAtWrite: text('doc_version_at_write').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull(),
  actorId: text('actor_id').notNull(),
  actorRole: text('actor_role').notNull(),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id'),
  result: text('result').notNull(),
  metaJson: text('meta_json'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
})
