import { NextRequest, NextResponse } from 'next/server'
import type { Document } from '@/types/document'

// Mock 문서 저장소 (실제로는 데이터베이스)
let mockDocuments: Document[] = [
  {
    id: 'doc-1',
    workspaceId: 'workspace-1',
    path: '/docs/api-auth.md',
    title: 'API 문서 - 사용자 인증',
    content: `# API 문서 - 사용자 인증

## 개요
이 문서는 MDShare 플랫폼의 사용자 인증 API에 대한 명세서입니다.

## 인증 플로우
### 1. 로그인
사용자가 이메일과 비밀번호로 로그인합니다.

\`\`\`javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

## 관련 문서
- [워크스페이스 API](./workspace-api.md)
- [문서 관리 API](./document-api.md)`,
    metadata: {
      wordCount: 1250,
      readingTime: 5,
      author: '김개발',
      tags: ['API', '인증', 'JWT'],
      lastModified: new Date('2024-01-15T10:30:00Z'),
      version: '1.2.0',
      claudeOptimized: true
    },
    createdAt: new Date('2024-01-01T09:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 'doc-2',
    workspaceId: 'workspace-1',
    path: '/docs/workspace-api.md',
    title: '워크스페이스 API',
    content: `# 워크스페이스 API

## 개요
워크스페이스 관리를 위한 API 엔드포인트입니다.

## 엔드포인트
- GET /api/workspaces - 워크스페이스 목록
- POST /api/workspaces - 새 워크스페이스 생성
- GET /api/workspaces/{id} - 워크스페이스 상세`,
    metadata: {
      wordCount: 800,
      readingTime: 3,
      author: '박리더',
      tags: ['API', '워크스페이스'],
      lastModified: new Date('2024-01-14T15:20:00Z'),
      version: '1.0.0',
      claudeOptimized: true
    },
    createdAt: new Date('2024-01-02T10:00:00Z'),
    updatedAt: new Date('2024-01-14T15:20:00Z')
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

// GET /api/workspaces/[id]/documents - 워크스페이스 문서 목록 조회
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

    // 워크스페이스의 모든 문서 조회
    const workspaceDocuments = mockDocuments.filter(doc => doc.workspaceId === workspaceId)

    return NextResponse.json({
      success: true,
      data: workspaceDocuments
    })

  } catch (error) {
    console.error('문서 목록 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// POST /api/workspaces/[id]/documents - 새 문서 생성
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

    const { path, title, content } = await request.json()

    // 입력 검증
    if (!path || !title || !content) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '경로, 제목, 내용을 모두 입력해주세요'
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

    // 에디터 권한 확인
    if (userMembership.role === 'viewer') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '문서를 생성할 권한이 없습니다'
        }
      }, { status: 403 })
    }

    // 중복 경로 확인
    const existingDoc = mockDocuments.find(doc => 
      doc.workspaceId === workspaceId && doc.path === path
    )

    if (existingDoc) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PATH_EXISTS',
          message: '이미 같은 경로의 문서가 존재합니다'
        }
      }, { status: 409 })
    }

    // 새 문서 생성
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      workspaceId,
      path,
      title,
      content,
      metadata: {
        wordCount: content.split(/\s+/).length,
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
        author: '사용자', // 실제로는 사용자 이름 조회
        tags: [],
        lastModified: new Date(),
        version: '1.0.0',
        claudeOptimized: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    mockDocuments.push(newDocument)

    return NextResponse.json({
      success: true,
      data: newDocument
    })

  } catch (error) {
    console.error('문서 생성 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
