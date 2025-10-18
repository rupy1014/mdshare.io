'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Home,
  FileText,
  Users,
  Settings,
  Bell,
  Brain,
  GitBranch,
  Shield,
  Search,
  Plus,
  ArrowRight,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  description: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  requiresAuth?: boolean
  requiredRole?: 'admin' | 'editor' | 'viewer'
}

interface QuickAction {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  description: string
}

export function IntegratedNavigation() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<'admin' | 'editor' | 'viewer'>('admin')
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  useEffect(() => {
    // 사용자 역할 및 알림 상태 로드
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('mdshare-user')
      if (userData) {
        const user = JSON.parse(userData)
        setUserRole(user.role)
      }
    }
  }, [])

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: '대시보드',
      href: '/workspace/demo/dashboard',
      icon: <Home className="h-4 w-4" />,
      description: '워크스페이스 개요 및 최근 활동',
      requiresAuth: true
    },
    {
      id: 'documents',
      label: '문서',
      href: '/workspace/demo/document/1',
      icon: <FileText className="h-4 w-4" />,
      description: '문서 보기 및 편집',
      requiresAuth: true
    },
    {
      id: 'claude',
      label: 'Claude Code',
      href: '/workspace/demo/claude',
      icon: <Brain className="h-4 w-4" />,
      description: 'Claude Code 연동 및 터미널 도구',
      requiresAuth: true
    },
    {
      id: 'access',
      label: '접근 제어',
      href: '/workspace/demo/access',
      icon: <Shield className="h-4 w-4" />,
      description: '멤버 관리 및 초대 코드',
      requiresAuth: true,
      requiredRole: 'admin'
    },
    {
      id: 'notifications',
      label: '알림',
      href: '/workspace/demo/notifications',
      icon: <Bell className="h-4 w-4" />,
      description: '알림 센터 및 설정',
      badge: unreadNotifications > 0 ? unreadNotifications.toString() : undefined,
      badgeVariant: 'destructive',
      requiresAuth: true
    }
  ]

  const quickActions: QuickAction[] = [
    {
      id: 'create-doc',
      label: '새 문서',
      href: '/workspace/demo/document/new',
      icon: <Plus className="h-4 w-4" />,
      description: '새로운 문서를 생성합니다'
    },
    {
      id: 'invite-member',
      label: '멤버 초대',
      href: '/workspace/demo/access',
      icon: <Users className="h-4 w-4" />,
      description: '새로운 멤버를 초대합니다'
    },
    {
      id: 'sync-docs',
      label: '문서 동기화',
      href: '/workspace/demo/claude',
      icon: <GitBranch className="h-4 w-4" />,
      description: '로컬과 원격 문서를 동기화합니다'
    }
  ]

  const hasRole = (requiredRole?: string) => {
    if (!requiredRole) return true
    const roleHierarchy: Record<string, number> = {
      viewer: 1,
      editor: 2,
      admin: 3
    }
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  }

  const filteredNavigationItems = navigationItems.filter(item => {
    if (item.requiresAuth && typeof window !== 'undefined' && !localStorage.getItem('mdshare-access-token')) {
      return false
    }
    if (item.requiredRole && !hasRole(item.requiredRole)) {
      return false
    }
    return true
  })

  const filteredQuickActions = quickActions.filter(action => {
    if (action.id === 'invite-member' && !hasRole('admin')) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* 메인 네비게이션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>메인 메뉴</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {filteredNavigationItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  pathname === item.href 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted/50'
                }`}>
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{item.label}</h4>
                      {item.badge && (
                        <Badge variant={item.badgeVariant} className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm opacity-70 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 빠른 작업 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>빠른 작업</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {filteredQuickActions.map((action) => (
              <Link key={action.id} href={action.href}>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{action.label}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 워크스페이스 상태 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>워크스페이스 상태</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-muted-foreground">문서</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-muted-foreground">멤버</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-muted-foreground">읽지 않음</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-muted-foreground">수정됨</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
