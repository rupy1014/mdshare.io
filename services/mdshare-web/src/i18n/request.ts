import { getRequestConfig } from 'next-intl/server'

// 지원하는 언어 목록
export const locales = ['ko', 'en'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // 지원하지 않는 언어인 경우 기본 언어 사용
  if (!locales.includes(locale as any)) {
    locale = 'ko'
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
