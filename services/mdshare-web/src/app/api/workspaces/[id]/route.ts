import { NextRequest, NextResponse } from 'next/server'
import type { Workspace, CreateWorkspaceData } from '@/types/auth'

// Mock 워크스페이스 저장소 (실제로는 데이터베이스)
let mockWorkspaces: Workspace[] = [
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

// GET /api/workspaces/[id] - 특정 워크스페이스 조회
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

    // 워크스페이스 찾기
    const workspace = mockWorkspaces.find(ws => ws.id === workspaceId)
    
    if (!workspace) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'WORKSPACE_NOT_FOUND',
          message: '워크스페이스를 찾을 수 없습니다'
        }
      }, { status: 404 })
    }

    // 접근 권한 확인 (소유자이거나 멤버)
    const hasAccess = workspace.ownerId === userId || 
      (workspaceId === 'workspace-1' && ['user-1', 'user-2', 'user-3'].includes(userId))

    if (!hasAccess) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: '워크스페이스에 접근할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: workspace
    })

  } catch (error) {
    console.error('워크스페이스 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// PUT /api/workspaces/[id] - 워크스페이스 수정
export async function PUT(
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
    const data: Partial<CreateWorkspaceData> = await request.json()

    // 워크스페이스 찾기
    const workspaceIndex = mockWorkspaces.findIndex(ws => ws.id === workspaceId)
    
    if (workspaceIndex === -1) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'WORKSPACE_NOT_FOUND',
          message: '워크스페이스를 찾을 수 없습니다'
        }
      }, { status: 404 })
    }

    const workspace = mockWorkspaces[workspaceIndex]

    // 소유자 권한 확인
    if (workspace.ownerId !== userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: '워크스페이스를 수정할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 워크스페이스 업데이트
    const updatedWorkspace = {
      ...workspace,
      ...data,
      updatedAt: new Date()
    }

    mockWorkspaces[workspaceIndex] = updatedWorkspace

    return NextResponse.json({
      success: true,
      data: updatedWorkspace
    })

  } catch (error) {
    console.error('워크스페이스 수정 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// DELETE /api/workspaces/[id] - 워크스페이스 삭제
export async function DELETE(
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

    // 워크스페이스 찾기
    const workspaceIndex = mockWorkspaces.findIndex(ws => ws.id === workspaceId)
    
    if (workspaceIndex === -1) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'WORKSPACE_NOT_FOUND',
          message: '워크스페이스를 찾을 수 없습니다'
        }
      }, { status: 404 })
    }

    const workspace = mockWorkspaces[workspaceIndex]

    // 소유자 권한 확인
    if (workspace.ownerId !== userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: '워크스페이스를 삭제할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 워크스페이스 삭제
    mockWorkspaces.splice(workspaceIndex, 1)

    return NextResponse.json({
      success: true,
      data: null
    })

  } catch (error) {
    console.error('워크스페이스 삭제 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
