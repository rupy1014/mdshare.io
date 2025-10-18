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
  CheckCircle
} from 'lucide-react'
import { apiClient } from '@/lib/api'
import type { RegisterData } from '@/types/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '' // 임시로 유지, 나중에 프로필 페이지에서 사용
  })
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    setError(null)
  }

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return '이메일을 입력해주세요'
    }
    if (!formData.password) {
      return '비밀번호를 입력해주세요'
    }
    if (formData.password.length < 6) {
      return '비밀번호는 최소 6자 이상이어야 합니다'
    }
    if (!confirmPassword) {
      return '비밀번호 확인을 입력해주세요'
    }
    if (formData.password !== confirmPassword) {
      return '비밀번호가 일치하지 않습니다'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return '올바른 이메일 형식을 입력해주세요'
    }
    
    return null
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.register(formData)
      
      if (response.success && response.data) {
        // 세션 저장
        apiClient.setAuth(response.data)
        
        // 프로필 설정 페이지로 리다이렉트
        router.push('/profile/setup')
      } else {
        setError(response.error?.message || '회원가입에 실패했습니다')
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
            <h1 className="text-2xl font-bold mb-2">회원가입</h1>
            <p className="text-muted-foreground">
              MDShare 계정을 만들어보세요
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

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
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
                      placeholder="최소 6자 이상"
                      value={formData.password}
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

                <div>
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
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
                      회원가입 중...
                    </>
                  ) : (
                    '회원가입'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  이미 계정이 있으신가요?{' '}
                  <Link href="/login" className="text-primary hover:underline">
                    로그인하기
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 가입 혜택 안내 */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">14일 무료 체험</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>모든 프리미엄 기능 무료 체험</span>
                </div> 
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>AI 자동화 도구 완전 활용</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>월 800만원 달성 가능</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>체험 후 자동 유료 전환</span>
                </div>
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                💡 체험 기간 중 언제든 취소 가능하며, 체험 종료 전에 취소하지 않으면 자동으로 유료 전환됩니다
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
