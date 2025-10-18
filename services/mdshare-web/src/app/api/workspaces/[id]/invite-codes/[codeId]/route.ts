import { NextRequest, NextResponse } from 'next/server'
import type { InviteCode } from '@/types/auth'

// Mock 초대 코드 저장소 (실제로는 데이터베이스)
let mockInviteCodes: InviteCode[] = [
  {
    id: 'invite-1',
    workspaceId: 'workspace-1',
    code: 'ADMIN123',
    role: 'admin',
    maxUses: 1,
    usedCount: 0,
    expiresAt: new Date('2024-02-01'),
    createdAt: new Date('2024-01-01'),
    createdBy: 'user-1',
    isActive: true
  },
  {
    id: 'invite-2',
    workspaceId: 'workspace-1',
    code: 'EDITOR456',
    role: 'editor',
    maxUses: 5,
    usedCount: 2,
    expiresAt: new Date('2024-02-15'),
    createdAt: new Date('2024-01-05'),
    createdBy: 'user-1',
    isActive: true
  },
  {
    id: 'invite-3',
    workspaceId: 'workspace-1',
    code: 'VIEWER789',
    role: 'viewer',
    maxUses: 10,
    usedCount: 1,
    expiresAt: new Date('2024-03-01'),
    createdAt: new Date('2024-01-10'),
    createdBy: 'user-1',
    isActive: true
  }
]

// Mock 멤버 저장소
const mockMembers = [
  {
    id: 'member-1',
    workspaceId: 'workspace-1',
    userId: 'user-1',
    role: 'admin',
    joinedAt: new Date('2024-01-01'),
    invitedBy: 'user-1'
  }
]

// PUT /api/workspaces/[id]/invite-codes/[codeId] - 초대 코드 수정
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; codeId: string }> }
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
    const codeId = params.codeId

    const { maxUses, expiresInDays, isActive } = await request.json()

    // 입력 검증
    if (maxUses !== undefined && (maxUses < 1 || maxUses > 100)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_MAX_USES',
          message: '최대 사용 횟수는 1-100 사이여야 합니다'
        }
      }, { status: 400 })
    }

    if (expiresInDays !== undefined && (expiresInDays < 1 || expiresInDays > 365)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_EXPIRY',
          message: '만료 기간은 1-365일 사이여야 합니다'
        }
      }, { status: 400 })
    }

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

    // 관리자 권한 확인
    if (userMembership.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '초대 코드를 수정할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 초대 코드 찾기
    const codeIndex = mockInviteCodes.findIndex(ic => 
      ic.workspaceId === workspaceId && ic.id === codeId
    )

    if (codeIndex === -1) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVITE_CODE_NOT_FOUND',
          message: '초대 코드를 찾을 수 없습니다'
        }
      }, { status: 404 })
    }

    const inviteCode = mockInviteCodes[codeIndex]

    // 생성자 권한 확인
    if (inviteCode.createdBy !== userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '이 초대 코드를 수정할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 업데이트할 필드 준비
    const updates: Partial<InviteCode> = {}

    if (maxUses !== undefined) {
      updates.maxUses = maxUses
    }

    if (expiresInDays !== undefined) {
      updates.expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    }

    if (isActive !== undefined) {
      updates.isActive = isActive
    }

    // 초대 코드 업데이트
    mockInviteCodes[codeIndex] = {
      ...inviteCode,
      ...updates
    }

    return NextResponse.json({
      success: true,
      data: mockInviteCodes[codeIndex]
    })

  } catch (error) {
    console.error('초대 코드 수정 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// DELETE /api/workspaces/[id]/invite-codes/[codeId] - 초대 코드 삭제
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; codeId: string }> }
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
    const codeId = params.codeId

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

    // 관리자 권한 확인
    if (userMembership.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '초대 코드를 삭제할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 초대 코드 찾기
    const codeIndex = mockInviteCodes.findIndex(ic => 
      ic.workspaceId === workspaceId && ic.id === codeId
    )

    if (codeIndex === -1) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVITE_CODE_NOT_FOUND',
          message: '초대 코드를 찾을 수 없습니다'
        }
      }, { status: 404 })
    }

    const inviteCode = mockInviteCodes[codeIndex]

    // 생성자 권한 확인
    if (inviteCode.createdBy !== userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '이 초대 코드를 삭제할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 초대 코드 삭제
    mockInviteCodes.splice(codeIndex, 1)

    return NextResponse.json({
      success: true,
      data: null
    })

  } catch (error) {
    console.error('초대 코드 삭제 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
