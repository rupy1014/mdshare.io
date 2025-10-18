import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/api'
import type { LoginCredentials } from '@/types/auth'

// Mock 사용자 데이터 (실제로는 데이터베이스에서 조회)
const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@mdshare.com',
    password: 'admin123', // 실제로는 해시화된 비밀번호
    name: '김개발',
    role: 'admin' as const,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    email: 'editor@mdshare.com',
    password: 'editor123',
    name: '박리더',
    role: 'editor' as const,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'user-3',
    email: 'viewer@mdshare.com',
    password: 'viewer123',
    name: '이뷰어',
    role: 'viewer' as const,
    createdAt: new Date('2024-01-03'),
  }
]

export async function POST(request: NextRequest) {
  try {
    const credentials: LoginCredentials = await request.json()
    const { email, password } = credentials

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '이메일과 비밀번호를 입력해주세요'
        }
      }, { status: 400 })
    }

    // 사용자 찾기
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '이메일 또는 비밀번호가 올바르지 않습니다'
        }
      }, { status: 401 })
    }

    // 세션 생성 (실제로는 JWT 토큰 생성)
    const session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: new Date()
      },
      accessToken: `access-token-${user.id}-${Date.now()}`,
      refreshToken: `refresh-token-${user.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간
    }

    return NextResponse.json({
      success: true,
      data: session
    })

  } catch (error) {
    console.error('로그인 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
