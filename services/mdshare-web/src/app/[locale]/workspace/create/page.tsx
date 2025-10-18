'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, 
  ArrowLeft,
  Lock,
  CheckCircle,
  Sparkles,
  User
} from 'lucide-react'
import Link from 'next/link'

interface WorkspaceForm {
  name: string
  description: string
}

export default function CreateWorkspacePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [form, setForm] = useState<WorkspaceForm>({
    name: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

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

  const handleInputChange = (field: keyof WorkspaceForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateWorkspace = async () => {
    if (!form.name.trim()) return

    setIsLoading(true)
    try {
      const result = await api.createWorkspace({
        name: form.name,
        description: form.description,
        visibility: 'private' // 기본적으로 비공개
      })

      if (result.success) {
        // 생성 완료 후 대시보드로 이동
        router.push('/ko/dashboard')
      } else {
        console.error('워크스페이스 생성 실패:', result.error?.message)
        alert(result.error?.message || '워크스페이스 생성에 실패했습니다')
      }
    } catch (error) {
      console.error('워크스페이스 생성 실패:', error)
      alert('워크스페이스 생성 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = form.name.trim().length > 0

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
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">워크스페이스 생성</h1>
            <p className="text-muted-foreground">
              팀의 지식을 체계적으로 관리할 공간을 만들어보세요
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">워크스페이스 이름 *</Label>
                  <Input
                    id="name"
                    placeholder="예: TechTeam-Docs, 개인-학습노트"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    placeholder="워크스페이스에 대한 간단한 설명을 입력하세요"
                    value={form.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                 

                {/* 안내 메시지 */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        워크스페이스 생성 시 알아두세요
                      </p>
                      <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• 워크스페이스는 기본적으로 비공개로 설정됩니다</li>
                        <li>• 생성하시는 분이 자동으로 관리자가 됩니다</li>
                        <li>• 나중에 공유 링크를 생성하여 팀원들을 초대할 수 있습니다</li>
                        <li>• 언제든지 설정을 변경할 수 있습니다</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end mt-8">
                <Button 
                  onClick={handleCreateWorkspace}
                  disabled={!isFormValid || isLoading}
                  className="min-w-[160px]"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2" />
                      워크스페이스 생성
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 추가 정보 */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              워크스페이스 생성 후 언제든지 설정을 변경할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
