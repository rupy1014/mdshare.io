'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft,
  Rocket,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    bio: '',
    company: '',
    role: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return '이름을 입력해주세요'
    }
    if (!formData.nickname.trim()) {
      return '닉네임을 입력해주세요'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 프로필 정보 업데이트 API 호출
      const response = await apiClient.updateProfile(formData)
      
      if (response.success) {
        // 워크스페이스 생성 페이지로 리다이렉트
        router.push('/ko/workspace/create')
      } else {
        setError(response.error?.message || '프로필 설정에 실패했습니다')
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
          <Link href="/login" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>로그인으로</span>
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
              <User className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">프로필 설정</h1>
            <p className="text-muted-foreground">
              MDShare에서 사용할 프로필 정보를 입력해주세요
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nickname">닉네임 *</Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="hong123"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company">회사/조직</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="MDShare Inc."
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="role">직책/역할</Label>
                  <Input
                    id="role"
                    type="text"
                    placeholder="마케팅 매니저"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">자기소개</Label>
                  <Textarea
                    id="bio"
                    placeholder="간단한 자기소개를 작성해주세요..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      설정 중...
                    </>
                  ) : (
                    '프로필 완료'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  나중에 설정에서 언제든 수정할 수 있습니다
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 프로필 설정 혜택 안내 */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">프로필 설정 혜택</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>팀원들과의 원활한 협업</span>
                </div> 
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>개인화된 AI 어시스턴트</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>맞춤형 업무 자동화</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
