'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, 
  ArrowLeft,
  Users,
  Lock,
  Globe,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface WorkspaceForm {
  name: string
  description: string
  visibility: 'private' | 'public'
  adminEmail: string
  adminName: string
}

export default function CreateWorkspacePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<WorkspaceForm>({
    name: '',
    description: '',
    visibility: 'private',
    adminEmail: '',
    adminName: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof WorkspaceForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 1 && form.name && form.description) {
      setStep(2)
    } else if (step === 2 && form.adminEmail && form.adminName) {
      handleCreateWorkspace()
    }
  }

  const handleCreateWorkspace = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          visibility: form.visibility
        })
      })

      const result = await response.json()

      if (result.success) {
        // 생성 완료 후 대시보드로 이동
        router.push('/dashboard')
      } else {
        console.error('워크스페이스 생성 실패:', result.error?.message)
        // TODO: 오류 메시지 표시
      }
    } catch (error) {
      console.error('워크스페이스 생성 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">워크스페이스 생성</h2>
        <p className="text-muted-foreground">
          팀의 지식을 체계적으로 관리할 공간을 만들어보세요
        </p>
      </div>

      <div className="space-y-4">
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

        <div>
          <Label>공개 설정</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Card 
              className={`cursor-pointer transition-colors ${
                form.visibility === 'private' 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleInputChange('visibility', 'private')}
            >
              <CardContent className="p-4 text-center">
                <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-medium">비공개</h3>
                <p className="text-sm text-muted-foreground">
                  초대받은 사람만 접근 가능
                </p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-colors ${
                form.visibility === 'public' 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleInputChange('visibility', 'public')}
            >
              <CardContent className="p-4 text-center">
                <Globe className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-medium">공개</h3>
                <p className="text-sm text-muted-foreground">
                  링크를 아는 사람은 누구나 접근 가능
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">관리자 정보</h2>
        <p className="text-muted-foreground">
          워크스페이스 관리자 정보를 입력하세요
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="adminName">이름 *</Label>
          <Input
            id="adminName"
            placeholder="홍길동"
            value={form.adminName}
            onChange={(e) => handleInputChange('adminName', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="adminEmail">이메일 *</Label>
          <Input
            id="adminEmail"
            type="email"
            placeholder="admin@example.com"
            value={form.adminEmail}
            onChange={(e) => handleInputChange('adminEmail', e.target.value)}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            로그인 및 초대 링크 수신에 사용됩니다
          </p>
        </div>

        {/* 워크스페이스 미리보기 */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>워크스페이스 미리보기</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">{form.name || '워크스페이스 이름'}</h3>
                <p className="text-sm text-muted-foreground">
                  {form.description || '워크스페이스 설명'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={form.visibility === 'private' ? 'secondary' : 'default'}>
                  {form.visibility === 'private' ? (
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
                  관리자: {form.adminName || '이름'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const isStep1Valid = form.name && form.description
  const isStep2Valid = form.adminEmail && form.adminName

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
          {/* 진행 단계 표시 */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                step >= 1 ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {step > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
                </div>
                <span className="text-sm font-medium">워크스페이스 정보</span>
              </div>
              
              <div className={`w-8 h-0.5 ${
                step >= 2 ? 'bg-primary' : 'bg-muted'
              }`} />
              
              <div className={`flex items-center space-x-2 ${
                step >= 2 ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">관리자 정보</span>
              </div>
            </div>
          </div>

          {/* 폼 콘텐츠 */}
          <Card>
            <CardContent className="p-8">
              {step === 1 ? renderStep1() : renderStep2()}

              {/* 버튼 */}
              <div className="flex justify-between mt-8">
                {step === 2 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                  >
                    이전
                  </Button>
                )}
                
                <div className="flex-1" />
                
                <Button 
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !isStep1Valid) ||
                    (step === 2 && !isStep2Valid) ||
                    isLoading
                  }
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      생성 중...
                    </>
                  ) : step === 1 ? (
                    '다음'
                  ) : (
                    '워크스페이스 생성'
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
