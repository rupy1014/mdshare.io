import { NextRequest, NextResponse } from 'next/server'

// Mock 사용자 데이터
const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@mdshare.com',
    name: '김개발',
    role: 'admin' as const,
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date()
  },
  {
    id: 'user-2',
    email: 'editor@mdshare.com',
    name: '박리더',
    role: 'editor' as const,
    createdAt: new Date('2024-01-02'),
    lastLoginAt: new Date()
  }
]

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
    
    // 토큰에서 사용자 ID 추출 (실제로는 JWT 디코딩)
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
    const user = mockUsers.find(u => u.id === userId)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '사용자를 찾을 수 없습니다'
        }
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    })

  } catch (error) {
    console.error('사용자 정보 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
