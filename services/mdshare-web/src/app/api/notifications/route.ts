import { NextRequest, NextResponse } from 'next/server'
import type { Notification, NotificationSettings, NotificationStats } from '@/types/notification'

// Mock 알림 저장소
let mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    workspaceId: 'workspace-1',
    type: 'document_created',
    title: '새 문서가 생성되었습니다',
    message: 'API 문서 - 사용자 인증이 생성되었습니다',
    data: {
      documentId: 'doc-1',
      documentTitle: 'API 문서 - 사용자 인증',
      url: '/document/doc-1'
    },
    read: false,
    createdAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    workspaceId: 'workspace-1',
    type: 'member_joined',
    title: '새 멤버가 참여했습니다',
    message: '박리더님이 워크스페이스에 참여했습니다',
    data: {
      memberId: 'user-2',
      memberName: '박리더',
      url: '/workspace/demo/access'
    },
    read: false,
    createdAt: new Date('2024-01-15T09:15:00Z')
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    workspaceId: 'workspace-1',
    type: 'sync_completed',
    title: '문서 동기화 완료',
    message: '3개 문서가 성공적으로 동기화되었습니다',
    data: {
      url: '/workspace/demo/claude'
    },
    read: true,
    createdAt: new Date('2024-01-15T08:45:00Z')
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    workspaceId: 'workspace-1',
    type: 'role_changed',
    title: '역할이 변경되었습니다',
    message: '이뷰어님의 역할이 뷰어에서 에디터로 변경되었습니다',
    data: {
      memberId: 'user-3',
      memberName: '이뷰어',
      role: 'editor',
      url: '/workspace/demo/access'
    },
    read: true,
    createdAt: new Date('2024-01-14T16:20:00Z')
  }
]

// Mock 멤버 저장소
const mockMembers = [
  {
    id: 'member-1',
    workspaceId: 'workspace-1',
    userId: 'user-1',
    role: 'admin'
  }
]

// GET /api/notifications - 사용자 알림 목록 조회
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다'
        }
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const userIdMatch = token.match(/access-token-(user-\d+)-/)
    
    if (!userIdMatch) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다'
        }
      }, { status: 401 })
    }

    const userId = userIdMatch[1]

    // URL 파라미터 파싱
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true'

    // 사용자의 알림 조회
    let userNotifications = mockNotifications.filter(notif => notif.userId === userId)

    // 읽지 않은 알림만 필터링
    if (unreadOnly) {
      userNotifications = userNotifications.filter(notif => !notif.read)
    }

    // 정렬 (최신순)
    userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // 페이지네이션
    const paginatedNotifications = userNotifications.slice(offset, offset + limit)

    // 통계 계산
    const stats: NotificationStats = {
      total: userNotifications.length,
      unread: userNotifications.filter(notif => !notif.read).length,
      byType: {} as any,
      recentActivity: userNotifications.slice(0, 5)
    }

    // 타입별 통계
    userNotifications.forEach(notif => {
      if (!stats.byType[notif.type]) {
        stats.byType[notif.type] = 0
      }
      stats.byType[notif.type]++
    })

    return NextResponse.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        stats,
        pagination: {
          limit,
          offset,
          total: userNotifications.length,
          hasMore: offset + limit < userNotifications.length
        }
      }
    })

  } catch (error) {
    console.error('알림 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

