'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Settings,
  Bell,
  Mail,
  Monitor,
  Save,
  RefreshCw,
  CheckCircle
} from 'lucide-react'
import type { NotificationSettings, NotificationType } from '@/types/notification'

interface NotificationSettingsProps {
  userId: string
}

export function NotificationSettingsComponent({ userId }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [userId])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/notifications/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setSettings(result.data)
      } else {
        setError(result.error?.message || '설정을 불러오는데 실패했습니다')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return

    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        },
        body: JSON.stringify(settings)
      })

      const result = await response.json()

      if (result.success) {
        setSettings(result.data)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error?.message || '설정 저장에 실패했습니다')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleType = (type: NotificationType) => {
    if (!settings) return

    setSettings(prev => prev ? {
      ...prev,
      types: {
        ...prev.types,
        [type]: !prev.types[type]
      }
    } : null)
  }

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'document_created': return '문서 생성'
      case 'document_updated': return '문서 수정'
      case 'document_deleted': return '문서 삭제'
      case 'member_invited': return '멤버 초대'
      case 'member_joined': return '멤버 참여'
      case 'member_left': return '멤버 탈퇴'
      case 'role_changed': return '역할 변경'
      case 'workspace_created': return '워크스페이스 생성'
      case 'workspace_updated': return '워크스페이스 수정'
      case 'comment_added': return '댓글 추가'
      case 'sync_completed': return '동기화 완료'
      case 'sync_failed': return '동기화 실패'
      case 'system_maintenance': return '시스템 점검'
      case 'security_alert': return '보안 알림'
      default: return type
    }
  }

  const getTypeDescription = (type: NotificationType) => {
    switch (type) {
      case 'document_created': return '새 문서가 생성될 때 알림'
      case 'document_updated': return '문서가 수정될 때 알림'
      case 'document_deleted': return '문서가 삭제될 때 알림'
      case 'member_invited': return '멤버가 초대될 때 알림'
      case 'member_joined': return '새 멤버가 참여할 때 알림'
      case 'member_left': return '멤버가 탈퇴할 때 알림'
      case 'role_changed': return '멤버 역할이 변경될 때 알림'
      case 'workspace_created': return '워크스페이스가 생성될 때 알림'
      case 'workspace_updated': return '워크스페이스가 수정될 때 알림'
      case 'comment_added': return '댓글이 추가될 때 알림'
      case 'sync_completed': return '문서 동기화가 완료될 때 알림'
      case 'sync_failed': return '문서 동기화가 실패할 때 알림'
      case 'system_maintenance': return '시스템 점검이 있을 때 알림'
      case 'security_alert': return '보안 관련 알림이 있을 때 알림'
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">설정을 불러오는 중...</p>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">설정을 불러올 수 없습니다</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-primary" />
          <span>알림 설정</span>
          {saved && (
            <Badge variant="default" className="ml-auto">
              <CheckCircle className="h-3 w-3 mr-1" />
              저장됨
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* 알림 방법 설정 */}
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">알림 방법</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email" className="font-medium">이메일 알림</Label>
                    <p className="text-sm text-muted-foreground">이메일로 알림을 받습니다</p>
                  </div>
                </div>
                <input
                  id="email"
                  type="checkbox"
                  checked={settings.email}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, email: e.target.checked } : null)}
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="browser" className="font-medium">브라우저 알림</Label>
                    <p className="text-sm text-muted-foreground">브라우저에서 알림을 받습니다</p>
                  </div>
                </div>
                <input
                  id="browser"
                  type="checkbox"
                  checked={settings.browser}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, browser: e.target.checked } : null)}
                  className="h-4 w-4"
                />
              </div>
            </div>
          </div>

          {/* 알림 빈도 설정 */}
          <div>
            <h3 className="font-medium mb-4">알림 빈도</h3>
            <div className="space-y-2">
              {[
                { value: 'immediate', label: '즉시 알림', description: '이벤트 발생 즉시 알림을 받습니다' },
                { value: 'daily', label: '일일 요약', description: '하루에 한 번 요약된 알림을 받습니다' },
                { value: 'weekly', label: '주간 요약', description: '일주일에 한 번 요약된 알림을 받습니다' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={option.value}
                    name="frequency"
                    value={option.value}
                    checked={settings.frequency === option.value}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, frequency: e.target.value as any } : null)}
                    className="h-4 w-4"
                  />
                  <div>
                    <Label htmlFor={option.value} className="font-medium">{option.label}</Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 알림 타입별 설정 */}
          <div>
            <h3 className="font-medium mb-4">알림 타입</h3>
            <div className="grid gap-3">
              {Object.entries(settings.types).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{getTypeLabel(type as NotificationType)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getTypeDescription(type as NotificationType)}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleToggleType(type as NotificationType)}
                    className="h-4 w-4"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end pt-6 border-t">
            <Button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{saving ? '저장 중...' : '설정 저장'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
