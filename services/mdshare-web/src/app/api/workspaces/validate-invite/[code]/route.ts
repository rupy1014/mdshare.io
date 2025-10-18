import { NextRequest, NextResponse } from 'next/server'
import type { Workspace } from '@/types/auth'

// Mock 초대 코드 저장소
const mockInviteCodes = [
  {
    id: 'invite-1',
    workspaceId: 'workspace-1',
    code: 'ADMIN123',
    role: 'admin' as const,
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
    role: 'editor' as const,
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
    role: 'viewer' as const,
    maxUses: 10,
    usedCount: 1,
    expiresAt: new Date('2024-03-01'),
    createdAt: new Date('2024-01-10'),
    createdBy: 'user-1',
    isActive: true
  }
]

// Mock 워크스페이스 저장소
const mockWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'TechTeam-Docs',
    description: '개발팀 기술 문서 및 회의록 관리',
    visibility: 'private',
    ownerId: 'user-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    memberCount: 5,
    settings: {
      allowInvites: true,
      defaultRole: 'editor',
      requireApproval: false,
      gitIntegration: true
    }
  }
]

// Mock 사용자 저장소
const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@mdshare.com',
    name: '김개발',
    role: 'admin' as const,
    createdAt: new Date('2024-01-01')
  }
]

// GET /api/workspaces/validate-invite/[code] - 초대 코드 유효성 검증
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const params = await context.params
  try {
    const inviteCode = params.code

    if (!inviteCode) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_INVITE_CODE',
          message: '초대 코드가 필요합니다'
        }
      }, { status: 400 })
    }

    // 초대 코드 찾기
    const inviteCodeData = mockInviteCodes.find(invite => 
      invite.code === inviteCode && invite.isActive
    )

    if (!inviteCodeData) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INVITE_CODE',
          message: '유효하지 않은 초대 코드입니다'
        }
      }, { status: 400 })
    }

    // 만료 확인
    if (inviteCodeData.expiresAt < new Date()) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'EXPIRED_INVITE_CODE',
          message: '만료된 초대 코드입니다'
        }
      }, { status: 400 })
    }

    // 사용 횟수 확인
    if (inviteCodeData.usedCount >= inviteCodeData.maxUses) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MAX_USES_EXCEEDED',
          message: '초대 코드의 최대 사용 횟수를 초과했습니다'
        }
      }, { status: 400 })
    }

    // 워크스페이스 찾기
    const workspace = mockWorkspaces.find(ws => ws.id === inviteCodeData.workspaceId)
    
    if (!workspace) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'WORKSPACE_NOT_FOUND',
          message: '워크스페이스를 찾을 수 없습니다'
        }
      }, { status: 404 })
    }

    // 생성자 정보 찾기
    const createdByUser = mockUsers.find(u => u.id === inviteCodeData.createdBy)

    return NextResponse.json({
      success: true,
      data: {
        workspace: {
          id: workspace.id,
          name: workspace.name,
          description: workspace.description,
          visibility: workspace.visibility,
          memberCount: workspace.memberCount,
          settings: workspace.settings
        },
        inviteCode: {
          role: inviteCodeData.role,
          maxUses: inviteCodeData.maxUses,
          usedCount: inviteCodeData.usedCount,
          expiresAt: inviteCodeData.expiresAt,
          createdBy: createdByUser?.name || '알 수 없음'
        }
      }
    })

  } catch (error) {
    console.error('초대 코드 검증 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
