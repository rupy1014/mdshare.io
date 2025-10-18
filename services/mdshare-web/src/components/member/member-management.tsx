'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users,
  Edit,
  Trash2,
  UserPlus,
  MoreHorizontal,
  Clock,
  Mail
} from 'lucide-react'
import type { WorkspaceMember } from '@/types/auth'

interface MemberManagementProps {
  workspaceId: string
  userRole: 'admin' | 'editor' | 'viewer'
}

export function MemberManagement({ workspaceId, userRole }: MemberManagementProps) {
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [workspaceId])

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setMembers(result.data)
      } else {
        setError(result.error?.message || '멤버를 불러오는데 실패했습니다')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        },
        body: JSON.stringify({ role: newRole })
      })

      const result = await response.json()

      if (result.success) {
        setMembers(prev => prev.map(m => 
          m.id === memberId ? { ...m, role: newRole } : m
        ))
      } else {
        alert(result.error?.message || '역할 변경에 실패했습니다')
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다')
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('정말로 이 멤버를 제거하시겠습니까?')) {
      return
    }

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setMembers(prev => prev.filter(m => m.id !== memberId))
      } else {
        alert(result.error?.message || '멤버 제거에 실패했습니다')
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다')
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">멤버를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span>팀원 관리</span>
          {userRole === 'admin' && (
            <Button size="sm" className="ml-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              멤버 초대
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

        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{member.user.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                      {getRoleLabel(member.role)}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(member.joinedAt)} 참여</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {userRole === 'admin' && (
                <div className="flex items-center space-x-2">
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                    className="text-sm border rounded px-2 py-1 bg-background"
                  >
                    <option value="admin">관리자</option>
                    <option value="editor">에디터</option>
                    <option value="viewer">뷰어</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {members.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">멤버가 없습니다</h3>
              <p className="text-sm text-muted-foreground mb-4">
                워크스페이스에 멤버를 초대해보세요
              </p>
              {userRole === 'admin' && (
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  멤버 초대하기
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
