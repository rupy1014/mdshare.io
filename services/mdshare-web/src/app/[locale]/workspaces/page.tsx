'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  ArrowLeft,
  Rocket,
  Users,
  Lock,
  Globe,
  Settings,
  MoreHorizontal
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface Workspace {
  id: string
  name: string
  description: string
  visibility: 'public' | 'private'
  memberCount: number
  createdAt: Date
  updatedAt: Date
}

export default function WorkspacesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        // 실제로는 API 호출
        const mockWorkspaces: Workspace[] = [
          {
            id: 'workspace-1',
            name: 'TechTeam-Docs',
            description: '개발팀 기술 문서 및 회의록 관리',
            visibility: 'private',
            memberCount: 5,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-15'),
          },
          {
            id: 'workspace-2',
            name: '개인-학습노트',
            description: '개인 학습 자료 및 메모',
            visibility: 'private',
            memberCount: 1,
            createdAt: new Date('2024-01-05'),
            updatedAt: new Date('2024-01-10'),
          }
        ]
        
        setWorkspaces(mockWorkspaces)
      } catch (error) {
        console.error('워크스페이스 목록 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])

  const handleCreateWorkspace = () => {
    router.push('/ko/workspace/create')
  }

  const handleWorkspaceClick = (workspaceId: string) => {
    router.push(`/ko/dashboard?workspace=${workspaceId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* 헤더 */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/ko" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>홈으로</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Rocket className="h-5 w-5 text-primary" />
            <span className="font-semibold">MDShare</span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="container py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">워크스페이스</h1>
              <p className="text-muted-foreground">
                팀의 지식을 체계적으로 관리할 공간을 만들어보세요
              </p>
            </div>
            <Button onClick={handleCreateWorkspace} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>워크스페이스 만들기</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">워크스페이스 목록을 불러오는 중...</p>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">워크스페이스가 없습니다</h3>
              <p className="text-muted-foreground mb-6">
                첫 번째 워크스페이스를 만들어보세요
              </p>
              <Button onClick={handleCreateWorkspace}>
                <Plus className="h-4 w-4 mr-2" />
                워크스페이스 만들기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <Card 
                  key={workspace.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleWorkspaceClick(workspace.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{workspace.name}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {workspace.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {workspace.memberCount}명
                          </span>
                        </div>
                        <Badge variant={workspace.visibility === 'private' ? 'secondary' : 'default'}>
                          {workspace.visibility === 'private' ? (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              비공개
                            </>
                          ) : (
                            <>
                              <Globe className="h-3 w-3 mr-1" />
                              공개
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {workspace.updatedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
