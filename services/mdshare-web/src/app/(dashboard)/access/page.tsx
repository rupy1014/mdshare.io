'use client'

import { AccessManager } from '@/components/access-control/access-manager'
// import { useAccessGate } from '@/components/access-control/access-gate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function AccessPage() {
  // localStorage에서 사용자 정보 확인
  const hasRole = (role: string) => {
    if (typeof window === 'undefined') return false
    
    const savedUser = localStorage.getItem('mdshare-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        const roleHierarchy: Record<string, number> = { viewer: 1, editor: 2, admin: 3 }
        return roleHierarchy[userData.role] >= roleHierarchy[role]
      } catch (error) {
        return false
      }
    }
    return false
  }

  if (!hasRole('admin')) {
    return (
      <div className="p-6">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-center">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>접근 권한 없음</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              이 페이지에 접근하려면 <strong>관리자</strong> 권한이 필요합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <AccessManager />
    </div>
  )
}
