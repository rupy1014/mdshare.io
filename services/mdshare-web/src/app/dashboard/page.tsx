'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Home,
  FileText,
  Users,
  Settings,
  Plus,
  Search,
  GitBranch,
  Brain,
  Shield,
  Rocket,
  TrendingUp,
  Clock,
  Activity,
  LogOut
} from 'lucide-react'
import Link from 'next/link'

interface Document {
  id: string
  title: string
  description: string
  lastModified: string
  author: string
  tags: string[]
}

interface Activity {
  id: string
  type: 'create' | 'edit' | 'comment'
  user: string
  document: string
  timestamp: string
}

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const recentDocuments: Document[] = [
    {
      id: '1',
      title: 'API 문서 - 사용자 인증',
      description: 'JWT 기반 사용자 인증 API 명세서',
      lastModified: '2시간 전',
      author: '김개발',
      tags: ['API', '인증', 'JWT']
    },
    {
      id: '2',
      title: '프로젝트 회의록 - 2024.01.15',
      description: '주간 스프린트 계획 및 이슈 논의',
      lastModified: '1일 전',
      author: '박리더',
      tags: ['회의록', '스프린트', '계획']
    },
    {
      id: '3',
      title: '데이터베이스 스키마 설계',
      description: 'PostgreSQL 데이터베이스 ERD 및 테이블 구조',
      lastModified: '3일 전',
      author: '이백엔드',
      tags: ['DB', 'PostgreSQL', '스키마']
    }
  ]

  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'edit',
      user: '김개발',
      document: 'API 문서 - 사용자 인증',
      timestamp: '2시간 전'
    },
    {
      id: '2',
      type: 'create',
      user: '박리더',
      document: '프로젝트 회의록 - 2024.01.15',
      timestamp: '1일 전'
    },
    {
      id: '3',
      type: 'comment',
      user: '이백엔드',
      document: '데이터베이스 스키마 설계',
      timestamp: '3일 전'
    }
  ]

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

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-primary" />
              <span className="font-semibold">MDShare</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium">내 워크스페이스</span>
              <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                {getRoleLabel(user.role)}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" title="검색">
              <Search className="h-4 w-4" />
            </Button>
            
            <Link href="/ai">
              <Button variant="ghost" size="sm" title="문서 인덱싱">
                <Brain className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button variant="ghost" size="sm" title="Git 연동">
              <GitBranch className="h-4 w-4" />
            </Button>
            
            {user.role === 'admin' && (
              <Link href="/access">
                <Button variant="ghost" size="sm" title="접근 제어">
                  <Shield className="h-4 w-4" />
                </Button>
              </Link>
            )}
            
            <div className="flex items-center space-x-3 px-3 py-1 rounded-md bg-muted/50 ml-auto">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{user.name}</span>
                <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <aside className="w-80 border-r border-border bg-muted/20 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">워크스페이스</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start bg-primary/10 text-primary">
                  <Home className="h-4 w-4 mr-2" />
                  대시보드
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  문서
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  팀원
                </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/workspaces">
                <Users className="h-4 w-4 mr-2" />
                워크스페이스
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              설정
            </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">폴더</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  📁 API 문서
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  📁 회의록
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  📁 기술 스펙
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  📁 기타
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">최근 문서</h3>
              <div className="space-y-1">
                {recentDocuments.slice(0, 3).map((doc) => (
                  <Button 
                    key={doc.id} 
                    variant="ghost" 
                    className="w-full justify-start text-sm h-auto p-2"
                    asChild
                  >
                    <Link href={`/document/${doc.id}`}>
                      <div className="text-left">
                        <div className="font-medium truncate">{doc.title}</div>
                        <div className="text-xs text-muted-foreground">{doc.lastModified}</div>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* 환영 메시지 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">안녕하세요, {user.name}님!</h1>
              <p className="text-muted-foreground">
                MDShare에서 지식을 체계적으로 관리하고 Claude Code와 함께 일하세요.
              </p>
            </div>

            {/* 빠른 액션 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">새 문서</h3>
                      <p className="text-sm text-muted-foreground">문서 작성</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">팀원 초대</h3>
                      <p className="text-sm text-muted-foreground">협업 시작</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <GitBranch className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Git 연동</h3>
                      <p className="text-sm text-muted-foreground">동기화 설정</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI 인덱싱</h3>
                      <p className="text-sm text-muted-foreground">구조 최적화</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* 최근 문서 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>최근 문서</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {doc.lastModified} • {doc.author}
                            </span>
                            <div className="flex space-x-1">
                              {doc.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/document/${doc.id}`}>
                            보기
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          {activity.type === 'create' && <Plus className="h-4 w-4 text-primary" />}
                          {activity.type === 'edit' && <FileText className="h-4 w-4 text-primary" />}
                          {activity.type === 'comment' && <Users className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>
                            {activity.type === 'create' && '님이 새 문서를 작성했습니다'}
                            {activity.type === 'edit' && '님이 문서를 수정했습니다'}
                            {activity.type === 'comment' && '님이 댓글을 남겼습니다'}
                          </p>
                          <p className="text-sm font-medium text-muted-foreground">{activity.document}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 워크스페이스 통계 */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>워크스페이스 통계</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-sm text-muted-foreground">총 문서</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">5</div>
                    <div className="text-sm text-muted-foreground">팀원</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">156</div>
                    <div className="text-sm text-muted-foreground">이번 주 편집</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-sm text-muted-foreground">Claude Code 최적화</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
