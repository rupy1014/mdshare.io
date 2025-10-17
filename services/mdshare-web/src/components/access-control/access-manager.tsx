'use client'

import { useState, useEffect } from 'react'
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

export function AccessManager() {
  const [settings, setSettings] = useState<AccessControlSettings>({
    visibility: 'public',
    allowedDomains: [],
    passwordProtected: false,
    roleBasedAccess: false,
    allowDownload: true,
    allowComments: true
  })
  
  const [users, setUsers] = useState<UserPermission[]>([
    {
      id: '1',
      email: 'admin@example.com',
      role: 'admin',
      joinedAt: new Date('2023-10-01'),
      lastAccess: new Date(),
      status: 'active'
    },
    {
      id: '2',
      email: 'editor@example.com',
      role: 'editor',
      joinedAt: new Date('2023-10-15'),
      lastAccess: new Date('2023-10-20'),
      status: 'active'
    },
    {
      id: '3',
      email: 'viewer@example.com',
      role: 'viewer',
      joinedAt: new Date('2023-10-25'),
      status: 'pending'
    }
  ])
  
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([
    {
      code: 'MD2023ADMIN',
      role: 'admin',
      createdAt: new Date('2023-10-01'),
      isActive: true
    },
    {
      code: 'MD2023EDITOR',
      role: 'editor',
      expiresAt: new Date('2023-12-31'),
      createdAt: new Date('2023-10-15'),
      isActive: true
    },
    {
      code: 'MD2023VIEWER',
      role: 'viewer',
      usedBy: 'viewer@example.com',
      createdAt: new Date('2023-10-20'),
      isActive: false
    }
  ])
  
  const [newInviteCode, setNewInviteCode] = useState('')
  const [newInviteRole, setNewInviteRole] = useState<'admin' | 'editor' | 'viewer'>('viewer')
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [newDomain, setNewDomain] = useState('')

  const generateInviteCode = (): string => {
    const prefix = 'MD'
    const year = new Date().getFullYear()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}${year}${random}`
  }

  const createInviteCode = () => {
    const code = generateInviteCode()
    const inviteCode: InviteCode = {
      code,
      role: newInviteRole,
      createdAt: new Date(),
      isActive: true
    }
    
    setInviteCodes(prev => [inviteCode, ...prev])
    setNewInviteCode(code)
    setShowInviteForm(false)
  }

  const revokeInviteCode = (code: string) => {
    setInviteCodes(prev => 
      prev.map(invite => 
        invite.code === code ? { ...invite, isActive: false } : invite
      )
    )
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    // TODO: 토스트 알림 표시
  }

  const updateUserRole = (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    )
  }

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  const addDomain = () => {
    if (newDomain && !settings.allowedDomains.includes(newDomain)) {
      setSettings(prev => ({
        ...prev,
        allowedDomains: [...prev.allowedDomains, newDomain]
      }))
      setNewDomain('')
    }
  }

  const removeDomain = (domain: string) => {
    setSettings(prev => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter(d => d !== domain)
    }))
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'editor': return 'default'
      case 'viewer': return 'secondary'
      default: return 'outline'
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

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">접근 제어</h1>
          <p className="text-muted-foreground mt-2">
            프로젝트 접근 권한과 사용자 관리를 설정합니다
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 접근 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>접근 설정</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 가시성 설정 */}
            <div>
              <label className="text-sm font-medium mb-2 block">가시성</label>
              <div className="flex items-center space-x-4">
                {['public', 'private', 'restricted'].map((visibility) => (
                  <label key={visibility} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="visibility"
                      value={visibility}
                      checked={settings.visibility === visibility}
                      onChange={(e) => setSettings(prev => ({ ...prev, visibility: e.target.value as any }))}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{visibility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 허용된 도메인 */}
            <div>
              <label className="text-sm font-medium mb-2 block">허용된 도메인</label>
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="example.com"
                  className="flex-1"
                />
                <Button onClick={addDomain} size="sm">
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {settings.allowedDomains.map((domain) => (
                  <Badge key={domain} variant="outline" className="flex items-center space-x-1">
                    <span>{domain}</span>
                    <button
                      onClick={() => removeDomain(domain)}
                      className="ml-1 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* 추가 설정 */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.passwordProtected}
                  onChange={(e) => setSettings(prev => ({ ...prev, passwordProtected: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">비밀번호 보호</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.roleBasedAccess}
                  onChange={(e) => setSettings(prev => ({ ...prev, roleBasedAccess: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">역할 기반 접근</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.allowDownload}
                  onChange={(e) => setSettings(prev => ({ ...prev, allowDownload: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">다운로드 허용</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.allowComments}
                  onChange={(e) => setSettings(prev => ({ ...prev, allowComments: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">댓글 허용</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 초대 코드 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>초대 코드</span>
              </div>
              <Button 
                onClick={() => setShowInviteForm(true)}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                새 초대 코드
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showInviteForm && (
              <div className="mb-4 p-4 border border-border rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2 mb-3">
                  <label className="text-sm font-medium">역할:</label>
                  <select
                    value={newInviteRole}
                    onChange={(e) => setNewInviteRole(e.target.value as any)}
                    className="px-2 py-1 border border-border rounded text-sm"
                  >
                    <option value="viewer">뷰어</option>
                    <option value="editor">에디터</option>
                    <option value="admin">관리자</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={createInviteCode} size="sm">
                    생성
                  </Button>
                  <Button 
                    onClick={() => setShowInviteForm(false)} 
                    variant="ghost" 
                    size="sm"
                  >
                    취소
                  </Button>
                </div>
              </div>
            )}

            {newInviteCode && (
              <div className="mb-4 p-4 border border-primary rounded-lg bg-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">새 초대 코드가 생성되었습니다!</p>
                    <p className="font-mono text-lg font-bold">{newInviteCode}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(newInviteCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {inviteCodes.map((invite) => (
                <div key={invite.code} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRoleBadgeVariant(invite.role)}>
                        {invite.role === 'admin' ? '관리자' : 
                         invite.role === 'editor' ? '에디터' : '뷰어'}
                      </Badge>
                      <Badge variant={invite.isActive ? 'default' : 'secondary'}>
                        {invite.isActive ? '활성' : '비활성'}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium">{invite.code}</p>
                      <p className="text-xs text-muted-foreground">
                        생성: {invite.createdAt.toLocaleDateString('ko-KR')}
                        {invite.expiresAt && (
                          <span> | 만료: {invite.expiresAt.toLocaleDateString('ko-KR')}</span>
                        )}
                        {invite.usedBy && (
                          <span> | 사용됨: {invite.usedBy}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(invite.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {invite.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => revokeInviteCode(invite.code)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 사용자 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>사용자 관리</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      가입: {user.joinedAt.toLocaleDateString('ko-KR')}
                      {user.lastAccess && (
                        <span> | 마지막 접속: {user.lastAccess.toLocaleDateString('ko-KR')}</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role === 'admin' ? '관리자' : 
                     user.role === 'editor' ? '에디터' : '뷰어'}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {user.status === 'active' ? '활성' : 
                     user.status === 'pending' ? '대기중' : '정지됨'}
                  </Badge>
                  
                  <div className="flex items-center space-x-1">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as any)}
                      className="px-2 py-1 border border-border rounded text-sm"
                    >
                      <option value="viewer">뷰어</option>
                      <option value="editor">에디터</option>
                      <option value="admin">관리자</option>
                    </select>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUser(user.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
