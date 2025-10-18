interface Notification {
  id: string
  userId: string
  workspaceId: string
  type: NotificationType
  title: string
  message: string
  data?: NotificationData
  read: boolean
  createdAt: Date
  expiresAt?: Date
}

type NotificationType = 
  | 'document_created'
  | 'document_updated'
  | 'document_deleted'
  | 'member_invited'
  | 'member_joined'
  | 'member_left'
  | 'role_changed'
  | 'workspace_created'
  | 'workspace_updated'
  | 'comment_added'
  | 'sync_completed'
  | 'sync_failed'
  | 'system_maintenance'
  | 'security_alert'

interface NotificationData {
  documentId?: string
  documentTitle?: string
  memberId?: string
  memberName?: string
  workspaceId?: string
  workspaceName?: string
  role?: string
  error?: string
  url?: string
}

interface NotificationSettings {
  userId: string
  email: boolean
  browser: boolean
  types: {
    [key in NotificationType]: boolean
  }
  frequency: 'immediate' | 'daily' | 'weekly'
}

interface NotificationTemplate {
  type: NotificationType
  title: string
  message: string
  emailSubject?: string
  emailTemplate?: string
}

interface NotificationStats {
  total: number
  unread: number
  byType: {
    [key in NotificationType]: number
  }
  recentActivity: Notification[]
}
