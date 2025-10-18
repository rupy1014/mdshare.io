'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Lock, 
  Users, 
  Eye, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Rocket
} from 'lucide-react'
import Link from 'next/link'

interface ShareAccess {
  workspaceId: string
  shareId: string
  workspaceName: string
  permissions: {
    allowView: boolean
    allowEdit: boolean
    allowComment: boolean
    requireApproval: boolean
  }
  isActive: boolean
  requiresLogin: boolean
}

export default function ShareAccessPage() {
  const params = useParams()
  const router = useRouter()
  const [shareAccess, setShareAccess] = useState<ShareAccess | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRequestingAccess, setIsRequestingAccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const workspaceId = params.workspaceId as string
  const shareId = params.shareId as string

  useEffect(() => {
    const fetchShareAccess = async () => {
      try {
        // 실제로는 API 호출
        const mockShareAccess: ShareAccess = {
          workspaceId,
          shareId,
          workspaceName: 'TechTeam-Docs',
          permissions: {
            allowView: true,
            allowEdit: false,
            allowComment: true,
            requireApproval: false
          },
          isActive: true,
          requiresLogin: true
        }
        
        setShareAccess(mockShareAccess)
      } catch (err) {
        setError('공유 링크를 찾을 수 없습니다')
      } finally {
        setIsLoading(false)
      }
    }

    fetchShareAccess()
  }, [workspaceId, shareId])

  const handleRequestAccess = async () => {
    setIsRequestingAccess(true)
    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (shareAccess?.requireApproval) {
        // 승인 요청
        alert('접근 요청이 관리자에게 전송되었습니다. 승인 후 알림을 받으실 수 있습니다.')
      } else {
        // 바로 접근
        router.push(`/workspace/${workspaceId}`)
      }
    } catch (err) {
      setError('접근 요청에 실패했습니다')
    } finally {
      setIsRequestingAccess(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">공유 링크 확인 중...</p>
        </div>
      </div>
    )
  }

  if (error || !shareAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">접근할 수 없습니다</h2>
            <p className="text-muted-foreground mb-6">
              {error || '유효하지 않은 공유 링크입니다'}
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로 돌아가기
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!shareAccess.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">비활성화된 링크</h2>
            <p className="text-muted-foreground mb-6">
              이 공유 링크는 더 이상 사용할 수 없습니다
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로 돌아가기
              </Link>
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
            <Rocket className="h-5 w-5 text-primary" />
            <span className="font-semibold">MDShare</span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="container py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">워크스페이스 공유</h1>
                <p className="text-muted-foreground">
                  <strong>{shareAccess.workspaceName}</strong> 워크스페이스에 초대되었습니다
                </p>
              </div>

              {/* 권한 정보 */}
              <div className="space-y-4 mb-8">
                <h3 className="font-medium">부여된 권한</h3>
                <div className="flex flex-wrap gap-2">
                  {shareAccess.permissions.allowView && (
                    <Badge variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      보기 권한
                    </Badge>
                  )}
                  {shareAccess.permissions.allowEdit && (
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      편집 권한
                    </Badge>
                  )}
                  {shareAccess.permissions.allowComment && (
                    <Badge variant="outline">
                      댓글 권한
                    </Badge>
                  )}
                  {shareAccess.permissions.requireApproval && (
                    <Badge variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      승인 필요
                    </Badge>
                  )}
                </div>
              </div>

              {/* 접근 방법 */}
              <div className="space-y-4 mb-8">
                {shareAccess.requiresLogin ? (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          로그인이 필요합니다
                        </p>
                        <p className="text-blue-700 dark:text-blue-300">
                          워크스페이스에 접근하려면 먼저 로그인하거나 계정을 만들어주세요
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                          바로 접근 가능합니다
                        </p>
                        <p className="text-green-700 dark:text-green-300">
                          로그인 없이도 워크스페이스에 접근할 수 있습니다
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3">
                {shareAccess.requiresLogin ? (
                  <>
                    <Button asChild className="flex-1">
                      <Link href="/login">
                        로그인
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/register">
                        계정 만들기
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleRequestAccess}
                    disabled={isRequestingAccess}
                    className="w-full"
                  >
                    {isRequestingAccess ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        접근 요청 중...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        워크스페이스 접근하기
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 추가 정보 */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              이 링크는 워크스페이스 관리자가 생성한 공유 링크입니다
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
