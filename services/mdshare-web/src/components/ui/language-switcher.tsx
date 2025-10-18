'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    // 현재 경로에서 언어 코드 제거
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/'
    
    // 새 언어로 리다이렉트
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4" />
      <Button
        variant={locale === 'ko' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('ko')}
        className="text-xs"
      >
        한국어
      </Button>
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('en')}
        className="text-xs"
      >
        English
      </Button>
    </div>
  )
}
