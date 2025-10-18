import { NextRequest, NextResponse } from 'next/server'
import { oauthService } from '@/lib/oauth-service'
import { db, users, oauthSessions } from '@/lib/db'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // 오류 처리
    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${error}`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=missing_params`)
    }

    // state 파라미터 파싱
    const oauthState = oauthService.parseState(state)
    const redirectUrl = oauthState.redirectUrl || '/dashboard'

    // 인증 코드를 액세스 토큰으로 교환
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback/google`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('토큰 교환 실패')
    }

    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token, expires_in } = tokenData

    // 구글 API로 사용자 정보 조회
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('사용자 정보 조회 실패')
    }

    const googleUser = await userResponse.json()

    // 기존 사용자 확인 또는 새 사용자 생성
    let user = await db.select().from(users).where(eq(users.email, googleUser.email)).limit(1)
    
    if (user.length === 0) {
      // 새 사용자 생성
      const newUser = {
        id: `user_${Date.now()}`,
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
        provider: 'google',
        providerId: googleUser.id,
        role: 'user',
        plan: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      await db.insert(users).values(newUser)
      user = [newUser]
    }

    // OAuth 세션 저장
    const sessionId = `session_${Date.now()}`
    const expiresAt = new Date(Date.now() + (expires_in * 1000))
    
    await db.insert(oauthSessions).values({
      id: sessionId,
      userId: user[0].id,
      provider: 'google',
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt,
      scope: 'openid email profile',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // JWT 토큰 생성
    const jwtToken = jwt.sign(
      {
        userId: user[0].id,
        email: user[0].email,
        name: user[0].name,
        role: user[0].role,
        provider: 'google',
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // 프로필 정보 확인 후 적절한 페이지로 리다이렉트
    const needsProfileSetup = !user[0].name || user[0].name.trim() === ''
    const finalRedirectUrl = needsProfileSetup ? '/profile/setup' : redirectUrl
    
    // 쿠키에 토큰 설정하고 리다이렉트
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}${finalRedirectUrl}`)
    
    response.cookies.set('mdshare-access-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7일
    })

    return response

  } catch (error) {
    console.error('구글 OAuth 콜백 오류:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_failed`)
  }
}
