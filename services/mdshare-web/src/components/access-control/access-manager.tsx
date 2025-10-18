'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  Key, 
  RefreshCw, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { PermissionManager, InviteCodeManager, SettingsPanel } from './components'

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
      createdAt: new Date('2023-10-25'),
      isActive: false
    }
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateSettings = (updates: Partial<AccessControlSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
    // TODO: API 호출로 설정 저장
  }

  const handleUpdateUser = (userId: string, updates: Partial<UserPermission>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ))
    // TODO: API 호출로 사용자 정보 업데이트
  }

  const handleRemoveUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
    // TODO: API 호출로 사용자 제거
  }

  const handleCreateCode = (role: 'admin' | 'editor' | 'viewer', expiresAt?: Date) => {
    const newCode: InviteCode = {
      code: `MD${Date.now().toString().slice(-6)}${role.toUpperCase()}`,
      role,
      expiresAt,
      createdAt: new Date(),
      isActive: true
    }
    setInviteCodes(prev => [...prev, newCode])
    // TODO: API 호출로 초대 코드 생성
  }

  const handleRevokeCode = (code: string) => {
    setInviteCodes(prev => prev.map(inviteCode => 
      inviteCode.code === code 
        ? { ...inviteCode, isActive: false }
        : inviteCode
    ))
    // TODO: API 호출로 초대 코드 비활성화
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">접근 제어 관리</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 상태 표시 */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          {/* 설정 패널 */}
          <div className="mb-8">
            <SettingsPanel 
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          </div>

          {/* 사용자 권한 관리 */}
          <div className="mb-8">
            <PermissionManager 
              users={users}
              onUpdateUser={handleUpdateUser}
              onRemoveUser={handleRemoveUser}
            />
          </div>

          {/* 초대 코드 관리 */}
          <div className="mb-8">
            <InviteCodeManager 
              inviteCodes={inviteCodes}
              onCreateCode={handleCreateCode}
              onRevokeCode={handleRevokeCode}
            />
          </div>

          {/* 요약 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>접근 제어 요약</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{users.length}</div>
                  <div className="text-sm text-muted-foreground">총 사용자</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {inviteCodes.filter(code => code.isActive).length}
                  </div>
                  <div className="text-sm text-muted-foreground">활성 초대 코드</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {settings.visibility === 'public' ? '공개' : 
                     settings.visibility === 'private' ? '비공개' : '제한'}
                  </div>
                  <div className="text-sm text-muted-foreground">가시성 설정</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}