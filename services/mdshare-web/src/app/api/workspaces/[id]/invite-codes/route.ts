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

// GET /api/workspaces/[id]/invite-codes - 워크스페이스 초대 코드 목록 조회
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

    // 관리자 권한 확인
    if (userMembership.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '초대 코드를 조회할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 워크스페이스의 모든 초대 코드 조회
    const workspaceInviteCodes = mockInviteCodes.filter(ic => ic.workspaceId === workspaceId)

    return NextResponse.json({
      success: true,
      data: workspaceInviteCodes
    })

  } catch (error) {
    console.error('초대 코드 목록 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// POST /api/workspaces/[id]/invite-codes - 새 초대 코드 생성
export async function POST(
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

    const { role, maxUses = 1, expiresInDays = 30 } = await request.json()

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

    if (maxUses < 1 || maxUses > 100) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_MAX_USES',
          message: '최대 사용 횟수는 1-100 사이여야 합니다'
        }
      }, { status: 400 })
    }

    if (expiresInDays < 1 || expiresInDays > 365) {
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
          message: '초대 코드를 생성할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 초대 코드 생성
    const code = generateInviteCode()
    const newInviteCode: InviteCode = {
      id: `invite-${Date.now()}`,
      workspaceId,
      code,
      role: role as 'admin' | 'editor' | 'viewer',
      maxUses,
      usedCount: 0,
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      createdBy: userId,
      isActive: true
    }

    mockInviteCodes.push(newInviteCode)

    return NextResponse.json({
      success: true,
      data: newInviteCode
    })

  } catch (error) {
    console.error('초대 코드 생성 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// 초대 코드 생성 함수
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
