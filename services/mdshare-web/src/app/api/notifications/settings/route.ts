import { NextRequest, NextResponse } from 'next/server'
import type { NotificationSettings } from '@/types/notification'

// Mock 알림 설정 저장소
let mockNotificationSettings: NotificationSettings[] = [
  {
    userId: 'user-1',
    email: true,
    browser: true,
    types: {
      document_created: true,
      document_updated: true,
      document_deleted: true,
      member_invited: true,
      member_joined: true,
      member_left: true,
      role_changed: true,
      workspace_created: true,
      workspace_updated: true,
      comment_added: true,
      sync_completed: false,
      sync_failed: true,
      system_maintenance: true,
      security_alert: true
    },
    frequency: 'immediate'
  }
]

// GET /api/notifications/settings - 알림 설정 조회
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

    // 사용자의 알림 설정 조회
    let userSettings = mockNotificationSettings.find(settings => settings.userId === userId)

    // 설정이 없으면 기본값 생성
    if (!userSettings) {
      userSettings = {
        userId,
        email: true,
        browser: true,
        types: {
          document_created: true,
          document_updated: true,
          document_deleted: true,
          member_invited: true,
          member_joined: true,
          member_left: true,
          role_changed: true,
          workspace_created: true,
          workspace_updated: true,
          comment_added: true,
          sync_completed: false,
          sync_failed: true,
          system_maintenance: true,
          security_alert: true
        },
        frequency: 'immediate'
      }
      mockNotificationSettings.push(userSettings)
    }

    return NextResponse.json({
      success: true,
      data: userSettings
    })

  } catch (error) {
    console.error('알림 설정 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// PUT /api/notifications/settings - 알림 설정 업데이트
export async function PUT(request: NextRequest) {
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
    const updates: Partial<NotificationSettings> = await request.json()

    // 입력 검증
    if (updates.frequency && !['immediate', 'daily', 'weekly'].includes(updates.frequency)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_FREQUENCY',
          message: '유효한 알림 빈도를 선택해주세요'
        }
      }, { status: 400 })
    }

    // 기존 설정 찾기
    const settingsIndex = mockNotificationSettings.findIndex(settings => settings.userId === userId)

    if (settingsIndex === -1) {
      // 새 설정 생성
      const newSettings: NotificationSettings = {
        userId,
        email: updates.email ?? true,
        browser: updates.browser ?? true,
        types: updates.types ?? {
          document_created: true,
          document_updated: true,
          document_deleted: true,
          member_invited: true,
          member_joined: true,
          member_left: true,
          role_changed: true,
          workspace_created: true,
          workspace_updated: true,
          comment_added: true,
          sync_completed: false,
          sync_failed: true,
          system_maintenance: true,
          security_alert: true
        },
        frequency: updates.frequency ?? 'immediate'
      }
      mockNotificationSettings.push(newSettings)

      return NextResponse.json({
        success: true,
        data: newSettings
      })
    } else {
      // 기존 설정 업데이트
      mockNotificationSettings[settingsIndex] = {
        ...mockNotificationSettings[settingsIndex],
        ...updates
      }

      return NextResponse.json({
        success: true,
        data: mockNotificationSettings[settingsIndex]
      })
    }

  } catch (error) {
    console.error('알림 설정 업데이트 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
