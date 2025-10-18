'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { Header } from '@/components/ui/header'
import { InviteCodeInput } from './invite-code-input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  User, 
  LogOut, 
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface User {
  id: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  joinedAt: Date
}

interface AccessGateProps {
  children: ReactNode
  requiredRole?: 'admin' | 'editor' | 'viewer'
}

interface AccessGateContextType {
  user: User | null
  hasRole: (role: 'admin' | 'editor' | 'viewer') => boolean
  logout: () => void
}

const AccessGateContext = React.createContext<AccessGateContextType | null>(null)

export const useAccessGate = () => {
  const context = React.useContext(AccessGateContext)
  if (!context) {
    throw new Error('useAccessGate must be used within AccessGate')
  }
  return context
}

export function AccessGate({ children, requiredRole }: AccessGateProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showInviteForm, setShowInviteForm] = useState(false)

  useEffect(() => {
    // localStorage에서 사용자 정보 확인
    const savedUser = localStorage.getItem('mdshare-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('mdshare-user')
      }
    }
    setIsLoading(false)
  }, [])

  const handleCodeSubmit = async (code: string): Promise<{ success: boolean; role?: string; message?: string }> => {
    // Mock 초대 코드 검증
    const validCodes: Record<string, { role: string; expires?: Date }> = {
      'MD2023ADMIN': { role: 'admin' },
      'MD2023EDITOR': { role: 'editor', expires: new Date('2023-12-31') },
      'MD2023VIEWER': { role: 'viewer' },
      'DEMO123': { role: 'viewer' }, // 데모용 코드
      'ADMIN123': { role: 'admin' }, // 데모용 코드
    }

    const codeData = validCodes[code]
    
    if (!codeData) {
      return {
        success: false,
        message: '유효하지 않은 초대 코드입니다.'
      }
    }

    if (codeData.expires && codeData.expires < new Date()) {
      return {
        success: false,
        message: '만료된 초대 코드입니다.'
      }
    }

    // 사용자 정보 저장
    const userData: User = {
      id: `user-${Date.now()}`,
      email: `user-${codeData.role}@example.com`,
      role: codeData.role as any,
      joinedAt: new Date()
    }

    localStorage.setItem('mdshare-user', JSON.stringify(userData))
    setUser(userData)
    setShowInviteForm(false)

    return {
      success: true,
      role: codeData.role
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('mdshare-user')
    setUser(null)
    setShowInviteForm(true)
  }

  const hasRequiredRole = (): boolean => {
    if (!requiredRole || !user) return true
    
    const roleHierarchy = { viewer: 1, editor: 2, admin: 3 }
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  const hasRole = (role: 'admin' | 'editor' | 'viewer'): boolean => {
    if (!user) return false
    const roleHierarchy = { viewer: 1, editor: 2, admin: 3 }
    return roleHierarchy[user.role] >= roleHierarchy[role]
  }

  const contextValue: AccessGateContextType = {
    user,
    hasRole,
    logout: handleLogout
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'editor': return 'default'
      case 'viewer': return 'secondary'
      default: return 'outline'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // 인증되지 않은 사용자
  if (!user || showInviteForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">MDShare 프로젝트</h1>
              <p className="text-muted-foreground">
                이 프로젝트에 접근하려면 초대 코드가 필요합니다
              </p>
            </div>

            <InviteCodeInput onCodeSubmit={handleCodeSubmit} />

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                데모용 초대 코드
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>관리자:</span>
                  <code className="bg-background px-2 py-1 rounded text-xs">ADMIN123</code>
                </div>
                <div className="flex items-center justify-between">
                  <span>뷰어:</span>
                  <code className="bg-background px-2 py-1 rounded text-xs">DEMO123</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 권한이 없는 사용자
  if (!hasRequiredRole()) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-center">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>접근 권한 없음</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                이 페이지에 접근하려면 <strong>{requiredRole}</strong> 권한이 필요합니다.
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-sm">현재 권한:</span>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role === 'admin' ? '관리자' : 
                   user.role === 'editor' ? '에디터' : '뷰어'}
                </Badge>
              </div>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                다시 로그인
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 인증된 사용자 - 정상 접근
  return (
    <AccessGateContext.Provider value={contextValue}>
      {/* 메인 콘텐츠 */}
      {children}
    </AccessGateContext.Provider>
  )
}
