'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  GitBranch, 
  User, 
  LogOut,
  RefreshCw
} from 'lucide-react'
import { OAuthLogin } from '@/components/oauth/oauth-login'
import { OAuthRepositorySelector } from '@/components/oauth/oauth-repository-selector'
import { oauthService } from '@/lib/oauth-service'
import type { OAuthSession, OAuthRepository, OAuthUser } from '@/types/oauth'

interface GitPopupProps {
  isOpen: boolean
  onClose: () => void
}

type ViewMode = 'login' | 'repositories'

export function GitPopup({ isOpen, onClose }: GitPopupProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('login')
  const [oauthSession, setOauthSession] = useState<OAuthSession | null>(null)
  const [oauthUser, setOauthUser] = useState<OAuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      checkOAuthSession()
    }
  }, [isOpen])

  const checkOAuthSession = async () => {
    try {
      setIsLoading(true)
      // 로컬 스토리지에서 세션 확인
      const localSession = oauthService.loadLocalSession()
      if (localSession) {
        setOauthSession(localSession)
        const userInfo = await oauthService.getUserInfo(localSession.provider, localSession.accessToken)
        setOauthUser(userInfo)
        setViewMode('repositories')
      } else {
        setViewMode('login')
      }
    } catch (error) {
      console.error('OAuth 세션 확인 실패:', error)
      setViewMode('login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLoginSuccess = (user: OAuthUser, repositories: OAuthRepository[]) => {
    setOauthUser(user)
    setViewMode('repositories')
  }

  const handleOAuthLoginError = (error: string) => {
    console.error('OAuth 로그인 실패:', error)
  }

  const handleOAuthRepositorySelect = (repository: OAuthRepository) => {
    // 저장소 선택 시 새 탭에서 GitHub/GitLab 페이지 열기
    window.open(repository.url, '_blank')
  }

  const handleOAuthLogout = () => {
    if (oauthSession) {
      oauthService.deleteSession(oauthSession.id)
    }
    oauthService.removeLocalSession()
    setOauthSession(null)
    setOauthUser(null)
    setViewMode('login')
  }

  const handleClose = () => {
    onClose()
    // 상태 초기화 (선택사항)
    // setViewMode('login')
    // setSelectedRepository(null)
    // setCurrentEditSession(null)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">로딩 중...</span>
        </div>
      )
    }

    switch (viewMode) {
      case 'login':
        return (
          <OAuthLogin
            onLoginSuccess={handleOAuthLoginSuccess}
            onLoginError={handleOAuthLoginError}
          />
        )

      case 'repositories':
        if (!oauthSession || !oauthUser) {
          return (
            <Card>
              <CardContent className="text-center py-8">
                <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">OAuth 세션을 찾을 수 없습니다</h3>
                <p className="text-muted-foreground">
                  다시 로그인해주세요.
                </p>
              </CardContent>
            </Card>
          )
        }

        return (
          <OAuthRepositorySelector
            session={oauthSession}
            onRepositorySelect={handleOAuthRepositorySelect}
            onLogout={handleOAuthLogout}
          />
        )


      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-lg font-semibold">Git 연동</h2>
            <p className="text-sm text-muted-foreground">
              {viewMode === 'login' 
                ? 'Git 계정으로 로그인하여 저장소에 접근하세요'
                : '작업할 저장소를 선택하세요'
              }
            </p>
          </div>
        </div>

          <div className="flex items-center space-x-2">
            {oauthUser && (
              <div className="flex items-center space-x-2 px-2 py-1 rounded bg-muted/50">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">{oauthUser.displayName}</span>
                <Badge variant="outline" className="text-xs">
                  {oauthUser.provider === 'github' ? 'GitHub' : 'GitLab'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOAuthLogout}
                  className="h-4 w-4 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-2 w-2" />
                </Button>
              </div>
            )}
            
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>


        {/* 메인 콘텐츠 */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
