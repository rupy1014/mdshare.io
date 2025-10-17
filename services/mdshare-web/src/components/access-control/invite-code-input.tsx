'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Key, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Shield,
  Clock,
  ArrowRight
} from 'lucide-react'

interface InviteCodeInputProps {
  onCodeSubmit: (code: string) => Promise<{ success: boolean; role?: string; message?: string }>
  className?: string
}

export function InviteCodeInput({ onCodeSubmit, className = '' }: InviteCodeInputProps) {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; role?: string; message?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setIsLoading(true)
    try {
      const response = await onCodeSubmit(code.trim())
      setResult(response)
    } catch (error) {
      setResult({
        success: false,
        message: '초대 코드 처리 중 오류가 발생했습니다.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: '관리자',
          description: '모든 권한을 가진 관리자',
          variant: 'destructive' as const,
          icon: Shield
        }
      case 'editor':
        return {
          label: '에디터',
          description: '문서 편집 권한을 가진 에디터',
          variant: 'default' as const,
          icon: User
        }
      case 'viewer':
        return {
          label: '뷰어',
          description: '문서 조회 권한을 가진 뷰어',
          variant: 'secondary' as const,
          icon: User
        }
      default:
        return {
          label: '사용자',
          description: '기본 사용자 권한',
          variant: 'outline' as const,
          icon: User
        }
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>초대 코드 입력</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="초대 코드를 입력하세요"
              className="font-mono text-center text-lg tracking-wider"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              초대 코드를 입력하여 프로젝트에 접근하세요
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                확인 중...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                접근하기
              </>
            )}
          </Button>
        </form>

        {/* 결과 표시 */}
        {result && (
          <div className={`mt-4 p-4 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
              : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
          }`}>
            <div className="flex items-start space-x-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              )}
              
              <div className="flex-1">
                {result.success && result.role ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-green-800 dark:text-green-200">
                        접근이 허용되었습니다!
                      </span>
                      <Badge variant={getRoleInfo(result.role).variant}>
                        {getRoleInfo(result.role).label}
                      </Badge>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {getRoleInfo(result.role).description} 권한으로 프로젝트에 접근할 수 있습니다.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">
                      접근이 거부되었습니다
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {result.message || '유효하지 않은 초대 코드입니다.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 도움말 */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">초대 코드란?</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 관리자가 생성한 특별한 코드입니다</li>
            <li>• 이 코드로 프로젝트에 접근할 수 있습니다</li>
            <li>• 코드에 따라 다른 권한을 받게 됩니다</li>
            <li>• 유효하지 않거나 만료된 코드는 사용할 수 없습니다</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
