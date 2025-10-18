import { NextRequest, NextResponse } from 'next/server'
import { oauthService } from '@/lib/oauth-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const redirectUrl = searchParams.get('redirect') || '/dashboard'
    
    // 구글 OAuth URL 생성
    const authUrl = oauthService.getAuthUrl('google', redirectUrl)
    
    // 구글 OAuth 페이지로 리다이렉트
    return NextResponse.redirect(authUrl)
    
  } catch (error) {
    console.error('구글 OAuth 리다이렉트 오류:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'OAUTH_ERROR',
        message: 'OAuth 인증 중 오류가 발생했습니다'
      }
    }, { status: 500 })
  }
}
