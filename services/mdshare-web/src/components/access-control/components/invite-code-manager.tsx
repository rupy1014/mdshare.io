'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Trash2, 
  UserPlus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface InviteCode {
  code: string
  role: 'admin' | 'editor' | 'viewer'
  expiresAt?: Date
  usedBy?: string
  createdAt: Date
  isActive: boolean
}

interface InviteCodeManagerProps {
  inviteCodes: InviteCode[]
  onCreateCode: (role: 'admin' | 'editor' | 'viewer', expiresAt?: Date) => void
  onRevokeCode: (code: string) => void
}

export function InviteCodeManager({ inviteCodes, onCreateCode, onRevokeCode }: InviteCodeManagerProps) {
  const [newCodeRole, setNewCodeRole] = useState<'admin' | 'editor' | 'viewer'>('viewer')
  const [expirationDays, setExpirationDays] = useState<number>(30)

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'editor': return 'default'
      case 'viewer': return 'secondary'
      default: return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '관리자'
      case 'editor': return '에디터'
      case 'viewer': return '뷰어'
      default: return role
    }
  }

  const generateCode = () => {
    const expiresAt = expirationDays > 0 
      ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000)
      : undefined
    
    onCreateCode(newCodeRole, expiresAt)
  }

  const copyToClipboard = async (code: string) => {
    await navigator.clipboard.writeText(code)
    // TODO: 토스트 알림 추가
  }

  const isExpired = (expiresAt?: Date) => {
    return expiresAt ? expiresAt < new Date() : false
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-primary" />
          <span>초대 코드 관리</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 새 코드 생성 */}
          <div className="p-4 border border-border rounded-lg bg-muted/30">
            <h4 className="font-medium mb-3">새 초대 코드 생성</h4>
            <div className="flex items-center space-x-3">
              <select
                value={newCodeRole}
                onChange={(e) => setNewCodeRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="viewer">뷰어</option>
                <option value="editor">에디터</option>
                <option value="admin">관리자</option>
              </select>
              
              <Input
                type="number"
                placeholder="만료일 (일)"
                value={expirationDays}
                onChange={(e) => setExpirationDays(parseInt(e.target.value) || 0)}
                className="w-32"
              />
              
              <Button onClick={generateCode}>
                <UserPlus className="h-4 w-4 mr-1" />
                생성
              </Button>
            </div>
          </div>

          {/* 기존 코드 목록 */}
          <div className="space-y-3">
            {inviteCodes.map((code) => (
              <div key={code.code} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {code.code}
                    </code>
                    <Badge variant={getRoleBadgeVariant(code.role)}>
                      {getRoleLabel(code.role)}
                    </Badge>
                    <Badge variant={code.isActive ? 'default' : 'secondary'}>
                      {code.isActive ? '활성' : '비활성'}
                    </Badge>
                    {isExpired(code.expiresAt) && (
                      <Badge variant="destructive">
                        만료됨
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    생성일: {code.createdAt.toLocaleDateString()}
                    {code.expiresAt && (
                      <span> • 만료일: {code.expiresAt.toLocaleDateString()}</span>
                    )}
                    {code.usedBy && (
                      <span> • 사용자: {code.usedBy}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(code.code)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRevokeCode(code.code)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {inviteCodes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>생성된 초대 코드가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
