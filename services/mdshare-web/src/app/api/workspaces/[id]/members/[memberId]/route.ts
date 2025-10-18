import { NextRequest, NextResponse } from 'next/server'
import type { WorkspaceMember } from '@/types/auth'

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

// PUT /api/workspaces/[id]/members/[memberId] - 멤버 역할 변경
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; memberId: string }> }
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
    const memberId = params.memberId

    const { role } = await request.json()

    // 입력 검증
    if (!role || !['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_ROLE',
          message: '유효한 역할을 선택해주세요'
        }
      }, { status: 400 })
    }

    // 요청자의 멤버십 확인
    const requesterMembership = mockMembers.find(m => 
      m.workspaceId === workspaceId && m.userId === userId
    )

    if (!requesterMembership) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: '워크스페이스에 접근할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 관리자 권한 확인
    if (requesterMembership.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '멤버 역할을 변경할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 대상 멤버 찾기
    const memberIndex = mockMembers.findIndex(m => 
      m.workspaceId === workspaceId && m.id === memberId
    )

    if (memberIndex === -1) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MEMBER_NOT_FOUND',
          message: '멤버를 찾을 수 없습니다'
        }
      }, { status: 404 })
    }

    // 마지막 관리자 보호 (모든 멤버가 관리자가 아닌 경우 방지)
    const targetMember = mockMembers[memberIndex]
    if (targetMember.role === 'admin' && role !== 'admin') {
      const adminCount = mockMembers.filter(m => 
        m.workspaceId === workspaceId && m.role === 'admin'
      ).length

      if (adminCount <= 1) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'LAST_ADMIN',
            message: '마지막 관리자의 역할을 변경할 수 없습니다'
          }
        }, { status: 400 })
      }
    }

    // 역할 업데이트
    mockMembers[memberIndex] = {
      ...mockMembers[memberIndex],
      role: role as 'admin' | 'editor' | 'viewer'
    }

    return NextResponse.json({
      success: true,
      data: mockMembers[memberIndex]
    })

  } catch (error) {
    console.error('멤버 역할 변경 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// DELETE /api/workspaces/[id]/members/[memberId] - 멤버 제거
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; memberId: string }> }
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
    const memberId = params.memberId

    // 요청자의 멤버십 확인
    const requesterMembership = mockMembers.find(m => 
      m.workspaceId === workspaceId && m.userId === userId
    )

    if (!requesterMembership) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: '워크스페이스에 접근할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 관리자 권한 확인
    if (requesterMembership.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '멤버를 제거할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 대상 멤버 찾기
    const memberIndex = mockMembers.findIndex(m => 
      m.workspaceId === workspaceId && m.id === memberId
    )

    if (memberIndex === -1) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MEMBER_NOT_FOUND',
          message: '멤버를 찾을 수 없습니다'
        }
      }, { status: 404 })
    }

    const targetMember = mockMembers[memberIndex]

    // 자기 자신 제거 방지
    if (targetMember.userId === userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'CANNOT_REMOVE_SELF',
          message: '자기 자신을 제거할 수 없습니다'
        }
      }, { status: 400 })
    }

    // 마지막 관리자 보호
    if (targetMember.role === 'admin') {
      const adminCount = mockMembers.filter(m => 
        m.workspaceId === workspaceId && m.role === 'admin'
      ).length

      if (adminCount <= 1) {
        return NextResponse.json({
          success: false,
          error: {
            code: 'LAST_ADMIN',
            message: '마지막 관리자를 제거할 수 없습니다'
          }
        }, { status: 400 })
      }
    }

    // 멤버 제거
    mockMembers.splice(memberIndex, 1)

    return NextResponse.json({
      success: true,
      data: null
    })

  } catch (error) {
    console.error('멤버 제거 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
