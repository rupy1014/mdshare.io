interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: Date
  lastLoginAt?: Date
}

interface Workspace {
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

interface WorkspaceSettings {
  allowInvites: boolean
  defaultRole: 'editor' | 'viewer'
  requireApproval: boolean
  gitIntegration: boolean
}

interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: 'admin' | 'editor' | 'viewer'
  joinedAt: Date
  invitedBy: string
  user: User
}

interface InviteCode {
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

interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
}

interface CreateWorkspaceData {
  name: string
  description: string
  visibility: 'private' | 'public'
}

interface JoinWorkspaceData {
  inviteCode: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
