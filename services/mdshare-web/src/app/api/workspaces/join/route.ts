import { NextRequest, NextResponse } from 'next/server'
import type { JoinWorkspaceData, Workspace } from '@/types/auth'

// Mock 초대 코드 저장소 (실제로는 데이터베이스)
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

// POST /api/workspaces/join - 초대 코드로 워크스페이스 참여
export async function POST(request: NextRequest) {
  try {
    const data: JoinWorkspaceData = await request.json()
    const { inviteCode, name, email } = data

    // 입력 검증
    if (!inviteCode || !name || !email) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '모든 필드를 입력해주세요'
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

    // 사용 횟수 증가
    inviteCodeData.usedCount++
    
    // 워크스페이스 멤버 수 증가
    workspace.memberCount++
    workspace.updatedAt = new Date()

    // TODO: 실제로는 사용자 생성 및 멤버십 추가
    // 여기서는 워크스페이스 정보만 반환
    return NextResponse.json({
      success: true,
      data: {
        workspace,
        role: inviteCodeData.role,
        message: `${workspace.name} 워크스페이스에 ${inviteCodeData.role} 역할로 참여했습니다`
      }
    })

  } catch (error) {
    console.error('워크스페이스 참여 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
