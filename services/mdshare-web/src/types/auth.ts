export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: Date
  lastLoginAt?: Date
}

export interface Workspace {
  id: string
  name: string
  description: string
  visibility: 'private' | 'public'
  ownerId: string
  createdAt: Date
  updatedAt: Date
  memberCount: number
  settings: WorkspaceSettings
}

export interface WorkspaceSettings {
  allowInvites: boolean
  defaultRole: 'editor' | 'viewer'
  requireApproval: boolean
  gitIntegration: boolean
}

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: 'admin' | 'editor' | 'viewer'
  joinedAt: Date
  invitedBy: string
  user: User
}

export interface InviteCode {
  id: string
  workspaceId: string
  code: string
  role: 'admin' | 'editor' | 'viewer'
  maxUses: number
  usedCount: number
  expiresAt: Date
  createdAt: Date
  createdBy: string
  isActive: boolean
}

export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface CreateWorkspaceData {
  name: string
  description: string
  visibility: 'private' | 'public'
}

export interface JoinWorkspaceData {
  inviteCode: string
  name: string
  email: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
