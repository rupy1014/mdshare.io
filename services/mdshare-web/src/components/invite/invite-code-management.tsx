'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Mail,
  Plus,
  Copy,
  Trash2,
  Edit,
  Clock,
  Users,
  Eye,
  EyeOff
} from 'lucide-react'
import type { InviteCode } from '@/types/auth'

interface InviteCodeManagementProps {
  workspaceId: string
  userRole: 'admin' | 'editor' | 'viewer'
}

export function InviteCodeManagement({ workspaceId, userRole }: InviteCodeManagementProps) {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    role: 'editor' as 'admin' | 'editor' | 'viewer',
    maxUses: 1,
    expiresInDays: 30
  })

  useEffect(() => {
    fetchInviteCodes()
  }, [workspaceId])

  const fetchInviteCodes = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/invite-codes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setInviteCodes(result.data)
      } else {
        setError(result.error?.message || '초대 코드를 불러오는데 실패했습니다')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInviteCode = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/invite-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        },
        body: JSON.stringify(createForm)
      })

      const result = await response.json()

      if (result.success) {
        setInviteCodes(prev => [result.data, ...prev])
        setShowCreateForm(false)
        setCreateForm({ role: 'editor', maxUses: 1, expiresInDays: 30 })
      } else {
        alert(result.error?.message || '초대 코드 생성에 실패했습니다')
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다')
    }
  }

  const handleDeleteInviteCode = async (codeId: string) => {
    if (!confirm('정말로 이 초대 코드를 삭제하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/invite-codes/${codeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setInviteCodes(prev => prev.filter(ic => ic.id !== codeId))
      } else {
        alert(result.error?.message || '초대 코드 삭제에 실패했습니다')
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다')
    }
  }

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      alert('초대 코드가 클립보드에 복사되었습니다')
    } catch (error) {
      alert('클립보드 복사에 실패했습니다')
    }
  }

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpired = (expiresAt: Date) => {
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">초대 코드를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-primary" />
          <span>초대 코드</span>
          {userRole === 'admin' && (
            <Button 
              size="sm" 
              className="ml-auto"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              새 초대 코드
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* 초대 코드 생성 폼 */}
        {showCreateForm && userRole === 'admin' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">새 초대 코드 생성</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">역할</Label>
                <select
                  id="role"
                  value={createForm.role}
                  onChange={(e) => setCreateForm(prev => ({ 
                    ...prev, 
                    role: e.target.value as 'admin' | 'editor' | 'viewer' 
                  }))}
                  className="w-full mt-1 border rounded px-3 py-2 bg-background"
                >
                  <option value="viewer">뷰어</option>
                  <option value="editor">에디터</option>
                  <option value="admin">관리자</option>
                </select>
              </div>

              <div>
                <Label htmlFor="maxUses">최대 사용 횟수</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="1"
                  max="100"
                  value={createForm.maxUses}
                  onChange={(e) => setCreateForm(prev => ({ 
                    ...prev, 
                    maxUses: parseInt(e.target.value) || 1 
                  }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="expiresInDays">만료 기간 (일)</Label>
                <Input
                  id="expiresInDays"
                  type="number"
                  min="1"
                  max="365"
                  value={createForm.expiresInDays}
                  onChange={(e) => setCreateForm(prev => ({ 
                    ...prev, 
                    expiresInDays: parseInt(e.target.value) || 30 
                  }))}
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleCreateInviteCode}>
                  <Plus className="h-4 w-4 mr-2" />
                  생성하기
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 초대 코드 목록 */}
        <div className="space-y-4">
          {inviteCodes.map((inviteCode) => (
            <div key={inviteCode.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                    {inviteCode.code}
                  </code>
                  <Badge variant={getRoleBadgeVariant(inviteCode.role)} className="text-xs">
                    {getRoleLabel(inviteCode.role)}
                  </Badge>
                  {isExpired(inviteCode.expiresAt) && (
                    <Badge variant="outline" className="text-xs text-destructive">
                      만료됨
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{inviteCode.usedCount}/{inviteCode.maxUses} 사용</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(inviteCode.expiresAt)} 만료</span>
                  </div>
                  <span>{formatDate(inviteCode.createdAt)} 생성</span>
                </div>
              </div>
              
              {userRole === 'admin' && (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopyCode(inviteCode.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteInviteCode(inviteCode.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {inviteCodes.length === 0 && (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">초대 코드가 없습니다</h3>
              <p className="text-sm text-muted-foreground mb-4">
                워크스페이스에 멤버를 초대할 코드를 만들어보세요
              </p>
              {userRole === 'admin' && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  초대 코드 만들기
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
