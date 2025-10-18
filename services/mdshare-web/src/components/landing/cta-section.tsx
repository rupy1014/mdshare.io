'use client'

import { Button } from '@/components/ui/button'
import { 
  Rocket,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

export function CtaSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-4">14일 무료로 월 800만원 달성하세요</h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          모든 프리미엄 기능을 14일간 무료로 체험하고 실제 성과를 확인하세요
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/ko/workspace/create">
              <Rocket className="h-4 w-4 mr-2" />
              14일 무료 체험
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <Link href="/ko/docs">
              <ExternalLink className="h-4 w-4 mr-2" />
              성공 사례 보기
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}