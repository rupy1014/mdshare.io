interface Document {
  id: string
  workspaceId: string
  path: string
  title: string
  content: string
  metadata: DocumentMetadata
  createdAt: Date
  updatedAt: Date
}

interface DocumentMetadata {
  wordCount: number
  readingTime: number
  author: string
  tags: string[]
  lastModified: Date
  version: string
  claudeOptimized: boolean
  gitHash?: string
  gitLastCommit?: Date
  syncStatus?: 'synced' | 'modified' | 'conflict' | 'pending'
}

interface DocumentSyncInfo {
  documentId: string
  localPath: string
  remotePath: string
  gitHash: string
  lastSync: Date
  status: 'synced' | 'modified' | 'conflict' | 'pending'
  conflicts?: DocumentConflict[]
}

interface DocumentConflict {
  field: 'content' | 'metadata' | 'path'
  localValue: any
  remoteValue: any
  resolution?: 'local' | 'remote' | 'merge'
}

interface SyncRequest {
  workspaceId: string
  documents: DocumentSyncInfo[]
  strategy: 'push' | 'pull' | 'sync'
}

interface SyncResponse {
  success: boolean
  syncedDocuments: DocumentSyncInfo[]
  conflicts: DocumentConflict[]
  errors: SyncError[]
}

interface SyncError {
  documentId: string
  error: string
  code: string
}

interface ClaudeCodeIntegration {
  workspaceId: string
  claudeCommands: ClaudeCommand[]
  indexingFiles: IndexingFile[]
  lastIndexed: Date
}

interface ClaudeCommand {
  id: string
  name: string
  description: string
  command: string
  category: 'search' | 'analyze' | 'generate' | 'optimize'
  examples: string[]
}

interface IndexingFile {
  id: string
  name: string
  content: string
  type: 'index' | 'summary' | 'relationships'
  generatedAt: Date
}

interface DocumentAnalysis {
  documentId: string
  analysis: {
    topics: string[]
    entities: string[]
    relationships: DocumentRelationship[]
    readability: number
    claudeScore: number
    suggestions: string[]
  }
  generatedAt: Date
}

interface DocumentRelationship {
  sourceDocumentId: string
  targetDocumentId: string
  relationshipType: 'references' | 'similar' | 'depends_on' | 'related_to'
  strength: number
  description: string
}
