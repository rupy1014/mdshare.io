'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Users, 
  Key, 
  Copy, 
  RefreshCw, 
  Trash2, 
  Eye, 
  EyeOff,
  UserPlus,
  UserMinus,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

interface AccessControlSettings {
  visibility: 'public' | 'private' | 'restricted'
  inviteCode?: string
  allowedDomains: string[]
  passwordProtected: boolean
  roleBasedAccess: boolean
  allowDownload: boolean
  allowComments: boolean
}

interface UserPermission {
  id: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  joinedAt: Date
  lastAccess?: Date
  status: 'active' | 'pending' | 'suspended'
}

interface InviteCode {
  code: string
  role: 'admin' | 'editor' | 'viewer'
  expiresAt?: Date
  usedBy?: string
  createdAt: Date
  isActive: boolean
}

interface PermissionManagerProps {
  users: UserPermission[]
  onUpdateUser: (userId: string, updates: Partial<UserPermission>) => void
  onRemoveUser: (userId: string) => void
}

export function PermissionManager({ users, onUpdateUser, onRemoveUser }: PermissionManagerProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'editor': return 'default'
      case 'viewer': return 'secondary'
      default: return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '관리자'
      case 'editor': return '에디터'
      case 'viewer': return '뷰어'
      default: return role
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'pending': return 'secondary'
      case 'suspended': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '활성'
      case 'pending': return '대기'
      case 'suspended': return '정지'
      default: return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span>사용자 권한 관리</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-medium">{user.email}</span>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {getStatusLabel(user.status)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>가입일: {user.joinedAt.toLocaleDateString()}</div>
                  {user.lastAccess && (
                    <div>마지막 접근: {user.lastAccess.toLocaleDateString()}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUser(user.id)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  설정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveUser(user.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>등록된 사용자가 없습니다</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
