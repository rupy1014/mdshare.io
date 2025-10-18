'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Rocket,
  Eye,
  EyeOff,
  AlertCircle,
  Chrome
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
    setError(null) // 입력 시 오류 메시지 제거
  }

  const handleGoogleLogin = () => {
    window.location.href = '/api/oauth/google'
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!credentials.email || !credentials.password) {
      setError('이메일과 비밀번호를 입력해주세요')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const success = await login(credentials.email, credentials.password)
      
      if (success) {
        // 대시보드로 리다이렉트
        router.push('/ko/dashboard')
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
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
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">로그인</h1>
            <p className="text-muted-foreground">
              MDShare 계정으로 로그인하세요
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* 구글 로그인 버튼 */}
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  구글로 로그인
                </Button>

                {/* 구분선 */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      또는
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={credentials.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">비밀번호</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 입력하세요"
                      value={credentials.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      로그인 중...
                    </>
                  ) : (
                    '로그인'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  계정이 없으신가요?{' '}
                  <Link href="/register" className="text-primary hover:underline">
                    회원가입하기
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 데모 계정 안내 */}
          {/* <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">데모 계정</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>관리자</span>
                  <Badge variant="destructive" className="text-xs">admin@mdshare.com</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>에디터</span>
                  <Badge variant="default" className="text-xs">editor@mdshare.com</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>뷰어</span>
                  <Badge variant="secondary" className="text-xs">viewer@mdshare.com</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                모든 계정의 비밀번호는 'admin123', 'editor123', 'viewer123'입니다
              </p>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}
