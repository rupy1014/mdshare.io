import { NextRequest, NextResponse } from 'next/server'
import type { RegisterData } from '@/types/auth'

// Mock 사용자 저장소 (실제로는 데이터베이스)
let mockUsers: any[] = [
  {
    id: 'user-1',
    email: 'admin@mdshare.com',
    password: 'admin123',
    name: '김개발',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  }
]

export async function POST(request: NextRequest) {
  try {
    const data: RegisterData = await request.json()
    const { email, password, name } = data

    // 입력 검증
    if (!email || !password || !name) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '모든 필드를 입력해주세요'
        }
      }, { status: 400 })
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: '올바른 이메일 형식을 입력해주세요'
        }
      }, { status: 400 })
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: '비밀번호는 최소 6자 이상이어야 합니다'
        }
      }, { status: 400 })
    }

    // 중복 이메일 검사
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: '이미 사용 중인 이메일입니다'
        }
      }, { status: 409 })
    }

    // 새 사용자 생성
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password, // 실제로는 해시화
      name,
      role: 'viewer' as const,
      createdAt: new Date()
    }

    mockUsers.push(newUser)

    // 세션 생성
    const session = {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        createdAt: newUser.createdAt,
        lastLoginAt: new Date()
      },
      accessToken: `access-token-${newUser.id}-${Date.now()}`,
      refreshToken: `refresh-token-${newUser.id}-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간
    }

    return NextResponse.json({
      success: true,
      data: session
    })

  } catch (error) {
    console.error('회원가입 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
