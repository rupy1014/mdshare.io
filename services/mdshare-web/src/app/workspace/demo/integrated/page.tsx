'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Activity,
  TrendingUp,
  Users,
  FileText,
  GitBranch,
  Brain,
  Bell,
  Shield,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { IntegratedNavigation } from '@/components/navigation/integrated-navigation'

interface RecentActivity {
  id: string
  type: 'document' | 'member' | 'sync' | 'system'
  title: string
  description: string
  timestamp: Date
  user: string
  status: 'success' | 'warning' | 'error'
}

interface WorkspaceStats {
  documents: number
  members: number
  unreadNotifications: number
  modifiedDocuments: number
  lastSync: Date
  activeUsers: number
}

export default function IntegratedDashboardPage() {
  const [stats, setStats] = useState<WorkspaceStats>({
    documents: 12,
    members: 5,
    unreadNotifications: 3,
    modifiedDocuments: 2,
    lastSync: new Date('2024-01-15T10:30:00Z'),
    activeUsers: 3
  })

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: 'activity-1',
      type: 'document',
      title: '새 문서 생성',
      description: 'API 문서 - 사용자 인증이 생성되었습니다',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      user: '김개발',
      status: 'success'
    },
    {
      id: 'activity-2',
      type: 'member',
      title: '멤버 참여',
      description: '박리더님이 워크스페이스에 참여했습니다',
      timestamp: new Date('2024-01-15T09:15:00Z'),
      user: '박리더',
      status: 'success'
    },
    {
      id: 'activity-3',
      type: 'sync',
      title: '문서 동기화',
      description: '3개 문서가 성공적으로 동기화되었습니다',
      timestamp: new Date('2024-01-15T08:45:00Z'),
      user: '김개발',
      status: 'success'
    },
    {
      id: 'activity-4',
      type: 'member',
      title: '역할 변경',
      description: '이뷰어님의 역할이 뷰어에서 에디터로 변경되었습니다',
      timestamp: new Date('2024-01-14T16:20:00Z'),
      user: '김개발',
      status: 'warning'
    }
  ])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4 text-blue-600" />
      case 'member': return <Users className="h-4 w-4 text-green-600" />
      case 'sync': return <GitBranch className="h-4 w-4 text-purple-600" />
      case 'system': return <Activity className="h-4 w-4 text-gray-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return new Date(date).toLocaleDateString('ko-KR')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">통합 대시보드</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <TrendingUp className="h-3 w-3 mr-1" />
              데모 환경
            </Badge>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">MDShare 워크스페이스</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            모든 기능이 통합된 지능형 지식 관리 플랫폼입니다.
            문서 관리부터 Claude Code 연동까지, 팀의 생산성을 극대화하세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 왼쪽: 네비게이션 */}
          <div className="lg:col-span-1">
            <IntegratedNavigation />
          </div>

          {/* 오른쪽: 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 워크스페이스 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.documents}</div>
                  <div className="text-sm text-muted-foreground">문서</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.members}</div>
                  <div className="text-sm text-muted-foreground">멤버</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.unreadNotifications}</div>
                  <div className="text-sm text-muted-foreground">읽지 않음</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.modifiedDocuments}</div>
                  <div className="text-sm text-muted-foreground">수정됨</div>
                </CardContent>
              </Card>
            </div>

            {/* 최근 활동 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>최근 활동</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-sm">{activity.title}</h4>
                          {getStatusIcon(activity.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {activity.user}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 빠른 액션 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>빠른 액션</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                    <Link href="/workspace/demo/document/new">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium">새 문서 생성</div>
                          <div className="text-sm text-muted-foreground">빠르게 새 문서를 만들어보세요</div>
                        </div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                    <Link href="/workspace/demo/claude">
                      <div className="flex items-center space-x-3">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <div className="text-left">
                          <div className="font-medium">Claude Code 연동</div>
                          <div className="text-sm text-muted-foreground">터미널에서 문서를 관리하세요</div>
                        </div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                    <Link href="/workspace/demo/access">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-green-600" />
                        <div className="text-left">
                          <div className="font-medium">멤버 초대</div>
                          <div className="text-sm text-muted-foreground">팀원을 워크스페이스에 초대하세요</div>
                        </div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 justify-start" asChild>
                    <Link href="/workspace/demo/notifications">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-orange-600" />
                        <div className="text-left">
                          <div className="font-medium">알림 확인</div>
                          <div className="text-sm text-muted-foreground">읽지 않은 알림을 확인하세요</div>
                        </div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
