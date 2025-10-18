import { NextRequest, NextResponse } from 'next/server'
import type { SyncRequest, SyncResponse, DocumentSyncInfo } from '@/types/document'

// Mock 동기화 저장소
let mockSyncInfo: DocumentSyncInfo[] = [
  {
    documentId: 'doc-1',
    localPath: '/local/docs/api-auth.md',
    remotePath: '/docs/api-auth.md',
    gitHash: 'abc123def456',
    lastSync: new Date('2024-01-15T10:30:00Z'),
    status: 'synced'
  },
  {
    documentId: 'doc-2',
    localPath: '/local/docs/workspace-api.md',
    remotePath: '/docs/workspace-api.md',
    gitHash: 'def456ghi789',
    lastSync: new Date('2024-01-14T15:20:00Z'),
    status: 'modified'
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

// POST /api/workspaces/[id]/sync - 문서 동기화
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

    const syncRequest: SyncRequest = await request.json()

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

    // 동기화 실행
    const result = await executeSync(workspaceId, syncRequest)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('문서 동기화 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// GET /api/workspaces/[id]/sync - 동기화 상태 조회
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

    // 워크스페이스의 동기화 정보 조회
    const workspaceSyncInfo = mockSyncInfo.filter(sync => 
      sync.documentId.startsWith('doc-') && 
      mockDocuments.find(doc => doc.id === sync.documentId)?.workspaceId === workspaceId
    )

    return NextResponse.json({
      success: true,
      data: workspaceSyncInfo
    })

  } catch (error) {
    console.error('동기화 상태 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}

// 동기화 실행 함수
async function executeSync(workspaceId: string, syncRequest: SyncRequest): Promise<SyncResponse> {
  const syncedDocuments: DocumentSyncInfo[] = []
  const conflicts: any[] = []
  const errors: any[] = []

  for (const docSync of syncRequest.documents) {
    try {
      // 동기화 전략에 따른 처리
      switch (syncRequest.strategy) {
        case 'push':
          await pushDocument(workspaceId, docSync)
          break
        case 'pull':
          await pullDocument(workspaceId, docSync)
          break
        case 'sync':
          await syncDocument(workspaceId, docSync)
          break
      }

      // 동기화 성공
      syncedDocuments.push({
        ...docSync,
        status: 'synced',
        lastSync: new Date()
      })

      // 동기화 정보 업데이트
      const existingIndex = mockSyncInfo.findIndex(sync => sync.documentId === docSync.documentId)
      if (existingIndex >= 0) {
        mockSyncInfo[existingIndex] = {
          ...docSync,
          status: 'synced',
          lastSync: new Date()
        }
      } else {
        mockSyncInfo.push({
          ...docSync,
          status: 'synced',
          lastSync: new Date()
        })
      }

    } catch (error) {
      errors.push({
        documentId: docSync.documentId,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'SYNC_ERROR'
      })
    }
  }

  return {
    success: errors.length === 0,
    syncedDocuments,
    conflicts,
    errors
  }
}

// 문서 푸시 (로컬 → 원격)
async function pushDocument(workspaceId: string, docSync: DocumentSyncInfo): Promise<void> {
  // 실제로는 Git push 로직 구현
  console.log(`Pushing document ${docSync.documentId} to workspace ${workspaceId}`)
  
  // Mock: 푸시 성공
  await new Promise(resolve => setTimeout(resolve, 100))
}

// 문서 풀 (원격 → 로컬)
async function pullDocument(workspaceId: string, docSync: DocumentSyncInfo): Promise<void> {
  // 실제로는 Git pull 로직 구현
  console.log(`Pulling document ${docSync.documentId} from workspace ${workspaceId}`)
  
  // Mock: 풀 성공
  await new Promise(resolve => setTimeout(resolve, 100))
}

// 문서 동기화 (양방향)
async function syncDocument(workspaceId: string, docSync: DocumentSyncInfo): Promise<void> {
  // 실제로는 Git sync 로직 구현
  console.log(`Syncing document ${docSync.documentId} in workspace ${workspaceId}`)
  
  // Mock: 동기화 성공
  await new Promise(resolve => setTimeout(resolve, 150))
}

// Mock 문서 데이터
const mockDocuments = [
  {
    id: 'doc-1',
    workspaceId: 'workspace-1',
    path: '/docs/api-auth.md',
    title: 'API 문서 - 사용자 인증'
  },
  {
    id: 'doc-2',
    workspaceId: 'workspace-1',
    path: '/docs/workspace-api.md',
    title: '워크스페이스 API'
  }
]
