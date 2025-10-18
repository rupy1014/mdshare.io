import { NextRequest, NextResponse } from 'next/server'
import type { ClaudeCommand, ClaudeCodeIntegration } from '@/types/document'

// Mock Claude 명령어 저장소
let mockClaudeCommands: ClaudeCommand[] = [
  {
    id: 'cmd-1',
    name: 'search-docs',
    description: '문서에서 키워드 검색',
    command: 'mdshare search "키워드" --workspace=WORKSPACE_ID',
    category: 'search',
    examples: [
      'mdshare search "API" --workspace=workspace-1',
      'mdshare search "인증" --workspace=workspace-1 --limit=10'
    ]
  },
  {
    id: 'cmd-2',
    name: 'analyze-docs',
    description: '문서 분석 및 요약',
    command: 'mdshare analyze --workspace=WORKSPACE_ID --document=DOCUMENT_ID',
    category: 'analyze',
    examples: [
      'mdshare analyze --workspace=workspace-1 --document=doc-1',
      'mdshare analyze --workspace=workspace-1 --all'
    ]
  },
  {
    id: 'cmd-3',
    name: 'generate-doc',
    description: '새 문서 생성',
    command: 'mdshare generate --workspace=WORKSPACE_ID --title="제목" --template=TEMPLATE',
    category: 'generate',
    examples: [
      'mdshare generate --workspace=workspace-1 --title="새 API 문서" --template=api',
      'mdshare generate --workspace=workspace-1 --title="회의록" --template=meeting'
    ]
  },
  {
    id: 'cmd-4',
    name: 'optimize-docs',
    description: 'Claude Code 최적화를 위한 문서 구조 개선',
    command: 'mdshare optimize --workspace=WORKSPACE_ID --document=DOCUMENT_ID',
    category: 'optimize',
    examples: [
      'mdshare optimize --workspace=workspace-1 --document=doc-1',
      'mdshare optimize --workspace=workspace-1 --all'
    ]
  },
  {
    id: 'cmd-5',
    name: 'sync-docs',
    description: '로컬과 원격 문서 동기화',
    command: 'mdshare sync --workspace=WORKSPACE_ID --strategy=STRATEGY',
    category: 'generate',
    examples: [
      'mdshare sync --workspace=workspace-1 --strategy=pull',
      'mdshare sync --workspace=workspace-1 --strategy=push',
      'mdshare sync --workspace=workspace-1 --strategy=sync'
    ]
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

// GET /api/workspaces/[id]/claude/commands - Claude Code 명령어 목록 조회
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

    // 카테고리별로 명령어 그룹화
    const commandsByCategory = mockClaudeCommands.reduce((acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = []
      }
      acc[command.category].push(command)
      return acc
    }, {} as Record<string, ClaudeCommand[]>)

    return NextResponse.json({
      success: true,
      data: {
        commands: commandsByCategory,
        workspaceId,
        integration: {
          lastIndexed: new Date('2024-01-15T10:30:00Z'),
          status: 'active'
        }
      }
    })

  } catch (error) {
    console.error('Claude 명령어 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
