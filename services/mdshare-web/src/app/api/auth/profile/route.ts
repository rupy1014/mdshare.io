import { NextRequest, NextResponse } from 'next/server'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export async function PUT(request: NextRequest) {
  try {
    // JWT 토큰 검증
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: { message: '인증 토큰이 필요합니다' }
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return NextResponse.json({
        success: false,
        error: { message: '서버 설정 오류' }
      }, { status: 500 })
    }

    const decoded = jwt.verify(token, jwtSecret) as any
    const userId = decoded.userId

    // 요청 데이터 파싱
    const body = await request.json()
    const { name, nickname, bio, company, role } = body

    // 필수 필드 검증
    if (!name || !nickname) {
      return NextResponse.json({
        success: false,
        error: { message: '이름과 닉네임은 필수입니다' }
      }, { status: 400 })
    }

    // 사용자 정보 업데이트
    const updatedUser = await db.update(users)
      .set({
        name,
        nickname,
        bio: bio || null,
        company: company || null,
        role: role || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))
      .returning()

    if (updatedUser.length === 0) {
      return NextResponse.json({
        success: false,
        error: { message: '사용자를 찾을 수 없습니다' }
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedUser[0]
    })

  } catch (error) {
    console.error('프로필 업데이트 오류:', error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({
        success: false,
        error: { message: '유효하지 않은 토큰입니다' }
      }, { status: 401 })
    }

    return NextResponse.json({
      success: false,
      error: { message: '프로필 업데이트에 실패했습니다' }
    }, { status: 500 })
  }
}
