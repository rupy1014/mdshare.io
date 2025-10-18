import { NextRequest, NextResponse } from 'next/server'
import type { WorkspaceMember, User } from '@/types/auth'

// Mock 멤버 저장소 (실제로는 데이터베이스)
let mockMembers: WorkspaceMember[] = [
  {
    id: 'member-1',
    workspaceId: 'workspace-1',
    userId: 'user-1',
    role: 'admin',
    joinedAt: new Date('2024-01-01'),
    invitedBy: 'user-1',
    user: {
      id: 'user-1',
      email: 'admin@mdshare.com',
      name: '김개발',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date()
    }
  },
  {
    id: 'member-2',
    workspaceId: 'workspace-1',
    userId: 'user-2',
    role: 'editor',
    joinedAt: new Date('2024-01-02'),
    invitedBy: 'user-1',
    user: {
      id: 'user-2',
      email: 'editor@mdshare.com',
      name: '박리더',
      role: 'editor',
      createdAt: new Date('2024-01-02'),
      lastLoginAt: new Date()
    }
  },
  {
    id: 'member-3',
    workspaceId: 'workspace-1',
    userId: 'user-3',
    role: 'viewer',
    joinedAt: new Date('2024-01-03'),
    invitedBy: 'user-1',
    user: {
      id: 'user-3',
      email: 'viewer@mdshare.com',
      name: '이뷰어',
      role: 'viewer',
      createdAt: new Date('2024-01-03'),
      lastLoginAt: new Date()
    }
  }
]

// Mock 사용자 저장소
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@mdshare.com',
    name: '김개발',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date()
  },
  {
    id: 'user-2',
    email: 'editor@mdshare.com',
    name: '박리더',
    role: 'editor',
    createdAt: new Date('2024-01-02'),
    lastLoginAt: new Date()
  },
  {
    id: 'user-3',
    email: 'viewer@mdshare.com',
    name: '이뷰어',
    role: 'viewer',
    createdAt: new Date('2024-01-03'),
    lastLoginAt: new Date()
  }
]

// GET /api/workspaces/[id]/members - 워크스페이스 멤버 목록 조회
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
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
    const workspaceId = params.id

    // 워크스페이스 멤버인지 확인
    const userMembership = mockMembers.find(m => 
      m.workspaceId === workspaceId && m.userId === userId
    )

    if (!userMembership) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: '워크스페이스에 접근할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 워크스페이스의 모든 멤버 조회
    const workspaceMembers = mockMembers.filter(m => m.workspaceId === workspaceId)

    return NextResponse.json({
      success: true,
      data: workspaceMembers
    })

  } catch (error) {
    console.error('멤버 목록 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
