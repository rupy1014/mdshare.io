'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bell,
  BellRing,
  Check,
  X,
  FileText,
  Users,
  GitBranch,
  Settings,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react'
import type { Notification, NotificationStats } from '@/types/notification'

interface NotificationCenterProps {
  userId: string
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [userId, showUnreadOnly])

  const fetchNotifications = async () => {
    try {
      const params = new URLSearchParams({
        limit: '20',
        offset: '0',
        unreadOnly: showUnreadOnly.toString()
      })

      const response = await fetch(`/api/notifications?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setNotifications(result.data.notifications)
        setStats(result.data.stats)
      } else {
        setError(result.error?.message || '알림을 불러오는데 실패했습니다')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        ))
        if (stats) {
          setStats(prev => prev ? { ...prev, unread: prev.unread - 1 } : null)
        }
      }
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mdshare-access-token')}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
        if (stats) {
          setStats(prev => prev ? { ...prev, total: prev.total - 1 } : null)
        }
      }
    } catch (error) {
      console.error('알림 삭제 실패:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'document_created':
      case 'document_updated':
      case 'document_deleted':
        return <FileText className="h-4 w-4 text-blue-600" />
      case 'member_invited':
      case 'member_joined':
      case 'member_left':
      case 'role_changed':
        return <Users className="h-4 w-4 text-green-600" />
      case 'sync_completed':
      case 'sync_failed':
        return <GitBranch className="h-4 w-4 text-purple-600" />
      case 'system_maintenance':
      case 'security_alert':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getNotificationTypeLabel = (type: string) => {
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

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return new Date(date).toLocaleDateString('ko-KR')
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">알림을 불러오는 중...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BellRing className="h-5 w-5 text-primary" />
            <span>알림</span>
            {stats && stats.unread > 0 && (
              <Badge variant="destructive" className="text-xs">
                {stats.unread}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={showUnreadOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              읽지 않음만
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* 통계 요약 */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">전체</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
              <div className="text-sm text-muted-foreground">읽지 않음</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.total - stats.unread}</div>
              <div className="text-sm text-muted-foreground">읽음</div>
            </div>
          </div>
        )}

        {/* 알림 목록 */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                notification.read 
                  ? 'bg-muted/30' 
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {getNotificationTypeLabel(notification.type)}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(notification.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {notification.data?.url && (
                  <div className="mt-2">
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      보기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">
                {showUnreadOnly ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
              </h3>
              <p className="text-sm text-muted-foreground">
                새로운 활동이 있으면 여기에 표시됩니다
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
