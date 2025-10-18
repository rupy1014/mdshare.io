'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Users,
  Lock,
  Globe,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface WorkspaceInfo {
  id: string
  name: string
  description: string
  visibility: 'private' | 'public'
  memberCount: number
  adminName: string
}

interface JoinForm {
  name: string
  email: string
}

export default function JoinWorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const inviteCode = params.inviteCode as string

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null)
  const [form, setForm] = useState<JoinForm>({
    name: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkspaceInfo = async () => {
      try {
        const response = await fetch(`/api/workspaces/validate-invite/${inviteCode}`)
        const result = await response.json()
        
        if (result.success) {
          const { workspace, inviteCode: codeInfo } = result.data
          setWorkspace({
            id: workspace.id,
            name: workspace.name,
            description: workspace.description,
            visibility: workspace.visibility,
            memberCount: workspace.memberCount,
            adminName: codeInfo.createdBy
          })
        } else {
          console.error('워크스페이스 정보 조회 실패:', result.error?.message)
        }
      } catch (error) {
        console.error('워크스페이스 정보 조회 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspaceInfo()
  }, [inviteCode])

  const handleInputChange = (field: keyof JoinForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleJoinWorkspace = async () => {
    if (!form.name || !form.email) return

    setIsJoining(true)
    setError(null)

    try {
      const response = await fetch('/api/workspaces/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inviteCode,
          name: form.name,
          email: form.email
        })
      })

      const result = await response.json()

      if (result.success) {
        // 참여 완료 후 대시보드로 이동
        router.push('/dashboard')
      } else {
        setError(result.error?.message || '워크스페이스 참여에 실패했습니다.')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsJoining(false)
    }
  }

  const isFormValid = form.name && form.email

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">워크스페이스 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">초대 링크를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-6">
              초대 코드가 올바르지 않거나 만료되었습니다.
            </p>
            <Button asChild>
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* 헤더 */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>홈으로</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold">MDShare</span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="container py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">워크스페이스 참여</h1>
            <p className="text-muted-foreground">
              초대받은 워크스페이스에 참여하세요
            </p>
          </div>

          {/* 워크스페이스 정보 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>워크스페이스 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{workspace.name}</h3>
                  <p className="text-muted-foreground">{workspace.description}</p>
                </div>
                
                <div className="flex items-center space-x-4">
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
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    멤버 {workspace.memberCount}명
                  </Badge>
                  <Badge variant="outline">
                    관리자: {workspace.adminName}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 참여 폼 */}
          <Card>
            <CardHeader>
              <CardTitle>참여 정보 입력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    로그인 및 알림 수신에 사용됩니다
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-md">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">참여 후 이용 가능한 기능</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 문서 읽기 및 편집</li>
                      <li>• 팀원과의 실시간 협업</li>
                      <li>• Claude Code와의 연동</li>
                      <li>• Git 기반 문서 동기화</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleJoinWorkspace}
                disabled={!isFormValid || isJoining}
                className="w-full"
                size="lg"
              >
                {isJoining ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    참여 중...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    워크스페이스 참여하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 추가 정보 */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              이미 MDShare 계정이 있으신가요?{' '}
              <Link href="/login" className="text-primary hover:underline">
                로그인하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
