import createMiddleware from 'next-intl/middleware'
import { locales } from './src/i18n/request'

export default createMiddleware({
  // 지원하는 언어 목록
  locales,
  
  // 기본 언어
  defaultLocale: 'ko',
  
  // 언어 감지 비활성화 (URL 기반으로만 처리)
  localeDetection: false
})

export const config = {
  // 모든 경로에 대해 미들웨어 실행 (API 경로 제외)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
