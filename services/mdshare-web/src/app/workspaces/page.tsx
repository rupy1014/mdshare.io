'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Plus,
  Users,
  Lock,
  Globe,
  Calendar,
  Settings,
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import type { Workspace } from '@/types/auth'

export default function WorkspacesPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isAuthenticated) {
      fetchWorkspaces()
    }
  }, [authLoading, isAuthenticated, router])

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setWorkspaces(result.data)
      } else {
        setError(result.error?.message || '워크스페이스를 불러오는데 실패했습니다')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (!confirm('정말로 이 워크스페이스를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId))
      } else {
        alert(result.error?.message || '워크스페이스 삭제에 실패했습니다')
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">워크스페이스를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                대시보드
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">내 워크스페이스</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/workspace/create">
                <Plus className="h-4 w-4 mr-2" />
                새 워크스페이스
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 환영 메시지 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">안녕하세요, {user?.name}님!</h2>
            <p className="text-muted-foreground">
              참여 중인 워크스페이스를 관리하고 새로운 워크스페이스를 만들어보세요.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* 워크스페이스 목록 */}
          {workspaces.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">워크스페이스가 없습니다</h3>
                <p className="text-muted-foreground mb-6">
                  첫 번째 워크스페이스를 만들어보세요
                </p>
                <Button asChild>
                  <Link href="/workspace/create">
                    <Plus className="h-4 w-4 mr-2" />
                    워크스페이스 만들기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <Card key={workspace.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{workspace.name}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {workspace.description}
                        </p>
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
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {/* 통계 정보 */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{workspace.memberCount}명</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* 소유자 표시 */}
                      {workspace.ownerId === user?.id && (
                        <Badge variant="outline" className="text-xs">
                          소유자
                        </Badge>
                      )}

                      {/* 액션 버튼들 */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link href={`/workspace/${workspace.id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            열기
                          </Link>
                        </Button>
                        
                        {workspace.ownerId === user?.id && (
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteWorkspace(workspace.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 추가 정보 */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">워크스페이스란?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  워크스페이스는 팀이나 프로젝트별로 문서를 체계적으로 관리할 수 있는 공간입니다. 
                  Claude Code와 연동하여 지능형 문서 관리를 경험해보세요.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/workspace/create">
                      <Plus className="h-4 w-4 mr-1" />
                      새 워크스페이스 만들기
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      초대 코드로 참여
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
