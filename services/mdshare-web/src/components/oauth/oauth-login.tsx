'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Github, 
  GitBranch, 
  ExternalLink, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Chrome
} from 'lucide-react'
import { oauthService } from '@/lib/oauth-service'
import type { OAuthProvider, OAuthUser, OAuthRepository } from '@/types/oauth'

interface OAuthLoginProps {
  onLoginSuccess?: (user: OAuthUser, repositories: OAuthRepository[]) => void
  onLoginError?: (error: string) => void
}

export function OAuthLogin({ onLoginSuccess, onLoginError }: OAuthLoginProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const providers = oauthService.getProviders()

  const handleLogin = async (provider: OAuthProvider) => {
    try {
      setIsLoading(provider.id)
      setError(null)

      // OAuth 로그인 URL로 리다이렉트
      const authUrl = oauthService.getAuthUrl(provider.id)
      window.location.href = authUrl
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인 실패'
      setError(errorMessage)
      onLoginError?.(errorMessage)
    } finally {
      setIsLoading(null)
    }
  }

  const getProviderIcon = (provider: OAuthProvider) => {
    switch (provider.id) {
      case 'google':
        return <Chrome className="h-5 w-5" />
      case 'github':
        return <Github className="h-5 w-5" />
      case 'gitlab':
        return <GitBranch className="h-5 w-5" />
      default:
        return <ExternalLink className="h-5 w-5" />
    }
  }

  const getProviderDescription = (provider: OAuthProvider) => {
    switch (provider.id) {
      case 'google':
        return '구글 계정으로 로그인하여 서비스에 접근하세요'
      case 'github':
        return 'GitHub 계정으로 로그인하여 저장소에 접근하세요'
      case 'gitlab':
        return 'GitLab 계정으로 로그인하여 저장소에 접근하세요'
      default:
        return 'Git 계정으로 로그인하여 저장소에 접근하세요'
    }
  }

  const getProviderBadgeColor = (provider: OAuthProvider) => {
    switch (provider.id) {
      case 'google':
        return 'bg-red-500 text-white hover:bg-red-600'
      case 'github':
        return 'bg-gray-900 text-white hover:bg-gray-800'
      case 'gitlab':
        return 'bg-orange-500 text-white hover:bg-orange-600'
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Git 계정으로 로그인</h2>
        <p className="text-muted-foreground">
          Git 저장소에 접근하려면 계정으로 로그인해주세요
        </p>
      </div>

      {/* 오류 메시지 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* OAuth 제공자 목록 */}
      <div className="grid gap-4">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                    {getProviderIcon(provider)}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <span>{provider.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {provider.scopes.length}개 권한
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getProviderDescription(provider)}
                    </p>
                    
                    {/* 권한 목록 */}
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">요청 권한:</div>
                      <div className="flex flex-wrap gap-1">
                        {provider.scopes.map((scope) => (
                          <Badge key={scope} variant="secondary" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleLogin(provider)}
                  disabled={isLoading === provider.id}
                  className={`min-w-[120px] ${getProviderBadgeColor(provider)}`}
                >
                  {isLoading === provider.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      로그인 중...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      로그인
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 정보 카드 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">안전한 OAuth 인증</h4>
              <p className="text-sm text-blue-700 mt-1">
                우리는 귀하의 Git 계정 비밀번호를 저장하지 않습니다. 
                OAuth를 통해 안전하게 인증하며, 언제든지 권한을 철회할 수 있습니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사용 방법 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">사용 방법</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              1
            </div>
            <div>
              <p className="font-medium">Git 계정으로 로그인</p>
              <p className="text-sm text-muted-foreground">
                GitHub 또는 GitLab 계정으로 안전하게 로그인합니다.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              2
            </div>
            <div>
              <p className="font-medium">저장소 선택</p>
              <p className="text-sm text-muted-foreground">
                접근 가능한 저장소 목록에서 작업할 저장소를 선택합니다.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              3
            </div>
            <div>
              <p className="font-medium">문서 편집 시작</p>
              <p className="text-sm text-muted-foreground">
                선택한 저장소의 문서를 안전하게 편집하고 관리합니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
