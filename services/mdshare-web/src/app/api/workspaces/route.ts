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
  },
  {
    id: 'workspace-2',
    name: '개인-학습노트',
    description: '개인 학습 자료 및 메모',
    visibility: 'private',
    ownerId: 'user-2',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
    memberCount: 1,
    settings: {
      allowInvites: false,
      defaultRole: 'editor',
      requireApproval: true,
      gitIntegration: false
    }
  }
]

// GET /api/workspaces - 사용자의 워크스페이스 목록 조회
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
    
    // 사용자가 소유하거나 멤버인 워크스페이스 조회
    const userWorkspaces = mockWorkspaces.filter(ws => 
      ws.ownerId === userId || 
      // 실제로는 멤버십 테이블에서 조회
      (ws.id === 'workspace-1' && ['user-1', 'user-2', 'user-3'].includes(userId))
    )

    return NextResponse.json({
      success: true,
      data: userWorkspaces
    })

  } catch (error) {
    console.error('워크스페이스 목록 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// POST /api/workspaces - 새 워크스페이스 생성
export async function POST(request: NextRequest) {
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
    const data: CreateWorkspaceData = await request.json()
    const { name, description, visibility } = data

    // 입력 검증
    if (!name || !description) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '워크스페이스 이름과 설명을 입력해주세요'
        }
      }, { status: 400 })
    }

    // 이름 중복 검사
    const existingWorkspace = mockWorkspaces.find(ws => 
      ws.name === name && ws.ownerId === userId
    )
    
    if (existingWorkspace) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NAME_EXISTS',
          message: '이미 같은 이름의 워크스페이스가 있습니다'
        }
      }, { status: 409 })
    }

    // 새 워크스페이스 생성
    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name,
      description,
      visibility,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      memberCount: 1, // 소유자 포함
      settings: {
        allowInvites: true,
        defaultRole: 'editor',
        requireApproval: false,
        gitIntegration: true
      }
    }

    mockWorkspaces.push(newWorkspace)

    return NextResponse.json({
      success: true,
      data: newWorkspace
    })

  } catch (error) {
    console.error('워크스페이스 생성 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
